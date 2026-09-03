# MailCheck

A B2B SaaS dashboard for **email deliverability verification** — checking whether
an email address currently *appears* technically capable of receiving mail,
without sending an actual email and without any ownership/OTP verification.

MailCheck performs, for every check:

1. **Format validation** — syntax + RFC 5321 length limits
2. **Domain validation** — does the domain resolve at all
3. **DNS/MX lookup** — mail routing records, sorted by priority, with RFC 5321
   "implicit MX" fallback to A/AAAA
4. **SMTP recipient verification** — `EHLO` → `MAIL FROM` → `RCPT TO` → `QUIT`
   against the real mail server, **stopping before `DATA`**, so no message is
   ever sent

Result: `deliverable`, `undeliverable`, or `unknown` — never a false certainty.

---

## Quick start

```bash
npm install
cp .env.example .env      # then edit DATABASE_URL etc.
npm run prisma:migrate    # creates the Verification table
npm run prisma:seed       # optional demo data
npm run dev
```

Open http://localhost:3000 — it redirects to `/dashboard`.

### Configuring PostgreSQL

Point `DATABASE_URL` in `.env` at any PostgreSQL 13+ database, e.g.:

```
DATABASE_URL="postgresql://user:password@localhost:5432/mailcheck?schema=public"
```

Local options: `docker run -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:16`,
or a hosted instance (Neon, Supabase, RDS, etc).

### Running Prisma migrations

```bash
npm run prisma:migrate     # dev: creates/updates the schema interactively
npm run prisma:deploy      # CI/production: applies existing migrations only
```

`npm run prisma:generate` regenerates the Prisma Client after any
`prisma/schema.prisma` change (this also runs automatically after `npm install`
in a normal environment with unrestricted network access to
`binaries.prisma.sh`, which the Prisma CLI needs to download its query
engine binary).

### Seeding demo data

```bash
npm run prisma:seed
```

Inserts a handful of realistic-looking history rows (`deliverable`,
`undeliverable`, `unknown`, greylisted, catch-all, timeout, and one
intentionally malformed address) so the dashboard isn't empty on first run.
Every seeded address uses `example.com` or a `.test` domain (RFC 2606
reserved for documentation/testing) and is flagged `isDemoData: true` — the
UI shows a "demo" badge on those rows. **No real people's email addresses
are used anywhere in this codebase.**

### Development server

```bash
npm run dev
```

---

## How SMTP verification works

For the target domain's MX hosts (tried in priority order, primary first):

1. Open a raw TCP connection to port 25 of the resolved mail server IP
2. Wait for the `220` greeting
3. `EHLO <configured HELO domain>`
4. `MAIL FROM:<EMAIL_VERIFICATION_FROM>`
5. `RCPT TO:<the address being checked>`
6. (optionally) probe a second, randomized `RCPT TO:<random>@<domain>` to
   detect catch-all servers — see below
7. `QUIT` and close the socket

**`DATA` is never sent, at any point, by any code path.** No message content
is transmitted; nothing is delivered to any mailbox. This is a pure protocol
handshake, the same one every real mail server performs with every other mail
server on the internet before it accepts a message — MailCheck simply stops
one step earlier than an actual send.

### Response classification (`classifySmtpResponse`)

| Code range | Meaning (RFC 5321 §4.2.1)         | Verdict          |
|-----------:|------------------------------------|------------------|
| 2xx        | Recipient accepted                 | `deliverable`    |
| 5xx        | Permanent rejection                | `undeliverable`  |
| 4xx        | Temporary failure (greylisting, quota, etc.) | `unknown` — **never** `undeliverable` |
| no code / connection drop / timeout | inconclusive       | `unknown`        |

### Catch-all detection

After a real recipient is accepted (2xx), MailCheck sends one additional
`RCPT TO` for a randomized, near-certainly-nonexistent local part at the same
domain (still no `DATA`). If the server also accepts *that* address, the
domain is flagged `catchAllSuspected` and the overall result is downgraded to
`unknown` — a 2xx from a catch-all server does not confirm the specific
mailbox exists.

### Why the result is not 100% guaranteed

Some receiving mail providers deliberately return a 2xx for every recipient
(and reject at a later stage, or silently drop mail) specifically to prevent
this kind of enumeration. Others rate-limit or greylist unfamiliar senders,
producing a temporary 4xx that says nothing about the mailbox itself. MailCheck
surfaces these as `unknown` rather than guessing. The UI states this
explicitly: *"This check estimates email deliverability using DNS and SMTP
signals. Some mail providers intentionally hide mailbox existence, so an
'Unknown' result does not necessarily mean the address is invalid."*

MailCheck never claims to prove mailbox ownership, guarantee delivery, or
guarantee the address "exists" with certainty — only that the mail server
did or didn't accept it at check time.

---

## Security considerations

