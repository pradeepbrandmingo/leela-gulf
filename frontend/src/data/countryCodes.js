import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import enNames from "react-phone-number-input/locale/en.json";

/**
 * Converts ISO 2-letter country code into flag emoji (e.g. US -> 🇺🇸, AE -> 🇦🇪, IN -> 🇮🇳)
 */
export function getCountryFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return "🌐";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

/**
 * Dynamically generated 240+ Worldwide Global Countries List
 * Using libphonenumber-js & react-phone-number-input datasets.
 */
export const GLOBAL_COUNTRIES = getCountries()
  .map((code) => {
    let dialCode = "";
    try {
      dialCode = `+${getCountryCallingCode(code)}`;
    } catch (e) {
      dialCode = "";
    }
    return {
      code,
      name: enNames[code] || code,
      dialCode,
      flag: getCountryFlagEmoji(code),
    };
  })
  .filter((c) => c.name && c.dialCode)
  .sort((a, b) => a.name.localeCompare(b.name));

/** List of service options for the enquiry dropdown matching client specification */
export const ENQUIRY_SERVICES = [
  "Chemical Sourcing Inquiry",
  "Custom Manufacturing requirements",
  "Request a Elixir demo",
  "Interest in joining the team",
  "Interested in other partnership",
];

/** List of known disposable domains for email spam classification */
const DISPOSABLE_DOMAINS = [
  "mailinator.com", "tempmail.com", "10minutemail.com", "trashmail.com",
  "guerrillamail.com", "yopmail.com", "dispostable.com", "sharklasers.com"
];

/**
 * Validates email and classifies quality score for Admin Dashboard.
 */
export function checkEmailQuality(email) {
  if (!email || typeof email !== 'string') return { isValid: false, quality: 'INVALID' };
  
  const emailTrimmed = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(emailTrimmed)) return { isValid: false, quality: 'INVALID' };

  const domain = emailTrimmed.split('@')[1];
  if (DISPOSABLE_DOMAINS.includes(domain)) {
    return { isValid: true, quality: 'SUSPICIOUS_SPAM' };
  }

  const prefix = emailTrimmed.split('@')[0];
  if (['test', 'asdf', 'qwerty', 'dummy', 'fake', 'admin123'].some(dummy => prefix.includes(dummy))) {
    return { isValid: true, quality: 'SUSPICIOUS_SPAM' };
  }

  return { isValid: true, quality: 'VALID_WORK_EMAIL' };
}
