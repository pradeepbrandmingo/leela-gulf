import dns from "node:dns/promises";
import net from "node:net";
import EmailVerificationCache from "../models/EmailVerificationCache.js";

// ─────────────────────────────────────────────────────────────────────────────
// 1. DISPOSABLE & TEMPORARY MAIL DOMAINS BLACKLIST
// ─────────────────────────────────────────────────────────────────────────────
const DISPOSABLE_DOMAINS = new Set([
  "tempmail.com",
  "10minutemail.com",
  "mailinator.com",
  "yopmail.com",
  "guerrillamail.com",
  "trashmail.com",
  "dispostable.com",
  "fakeinbox.com",
  "sharklasers.com",
  "getnada.com",
  "maildrop.cc",
  "temp-mail.org",
  "throwawaymail.com",
  "emailondeck.com",
  "crazymailing.com",
  "boun.cr",
  "burnermail.io",
  "mytemp.email",
  "mohmal.com",
  "generator.email",
  "tempail.com",
  "tempinbox.com",
  "inboxkitten.com",
  "dropmail.me",
]);

// ─────────────────────────────────────────────────────────────────────────────
// 2. DUMMY / TEST KEYWORDS & GIBBERISH DETECTION
// ─────────────────────────────────────────────────────────────────────────────
const DUMMY_USERNAMES = new Set([
  "test",
  "testing",
  "dummy",
  "fake",
  "abcd",
  "abc",
  "asdf",
  "qwerty",
  "12345",
  "123456",
  "sample",
  "none",
  "null",
  "admin",
  "user",
  "demo",
  "test1",
  "test2",
  "example",
]);

// Common Free Personal Email Providers
const FREE_PROVIDERS = new Set([
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "aol.com",
  "rediffmail.com",
  "protonmail.com",
  "zoho.com",
  "live.com",
  "msn.com",
  "yandex.com",
]);