**SSRF protection (`lib/email/ssrf-guard.ts`)** — the API accepts *only*
`{ email, recheck }` from the client. The server alone resolves which MX host
to contact; a client can never supply a host or port. Before opening any TCP
socket, every resolved IP is checked against blocked ranges: loopback
(127.0.0.0/8, `::1`), private IPv4 (10/8, 172.16/12, 192.168/16),
link-local/cloud-metadata (169.254.0.0/16, `fe80::/10`), unique-local IPv6
(`fc00::/7`), multicast, IPv4-mapped-IPv6 tunnels of the above, `TEST-NET`
ranges, and hostnames ending in `localhost`/`.local`/`.internal`. Only port 25
is ever dialed, and it is hardcoded — not derived from any request field.

**Rate limiting** — `POST /api/verify-email` is limited (default 20
req/min/IP, `RATE_LIMIT_PER_MINUTE`) via a pluggable `RateLimiter` interface
(`lib/rate-limit/rate-limiter.ts`). The shipped implementation is in-memory,
which is correct for a single dev/demo instance but **not** shared across
serverless invocations or horizontal replicas — implement `RedisRateLimiter`
(stubbed in that file) and set `RATE_LIMIT_REDIS_URL` before scaling out.

**Error handling** — the API never returns a raw exception message to the
client (see `toApiResponse`/`errorResponse` in
`app/api/verify-email/route.ts`); technical details are logged server-side
only, structured, and without full email addresses in the log line's top
level (only domain/host/duration/status/code are intended for
production log aggregation — see comments in the route handler for where to
extend this).

**Caching** — identical addresses checked within `VERIFICATION_CACHE_HOURS`
(default 24h) return the stored result instead of re-running SMTP
verification, reducing outbound SMTP traffic and third-party rate-limit
exposure. Pass `"recheck": true` to force a fresh check.

---

## Deployment requirements

The verification endpoint (`app/api/verify-email/route.ts`) is pinned to
`export const runtime = "nodejs"` because it opens raw TCP sockets
(`node:net`) — this is not possible on an Edge runtime.

**Outbound SMTP (port 25) connectivity is not guaranteed on most serverless
platforms.** Many providers (including most PaaS/serverless hosts) block
outbound port 25 by default to prevent spam abuse. Before deploying:

- Confirm your hosting provider allows outbound TCP on port 25, or
- Run the verification worker on a VM/container platform that does (e.g. a
  dedicated EC2/GCE instance, or a provider that explicitly allow-lists SMTP),
  or
- Move `lib/email/smtp-verifier.ts` into a separate worker service reachable
  from the main app, keeping the same `verifySmtpRecipient` interface, so the
  web app itself can stay on any host.

If SMTP connections cannot be made in your environment, the engine already
degrades correctly: `smtp-verifier.ts` returns `connectionStatus: "failed"`
or `"timeout"` for unreachable hosts, which `email-verifier.ts` maps to the
overall status `unknown` — never a fabricated `deliverable`/`undeliverable`.
This is a deliberate design constraint: **the app must never fake a
verification result.**

---

## Project structure

```
app/
  api/
    verify-email/route.ts    # POST — the core verification endpoint
    verifications/route.ts   # GET  — searchable/paginated history
    stats/route.ts           # GET  — dashboard counts
  dashboard/page.tsx
  verify/page.tsx
  history/page.tsx
  api-docs/page.tsx
  settings/page.tsx

components/
  email/                     # verifier form, result card, checks list
  dashboard/                 # stats cards, history table, detail drawer
  layout/app-shell.tsx       # sidebar + mobile drawer
  ui/                        # card, status pill primitives

lib/
  email/
    format-validator.ts
    dns-validator.ts
    mx-resolver.ts
    classify-smtp-response.ts
    smtp-verifier.ts          # the EHLO/MAIL FROM/RCPT TO/QUIT handshake
    ssrf-guard.ts
    email-verifier.ts         # orchestrates the pipeline above
    types.ts
  db/prisma.ts
  rate-limit/rate-limiter.ts
  validation/schemas.ts

prisma/
  schema.prisma
  seed/seed.ts

tests/
  unit/                       # format, classification, SSRF guard, MX sort
  integration/                # POST /api/verify-email (DNS/SMTP/DB mocked)
```

---

## Testing

```bash
npm run test        # vitest — DNS and SMTP are mocked, no real network calls
npm run lint
npm run typecheck
npm run build
```

Unit tests cover: format validation edge cases, MX priority sorting and
DNS-error handling (NXDOMAIN vs. SERVFAIL vs. implicit-MX fallback), SMTP
response classification (2xx/4xx/5xx/malformed), and SSRF-guard IP range
blocking. The integration test drives the real `POST /api/verify-email`
route handler with the DNS/SMTP engine and Prisma client mocked, and
specifically asserts that a raw internal error message is never present in
the client-facing JSON response.

None of the tests make real DNS or SMTP connections — they mock
`node:dns/promises` and the verification engine so results are deterministic
and don't depend on any real mailbox's current state.

---

## Environment variables

See `.env.example`. Every network timeout, the SMTP `MAIL FROM`/`EHLO`
identity, the result-cache window, and the rate limit are configurable —
none are hardcoded.
