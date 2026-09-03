import net from "node:net";
import dns from "node:dns/promises";
import { isPublicAddress, isBlockedHostname } from "./ssrf-guard";
import { classifySmtpResponse } from "./classify-smtp-response";
import type { MxRecord, SmtpCheckResult } from "./types";

const SMTP_PORT = 25; // never configurable via request input — see ssrf-guard.ts
const SMTP_TIMEOUT_MS = Number(process.env.SMTP_TIMEOUT_MS ?? 10000);
const VERIFICATION_FROM = process.env.EMAIL_VERIFICATION_FROM || "postmaster@example.com";
const HELO_DOMAIN = (process.env.EMAIL_VERIFICATION_FROM || "example.com").split("@")[1] ?? "example.com";
const MAX_MX_ATTEMPTS = Number(process.env.SMTP_MAX_MX_ATTEMPTS ?? 2);

interface ParsedReply {
  code: number;
  message: string;
  isFinalLine: boolean;
}

/** Parses one line of an SMTP reply. Multi-line replies use "250-" then a final "250 ". */
function parseReplyLine(line: string): ParsedReply | null {
  const match = line.match(/^(\d{3})([ -])(.*)$/);
  if (!match) return null;
  return {
    code: Number.parseInt(match[1]!, 10),
    message: match[3] ?? "",
    isFinalLine: match[2] === " ",
  };
}

/**
 * A minimal, purpose-built SMTP client for the recipient-verification
 * handshake only. It intentionally implements nothing beyond:
 *   connect -> read 220 -> EHLO -> MAIL FROM -> RCPT TO[, RCPT TO probe] -> QUIT
 * It has no DATA command support at all, by design — see the module-level
 * comment in email-verifier.ts.
 */
class SmtpSession {
  private socket: net.Socket;
  private buffer = "";
  private closed = false;

  constructor(socket: net.Socket) {
    this.socket = socket;
  }

  /** Reads until a *final* (non-continuation) reply line is available. */
  private readReply(): Promise<ParsedReply> {
    return new Promise((resolve, reject) => {
      const tryParse = () => {
        const lines = this.buffer.split("\r\n").filter(Boolean);
        for (const line of lines) {
          const parsed = parseReplyLine(line);
          if (parsed?.isFinalLine) {
            this.buffer = "";
            cleanup();
            resolve(parsed);
            return true;
          }
        }
        return false;
      };

      const onData = (chunk: Buffer) => {
        this.buffer += chunk.toString("utf8");
        tryParse();
      };
      const onError = (err: Error) => {
        cleanup();
        reject(err);
      };
      const onClose = () => {
        cleanup();
        reject(new Error("SMTP_CONNECTION_CLOSED"));
      };
      const cleanup = () => {
        this.socket.off("data", onData);
        this.socket.off("error", onError);
        this.socket.off("close", onClose);
      };

      this.socket.on("data", onData);
      this.socket.on("error", onError);
      this.socket.on("close", onClose);

      // In case data already arrived before we attached listeners.
      if (tryParse()) return;
    });
  }

  private send(command: string): void {
    this.socket.write(`${command}\r\n`);
  }

  async readGreeting(): Promise<ParsedReply> {
    return this.readReply();
  }

  async ehlo(): Promise<ParsedReply> {
    this.send(`EHLO ${HELO_DOMAIN}`);
    return this.readReply();
  }

  async mailFrom(): Promise<ParsedReply> {
    this.send(`MAIL FROM:<${VERIFICATION_FROM}>`);
    return this.readReply();
  }

  /** Sends RCPT TO for the given address. Does NOT send DATA — ever. */
  async rcptTo(address: string): Promise<ParsedReply> {
    this.send(`RCPT TO:<${address}>`);
    return this.readReply();
  }

  quit(): void {
    if (this.closed) return;
    try {
      this.send("QUIT");
    } catch {
      // ignore — we're closing anyway
    }
  }

  destroy(): void {
    if (this.closed) return;
    this.closed = true;
    this.socket.destroy();
  }
}

function connectWithTimeout(host: string, port: number, timeoutMs: number): Promise<net.Socket> {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host, port });
    const timer = setTimeout(() => {
      socket.destroy();
      reject(new Error("SMTP_CONNECT_TIMEOUT"));
    }, timeoutMs);

    socket.once("connect", () => {
      clearTimeout(timer);
      resolve(socket);
    });
    socket.once("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

function withOverallTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("SMTP_OVERALL_TIMEOUT")), ms);
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      }
    );
  });
}

/**
 * Resolves an MX hostname to a public IP address, refusing to proceed if
 * every resolved address is private/reserved (SSRF protection).
 */
