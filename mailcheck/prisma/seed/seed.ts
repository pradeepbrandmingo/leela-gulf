/**
 * Seeds realistic-looking DEMO verification history so the dashboard isn't
 * empty on first run. All addresses use RFC 2606 reserved demo/test
 * domains (.test, .example) or the standard example.com/example.org —
 * never real people's addresses.
 *
 * Run with: npm run prisma:seed
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEMO_ROWS = [
  {
    email: "alex@example.com",
    normalizedEmail: "alex@example.com",
    status: "deliverable" as const,
    formatStatus: "pass" as const,
    domainStatus: "pass" as const,
    mxStatus: "found" as const,
    smtpStatus: "success" as const,
    smtpRecipientStatus: "accepted" as const,
    smtpCode: 250,
    smtpMessage: "2.1.5 OK",
    mxHost: "mail.example.com",
    catchAllSuspected: false,
  },
  {
    email: "sales@demo-company.test",
    normalizedEmail: "sales@demo-company.test",
    status: "deliverable" as const,
    formatStatus: "pass" as const,
    domainStatus: "pass" as const,
    mxStatus: "found" as const,
    smtpStatus: "success" as const,
    smtpRecipientStatus: "accepted" as const,
    smtpCode: 250,
    smtpMessage: "2.1.5 Ok, accepted",
    mxHost: "mx1.demo-company.test",
    catchAllSuspected: false,
  },
  {
    email: "fake@randomdomain123xyz.test",
    normalizedEmail: "fake@randomdomain123xyz.test",
    status: "undeliverable" as const,
    formatStatus: "pass" as const,
    domainStatus: "fail" as const,
    mxStatus: "not_found" as const,
    smtpStatus: "skipped" as const,
    smtpRecipientStatus: null,
    smtpCode: null,
    smtpMessage: null,
    mxHost: null,
    catchAllSuspected: false,
  },
  {
    email: "bounced@sample-business.test",
    normalizedEmail: "bounced@sample-business.test",
    status: "undeliverable" as const,
    formatStatus: "pass" as const,
    domainStatus: "pass" as const,
    mxStatus: "found" as const,
    smtpStatus: "success" as const,
    smtpRecipientStatus: "rejected" as const,
    smtpCode: 550,
    smtpMessage: "5.1.1 The email account does not exist.",
    mxHost: "mx.sample-business.test",
    catchAllSuspected: false,
  },
  {
    email: "hello@sample-business.test",
    normalizedEmail: "hello@sample-business.test",
    status: "unknown" as const,
    formatStatus: "pass" as const,
    domainStatus: "pass" as const,
    mxStatus: "found" as const,
    smtpStatus: "success" as const,
    smtpRecipientStatus: "accepted" as const,
    smtpCode: 250,
    smtpMessage: "2.1.5 OK",
    mxHost: "mx.sample-business.test",
    catchAllSuspected: true,
  },
  {
    email: "info@greylisted-example.test",
    normalizedEmail: "info@greylisted-example.test",
    status: "unknown" as const,
    formatStatus: "pass" as const,
    domainStatus: "pass" as const,
    mxStatus: "found" as const,
    smtpStatus: "success" as const,
    smtpRecipientStatus: "unknown" as const,
    smtpCode: 450,
    smtpMessage: "4.2.0 Greylisted, please try again later.",
    mxHost: "mx.greylisted-example.test",
    catchAllSuspected: false,
  },
  {
    email: "not-an-email",
    normalizedEmail: "not-an-email",
    status: "undeliverable" as const,
    formatStatus: "fail" as const,
    domainStatus: "unknown" as const,
    mxStatus: "unknown" as const,
    smtpStatus: "skipped" as const,
    smtpRecipientStatus: null,
    smtpCode: null,
    smtpMessage: null,
    mxHost: null,
    catchAllSuspected: false,
  },
  {
    email: "unreachable@timeout-example.test",
    normalizedEmail: "unreachable@timeout-example.test",
    status: "unknown" as const,
    formatStatus: "pass" as const,
    domainStatus: "pass" as const,
    mxStatus: "found" as const,
    smtpStatus: "timeout" as const,
    smtpRecipientStatus: "unknown" as const,
    smtpCode: null,
    smtpMessage: null,
    mxHost: "mx.timeout-example.test",
    catchAllSuspected: false,
  },
];

async function main() {
  console.log(`Seeding ${DEMO_ROWS.length} demo verification records…`);

  for (const [i, row] of DEMO_ROWS.entries()) {
    await prisma.verification.create({
      data: {
        ...row,
        isDemoData: true,
        // Stagger timestamps over the last few days so History/date filters
        // have something to show.
        checkedAt: new Date(Date.now() - i * 6 * 60 * 60 * 1000),
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