// ─────────────────────────────────────────────────────────────────────────────
// 3. SSRF IP & HOSTNAME GUARD
// ─────────────────────────────────────────────────────────────────────────────
function isPrivateIp(ip) {
  if (!ip) return true;
  // Localhost, private ranges (10.x, 172.16-31.x, 192.168.x, 127.x, 169.254.x, ::1)
  if (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("169.254.") ||
    ip.startsWith("127.")
  ) {
    return true;
  }
  const match172 = ip.match(/^172\.(\d+)\./);
  if (match172) {
    const octet = parseInt(match172[1], 10);
    if (octet >= 16 && octet <= 31) return true;
  }
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. SMTP CLIENT (PORT 25 HANDSHAKE WITHOUT SENDING DATA)
// ─────────────────────────────────────────────────────────────────────────────
const SMTP_PORT = 25;
const SMTP_TIMEOUT_MS = 6000; // 6 second max per MX attempt
const HELO_DOMAIN = "leelagulf.com";
const MAIL_FROM = "verify@leelagulf.com";

function parseReplyLine(line) {
  const match = line.match(/^(\d{3})([ -])(.*)$/);
  if (!match) return null;
  return {
    code: parseInt(match[1], 10),
    message: match[3] || "",
    isFinalLine: match[2] === " ",
  };
}

class SmtpSession {
  constructor(socket) {
    this.socket = socket;
    this.buffer = "";
  }

  readReply() {
    return new Promise((resolve, reject) => {
      const tryParse = () => {
        const lines = this.buffer.split("\r\n").filter(Boolean);
        for (const line of lines) {
          const parsed = parseReplyLine(line);
          if (parsed && parsed.isFinalLine) {
            this.buffer = "";
            cleanup();
            resolve(parsed);
            return true;
          }
        }
        return false;
      };

      const onData = (chunk) => {
        this.buffer += chunk.toString("utf8");
        tryParse();
      };
      const onError = (err) => {
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

      if (tryParse()) return;
    });
  }

  send(command) {
    try {
      this.socket.write(`${command}\r\n`);
    } catch (_) {}
  }
}

async function performSmtpProbe(mxHost, targetEmail) {
  return new Promise((resolve) => {
    let settled = false;
    const socket = net.createConnection({ host: mxHost, port: SMTP_PORT });

    const finish = (result) => {
      if (!settled) {
        settled = true;
        try {
          socket.write("QUIT\r\n");
          socket.end();
          socket.destroy();
        } catch (_) {}
        resolve(result);
      }
    };

    socket.setTimeout(SMTP_TIMEOUT_MS, () => {
      finish({ status: "timeout", reason: "SMTP connection timed out" });
    });

    socket.on("error", (err) => {
      finish({ status: "error", reason: err.message || "Connection refused / port blocked" });
    });

    socket.on("connect", async () => {
      try {
        const session = new SmtpSession(socket);
        const greeting = await session.readReply();
        if (greeting.code !== 220) {
          return finish({ status: "unknown", code: greeting.code, reason: `Invalid greeting code: ${greeting.code}` });
        }

        session.send(`EHLO ${HELO_DOMAIN}`);
        const ehloReply = await session.readReply();
        if (ehloReply.code !== 250 && ehloReply.code !== 220) {
          session.send(`HELO ${HELO_DOMAIN}`);
          await session.readReply();
        }

        session.send(`MAIL FROM:<${MAIL_FROM}>`);
        const mailReply = await session.readReply();
        if (mailReply.code !== 250 && mailReply.code !== 220) {
          return finish({ status: "unknown", code: mailReply.code, reason: `MAIL FROM rejected: ${mailReply.code}` });
        }

        session.send(`RCPT TO:<${targetEmail}>`);
        const rcptReply = await session.readReply();

        if (rcptReply.code === 250 || rcptReply.code === 251) {
          finish({ status: "deliverable", code: rcptReply.code, reason: "Mailbox exists and accepts messages" });
        } else if (rcptReply.code >= 500 && rcptReply.code < 600) {
          finish({ status: "undeliverable", code: rcptReply.code, reason: `Mailbox does not exist: ${rcptReply.message || rcptReply.code}` });
        } else if (rcptReply.code === 450 || rcptReply.code === 451 || rcptReply.code === 452) {
          finish({ status: "unknown", code: rcptReply.code, reason: `Temporary greylisting / mailbox busy (${rcptReply.code})` });
        } else {
          finish({ status: "unknown", code: rcptReply.code, reason: `SMTP code ${rcptReply.code}` });
        }
      } catch (e) {
        finish({ status: "error", reason: e.message || "SMTP transaction error" });
      }
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. MASTER EMAIL VERIFIER PIPELINE (MAILCHECK CORE ENGINE)
// ─────────────────────────────────────────────────────────────────────────────
export const verifyEmailBackground = async (rawEmail) => {
  if (!rawEmail || typeof rawEmail !== "string") {
    return {
      isSpam: true,
      emailStatus: "undeliverable",
      emailQuality: "INVALID_SYNTAX",
      emailReason: "Email address is missing or not a string",
      score: 0,
    };
  }

  const cleanEmail = rawEmail.trim().toLowerCase();

  // 1. Check 24-Hour MongoDB Cache (Prevents Google/Yahoo Rate-Limiting & Speeds up Response)
  try {
    const cached = await EmailVerificationCache.findOne({ normalizedEmail: cleanEmail }).lean();
    if (cached) {
      return {
        isSpam: cached.isSpam,
        emailStatus: cached.emailStatus,
        emailQuality: cached.emailQuality,
        emailReason: `${cached.emailReason} (Cached 24h)`,
        score: cached.score,
        fromCache: true,
      };
    }
  } catch (_) {}

  // 2. Format & Syntax Validation (HTML5 / RFC Standard)
  const HTML5_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!HTML5_REGEX.test(cleanEmail) || cleanEmail.length > 254) {
    return {
      isSpam: true,
      emailStatus: "undeliverable",
      emailQuality: "INVALID_SYNTAX",
      emailReason: "Invalid email syntax or format",
      score: 0,
    };
  }

  const atIndex = cleanEmail.lastIndexOf("@");
  const localPart = cleanEmail.slice(0, atIndex);
  const domain = cleanEmail.slice(atIndex + 1);

  if (localPart.length > 64 || domain.length > 255 || !domain.includes(".")) {
    return {
      isSpam: true,
      emailStatus: "undeliverable",
      emailQuality: "INVALID_SYNTAX",
      emailReason: "Invalid local part or domain length",
      score: 0,
    };
  }

  // 3. Disposable / Temporary Email Check
  if (DISPOSABLE_DOMAINS.has(domain)) {
    const result = {
      isSpam: true,
      emailStatus: "undeliverable",
      emailQuality: "DISPOSABLE_TEMP_EMAIL",
      emailReason: "Disposable temporary email provider detected",
      score: 10,
    };
    saveToCache(cleanEmail, result);
    return result;
  }

  // 4. Smart Dummy / Test Keyword Detection
  const cleanLocal = localPart.replace(/[^a-zA-Z0-9]/g, "");
  const isDummy = DUMMY_USERNAMES.has(cleanLocal) || /^([a-z])\1{4,}$/.test(cleanLocal);

  // 5. DNS MX Lookup
  let mxRecords = [];
  try {
    mxRecords = await dns.resolveMx(domain);
  } catch (err) {
    // Check if domain resolves to A record as fallback
    try {
      const aRecords = await dns.resolve4(domain);
      if (aRecords && aRecords.length > 0) {
        mxRecords = [{ exchange: aRecords[0], priority: 10 }];
      }
    } catch (_) {}
  }

  if (!mxRecords || mxRecords.length === 0) {
    const result = {
      isSpam: true,
      emailStatus: "undeliverable",
      emailQuality: "FAKE_DOMAIN_NO_MX",
      emailReason: "No MX or mail exchange server found for domain",
      score: 0,
    };
    saveToCache(cleanEmail, result);
    return result;
  }

  // Sort MX records by priority (lowest number = highest priority)
  mxRecords.sort((a, b) => (a.priority || 0) - (b.priority || 0));
  const primaryMx = mxRecords[0].exchange;

  // SSRF Protection on MX address
  try {
    const mxIps = await dns.resolve4(primaryMx).catch(() => []);
    if (mxIps.length > 0 && isPrivateIp(mxIps[0])) {
      const result = {
        isSpam: true,
        emailStatus: "undeliverable",
        emailQuality: "SSRF_BLOCKED",
        emailReason: "Mail server resolves to a private/forbidden IP address",
        score: 0,
      };
      saveToCache(cleanEmail, result);
      return result;
    }
  } catch (_) {}

  // 6. Attempt SMTP Recipient Handshake (Port 25 Probe)
  let smtpResult = { status: "unknown", reason: "Skipped" };
  try {
    smtpResult = await performSmtpProbe(primaryMx, cleanEmail);
  } catch (err) {
    smtpResult = { status: "unknown", reason: err.message || "SMTP probe failed" };
  }

  const isPersonal = FREE_PROVIDERS.has(domain);
  const quality = isPersonal ? "PERSONAL_EMAIL" : "WORK_BUSINESS_EMAIL";

  // If SMTP conclusively confirms mailbox exists or doesn't exist:
  if (smtpResult.status === "undeliverable") {
    const result = {
      isSpam: true,
      emailStatus: "undeliverable",
      emailQuality: quality,
      emailReason: smtpResult.reason || "Mailbox rejected by server",
      score: 10,
    };
    saveToCache(cleanEmail, result);
    return result;
  }

  if (smtpResult.status === "deliverable") {
    if (isDummy) {
      const result = {
        isSpam: false,
        emailStatus: "unknown",
        emailQuality: "SUSPICIOUS_DUMMY_PATTERN",
        emailReason: `Mailbox exists, but username matches test pattern (${localPart})`,
        score: 40,
      };
      saveToCache(cleanEmail, result);
      return result;
    }
    const result = {
      isSpam: false,
      emailStatus: "deliverable",
      emailQuality: quality,
      emailReason: isPersonal ? "Verified Active Personal Mailbox" : "Verified Corporate Business Mailbox",
      score: isPersonal ? 85 : 98,
    };
    saveToCache(cleanEmail, result);
    return result;
  }

  // If SMTP port is blocked / timed out / greylisted on hosting, use MX + Heuristic classification:
  if (isDummy) {
    const result = {
      isSpam: false,
      emailStatus: "unknown",
      emailQuality: "SUSPICIOUS_DUMMY_PATTERN",
      emailReason: `Valid domain MX, but test/dummy username pattern detected (${localPart})`,
      score: 30,
    };
    saveToCache(cleanEmail, result);
    return result;
  }

  const result = {
    isSpam: false,
    emailStatus: "deliverable",
    emailQuality: quality,
    emailReason: isPersonal ? "Active Personal Email Domain (MX Verified)" : "Active Corporate Business Domain (MX Verified)",
    score: isPersonal ? 80 : 95,
  };
  saveToCache(cleanEmail, result);
  return result;
};

// Helper to silently save verification to 24h MongoDB Cache without blocking execution
function saveToCache(normalizedEmail, result) {
  try {
    EmailVerificationCache.findOneAndUpdate(
      { normalizedEmail },
      {
        normalizedEmail,
        isSpam: result.isSpam,
        emailStatus: result.emailStatus,
        emailQuality: result.emailQuality,
        emailReason: result.emailReason,
        score: result.score,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).catch(() => {});
  } catch (_) {}
}