async function resolvePublicAddress(hostname: string): Promise<string | null> {
  if (isBlockedHostname(hostname)) return null;

  const addresses: string[] = [];
  try {
    addresses.push(...(await dns.resolve4(hostname)));
  } catch {
    /* try v6 below */
  }
  if (addresses.length === 0) {
    try {
      addresses.push(...(await dns.resolve6(hostname)));
    } catch {
      /* fall through */
    }
  }

  const publicAddress = addresses.find((addr) => isPublicAddress(addr));
  return publicAddress ?? null;
}

/**
 * Attempts SMTP recipient verification against a single MX host. Returns
 * null if this host could not be reached at all (caller should try the
 * next MX in priority order), otherwise a definitive-for-this-host result.
 */
async function verifyAgainstHost(
  mxHost: string,
  targetEmail: string,
  domain: string,
  checkCatchAll: boolean
): Promise<SmtpCheckResult | null> {
  const publicAddress = await resolvePublicAddress(mxHost);
  if (!publicAddress) {
    return null; // could not safely resolve this host; try next MX
  }

  let socket: net.Socket;
  try {
    socket = await connectWithTimeout(publicAddress, SMTP_PORT, SMTP_TIMEOUT_MS);
  } catch (err) {
    if ((err as Error).message === "SMTP_CONNECT_TIMEOUT") {
      return { connectionStatus: "timeout", recipientStatus: "unknown", mxHost, reason: "Connection to mail server timed out." };
    }
    return null; // connection refused/reset -> try next MX
  }

  const session = new SmtpSession(socket);

  try {
    const run = async (): Promise<SmtpCheckResult> => {
      const greeting = await session.readGreeting();
      if (greeting.code < 200 || greeting.code >= 300) {
        return {
          connectionStatus: "failed",
          recipientStatus: "unknown",
          mxHost,
          code: greeting.code,
          message: greeting.message,
          reason: "Mail server did not greet with a 2xx banner.",
        };
      }

      await session.ehlo();
      // We don't hard-fail on a non-2xx EHLO — some servers are picky but
      // still accept mail; we only need MAIL FROM / RCPT TO to work.
      await session.mailFrom();

      const rcpt = await session.rcptTo(targetEmail);

      let catchAllSuspected = false;
      if (checkCatchAll && rcpt.code >= 200 && rcpt.code < 300) {
        catchAllSuspected = await probeCatchAll(session, domain);
      }

      session.quit();

      return {
        connectionStatus: "success",
        recipientStatus: rcpt.code >= 200 && rcpt.code < 300 ? "accepted" : rcpt.code >= 500 ? "rejected" : "unknown",
        code: rcpt.code,
        message: rcpt.message,
        mxHost,
        catchAllSuspected,
      };
    };

    return await withOverallTimeout(run(), SMTP_TIMEOUT_MS);
  } catch (err) {
    const message = (err as Error).message;
    if (message === "SMTP_OVERALL_TIMEOUT") {
      return { connectionStatus: "timeout", recipientStatus: "unknown", mxHost, reason: "SMTP session timed out." };
    }
    return { connectionStatus: "failed", recipientStatus: "unknown", mxHost, reason: "Connection reset during SMTP session." };
  } finally {
    session.destroy();
  }
}

/**
 * Sends a second RCPT TO for a randomized, near-certainly-nonexistent
 * local part at the same domain. If the server also accepts THAT
 * recipient, it is very likely a catch-all (accept-all) server, meaning a
 * 2xx for the real address does not confirm the specific mailbox exists.
 *
 * This still never sends DATA / an actual message.
 */
async function probeCatchAll(session: SmtpSession, domain: string): Promise<boolean> {
  try {
    const probeLocalPart = `verify-probe-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const probeReply = await session.rcptTo(`${probeLocalPart}@${domain}`);
    return probeReply.code >= 200 && probeReply.code < 300;
  } catch {
    return false;
  }
}

/**
 * Verifies a recipient against a domain's MX hosts, in priority order,
 * stopping as soon as a definitive (non-null) result is obtained from a
 * reachable host. Only the first MAX_MX_ATTEMPTS hosts are tried, to bound
 * total verification time.
 */
export async function verifySmtpRecipient(
  email: string,
  domain: string,
  mxRecords: MxRecord[],
  options: { checkCatchAll?: boolean } = {}
): Promise<SmtpCheckResult> {
  const sorted = [...mxRecords].sort((a, b) => a.priority - b.priority).slice(0, MAX_MX_ATTEMPTS);

  if (sorted.length === 0) {
    return { connectionStatus: "skipped", recipientStatus: "unknown", reason: "No MX host available to verify against." };
  }

  for (const record of sorted) {
    const result = await verifyAgainstHost(record.exchange, email, domain, options.checkCatchAll ?? true);
    if (result !== null) return result;
    // else: this host was unreachable/unsafe — fall through to next MX
  }

  return {
    connectionStatus: "failed",
    recipientStatus: "unknown",
    reason: "None of the domain's mail servers could be reached.",
  };
}

export { classifySmtpResponse };
