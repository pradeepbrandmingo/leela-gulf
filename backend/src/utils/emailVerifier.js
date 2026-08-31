import dns from "dns";

// Common Disposable / Temporary Email Domains List
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
]);

/**
 * Perform real-time DNS MX Lookup to check if domain has a valid mail server
 */
const checkDomainMX = (domain) => {
  return new Promise((resolve) => {
    dns.resolveMx(domain, (err, addresses) => {
      if (err || !addresses || addresses.length === 0) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

/**
 * Automatic Background Email Verification (No OTP required for user)
 * @param {string} email
 * @returns {Promise<{ isSpam: boolean, emailStatus: string, emailQuality: string, score: number }>}
 */
export const verifyEmailBackground = async (email) => {
  if (!email || typeof email !== "string") {
    return {
      isSpam: true,
      emailStatus: "SPAM",
      emailQuality: "INVALID",
      score: 0,
    };
  }

  const cleanEmail = email.trim().toLowerCase();
  const emailParts = cleanEmail.split("@");

  if (emailParts.length !== 2) {
    return {
      isSpam: true,
      emailStatus: "SPAM",
      emailQuality: "INVALID_SYNTAX",
      score: 0,
    };
  }

  const domain = emailParts[1];

  // 1. Check if domain is a known disposable/temporary email provider
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      isSpam: true,
      emailStatus: "SPAM",
      emailQuality: "DISPOSABLE_TEMP_EMAIL",
      score: 10,
    };
  }

  // 2. Perform Real-Time DNS MX Lookup to check if domain exists and can receive emails
  const hasValidMX = await checkDomainMX(domain);

  if (!hasValidMX) {
    return {
      isSpam: true,
      emailStatus: "SPAM",
      emailQuality: "FAKE_DOMAIN_NO_MX",
      score: 0,
    };
  }

  // 3. Domain is Real & Active! Classify as Corporate Work Email vs Personal Email
  const freeProviders = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "icloud.com",
    "aol.com",
    "rediffmail.com",
    "protonmail.com",
    "zoho.com",
  ];

  const isPersonal = freeProviders.includes(domain);

  return {
    isSpam: false,
    emailStatus: "READY",
    emailQuality: isPersonal ? "PERSONAL_EMAIL" : "WORK_BUSINESS_EMAIL",
    score: isPersonal ? 85 : 98,
  };
};
