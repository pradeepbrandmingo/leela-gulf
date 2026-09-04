import geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';
import ct from 'countries-and-timezones';
import isoCountries from 'i18n-iso-countries';

// Module-level singleton instance for Intl.DisplayNames (cached for performance)
let displayNamesSingleton = null;

/**
 * Validates ISO 3166-1 alpha-2 code and returns English country name via Node.js Intl.DisplayNames
 * Cached module-level singleton prevents repeated instantiations under high load
 */
const getCountryName = (isoCode) => {
  if (!isoCode || typeof isoCode !== 'string') return 'Unknown';
  const cleanCode = isoCode.trim().toUpperCase();

  // Validate official ISO 3166-1 alpha-2 country code (rejects XX, ZZ, T1, numbers, etc.)
  if (!isoCountries.isValid(cleanCode)) {
    return 'Unknown';
  }

  try {
    if (!displayNamesSingleton) {
      displayNamesSingleton = new Intl.DisplayNames(['en'], { type: 'region' });
    }
    const name = displayNamesSingleton.of(cleanCode);
    return (name && name !== cleanCode) ? name : cleanCode;
  } catch {
    return cleanCode;
  }
};

/**
 * IANA Timezone -> Country info via countries-and-timezones package
 * Secondary fallback for localhost / development / masked IP environments
 */
const getCountryFromTimezone = (timezone) => {
  if (!timezone) return null;
  try {
    const c = ct.getCountryForTimezone(timezone);
    if (c && c.id) {
      return { code: c.id, name: (c.name || getCountryName(c.id)) };
    }
  } catch {
    // falls through to next layer
  }
  return null;
};

/**
 * Robust IPv4 and IPv6 Private / Local IP detection
 * Covers:
 *  - IPv4 Loopback (127.0.0.0/8)
 *  - IPv4 RFC1918 Private (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)
 *  - IPv4 Link-Local / APIPA (169.254.0.0/16)
 *  - IPv4 Carrier-Grade NAT (100.64.0.0/10)
 *  - IPv6 Loopback (::1)
 *  - IPv6 Unique Local Addresses ULA (fc00::/7 - starts with fc or fd)
 *  - IPv6 Link-Local Unicast (fe80::/10 - starts with fe8, fe9, fea, feb)
 *  - IPv4-mapped IPv6 (::ffff:x.x.x.x)
 */
export const isPrivateOrLocalIP = (ipAddress) => {
  if (!ipAddress) return true;

  let ip = ipAddress.trim();

  // Strip IPv4-mapped IPv6 prefix if present (e.g. ::ffff:192.168.1.1 -> 192.168.1.1)
  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }

  // Remove port if present (e.g. 127.0.0.1:54321 or [::1]:8080)
  if (ip.startsWith('[') && ip.includes(']')) {
    ip = ip.substring(1, ip.indexOf(']'));
  } else if (ip.includes('.') && ip.includes(':')) {
    ip = ip.split(':')[0];
  }

  // Standard Local / Unspecified
  if (
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip === 'localhost' ||
    ip === '0.0.0.0' ||
    ip === '::' ||
    ip.startsWith('127.')
  ) {
    return true;
  }

  // IPv6 ULA (fc00::/7 -> fc.. or fd..)
  const lowerIp = ip.toLowerCase();
  if (lowerIp.startsWith('fc') || lowerIp.startsWith('fd')) {
    return true;
  }

  // IPv6 Link-Local (fe80::/10 -> fe8.., fe9.., fea.., feb..)
  if (
    lowerIp.startsWith('fe8') ||
    lowerIp.startsWith('fe9') ||
    lowerIp.startsWith('fea') ||
    lowerIp.startsWith('feb')
  ) {
    return true;
  }

  // IPv4 Private & Link-local ranges
  if (ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('169.254.')) {
    return true;
  }

  // IPv4 172.16.0.0 to 172.31.255.255
  if (ip.startsWith('172.')) {
    const secondOctet = parseInt(ip.split('.')[1], 10);
    if (!isNaN(secondOctet) && secondOctet >= 16 && secondOctet <= 31) {
      return true;
    }
  }

  // IPv4 Carrier-Grade NAT (100.64.0.0 to 100.127.255.255)
  if (ip.startsWith('100.')) {
    const secondOctet = parseInt(ip.split('.')[1], 10);
    if (!isNaN(secondOctet) && secondOctet >= 64 && secondOctet <= 127) {
      return true;
    }
  }

  return false;
};

/**
 * Extracts Client IP securely with proxy hierarchy
 * Prioritizes trusted provider headers (Cloudflare, Akamai, Nginx) before generic headers
 */
export const getClientIp = (req) => {
  // 1. Cloudflare authoritative header (un-spoofable when behind Cloudflare proxy)
  if (req.headers['cf-connecting-ip']) {
    return req.headers['cf-connecting-ip'].toString().trim();
  }

  // 2. Akamai / Enterprise CDN header
  if (req.headers['true-client-ip']) {
    return req.headers['true-client-ip'].toString().trim();
  }

  // 3. Nginx standard reverse proxy header
  if (req.headers['x-real-ip']) {
    return req.headers['x-real-ip'].toString().trim();
  }

  // 4. Express-resolved client IP (uses app.set('trust proxy'))
  if (req.ip) {
    return req.ip.replace(/^::ffff:/i, '');
  }

  // 5. X-Forwarded-For fallback (sanitized first IP)
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = forwarded.toString().split(',').map((ip) => ip.trim());
    if (ips.length > 0 && ips[0]) {
      return ips[0].replace(/^::ffff:/i, '');
    }
  }

  // 6. Socket remote address
  const remote =
    req.socket?.remoteAddress ||
    req.connection?.remoteAddress ||
    '127.0.0.1';

  return remote.replace(/^::ffff:/i, '');
};

/**
 * Checks if incoming User-Agent belongs to search engines, bots, or scrapers
 */
export const isBot = (userAgent) => {
  if (!userAgent) return false;
  const botPattern = /bot|crawler|spider|crawling|googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebot|facebookexternalhit|ia_archiver|linkedinbot|twitterbot|whatsapp|telegrambot|slackbot|discordbot|applebot|semrushbot|ahrefsbot|mj12bot|dotbot|petalbot|postmanruntime|curl|wget|python-requests|headlesschrome|phantomjs/i;
  return botPattern.test(userAgent);
};

/**
 * resolveGeoLocation - Production Geo Detection
 *
 * Tier 1: CDN / Edge country headers
 *         Usually reliable when request passes through a trusted CDN proxy (Cloudflare, Vercel, CloudFront)
 * Tier 2: Real Public IP -> geoip-lite offline database
 * Tier 3: Browser IANA Timezone -> Used strictly for localhost / private network development testing
 * Fallback: Unknown / XX (No fake country or speculative guessing)
 */
export const resolveGeoLocation = (req, ip, clientTimeZone) => {
  const tz = clientTimeZone || '';

  // ── Tier 1: Verified Edge CDN headers (Cloudflare / Vercel / CloudFront) ──
  // Generic headers like x-country-code are strictly excluded to prevent spoofing
  const rawCdnCountry =
    req.headers['cf-ipcountry'] ||
    req.headers['x-vercel-ip-country'] ||
    req.headers['cloudfront-viewer-country'];

  if (rawCdnCountry && typeof rawCdnCountry === 'string') {
    const code = rawCdnCountry.trim().toUpperCase();
    if (isoCountries.isValid(code)) {
      const city =
        req.headers['cf-ipcity'] ||
        req.headers['x-vercel-ip-city'] ||
        req.headers['cloudfront-viewer-city'] ||
        'Unknown';

      return {
        countryCode: code,
        country: getCountryName(code),
        city: typeof city === 'string' && city.trim() ? city.trim() : 'Unknown',
      };
    }
  }

  // ── Tier 2: Real public IP -> geoip-lite database ─────────────────────────
  if (!isPrivateOrLocalIP(ip)) {
    try {
      const geo = geoip.lookup(ip);
      if (geo && geo.country && isoCountries.isValid(geo.country.toUpperCase())) {
        const code = geo.country.toUpperCase();
        return {
          countryCode: code,
          country: getCountryName(code),
          city: typeof geo.city === 'string' && geo.city.trim() ? geo.city.trim() : 'Unknown',
        };
      }
    } catch (err) {
      console.error('[GeoHelper] GeoIP lookup error:', err.message);
    }

    // In production with a public IP: If GeoIP lookup fails, do NOT guess from Timezone.
    // Return Unknown to preserve high data integrity.
    return {
      countryCode: 'XX',
      country: 'Unknown',
      city: 'Unknown',
    };
  }

  // ── Tier 3: Development / Localhost Fallback (Private IP only) ────────────
  // Used ONLY when running on localhost / internal network where public GeoIP is unavailable
  if (tz) {
    const tzCountry = getCountryFromTimezone(tz);
    if (tzCountry && isoCountries.isValid(tzCountry.code)) {
      const city = tz.split('/').pop().replace(/_/g, ' ');
      return {
        countryCode: tzCountry.code,
        country: tzCountry.name,
        city: city || 'Unknown',
      };
    }
  }

  // ── Fallback: Unknown (No fake country guessing) ─────────────────────────
  return {
    countryCode: 'XX',
    country: 'Unknown',
    city: 'Unknown',
  };
};

/**
 * classifyTrafficSource - Classify referrer URL into marketing source category
 */
export const classifyTrafficSource = (referrer) => {
  if (!referrer || referrer === 'direct' || referrer === '') return 'Direct';
  const ref = referrer.toLowerCase();
  if (
    ref.includes('google.') || ref.includes('bing.com') || ref.includes('yahoo.com') ||
    ref.includes('duckduckgo.com') || ref.includes('baidu.com') || ref.includes('yandex.') ||
    ref.includes('ecosia.org') || ref.includes('ask.com')
  ) return 'Organic Search';
  if (
    ref.includes('linkedin.com') || ref.includes('instagram.com') || ref.includes('facebook.com') ||
    ref.includes('twitter.com') || ref.includes('x.com') || ref.includes('youtube.com') ||
    ref.includes('pinterest.com') || ref.includes('tiktok.com') || ref.includes('t.co') ||
    ref.includes('snapchat.com') || ref.includes('reddit.com') || ref.includes('whatsapp.com') ||
    ref.includes('telegram.org')
  ) return 'Social Media';
  if (
    ref.includes('mail.google.com') || ref.includes('outlook.live.com') ||
    ref.includes('mail.yahoo.com') || ref.includes('utm_medium=email')
  ) return 'Email';
  return 'Referral';
};

/**
 * parseUserAgentInfo - Parse device, browser and OS from User-Agent string
 */
export const parseUserAgentInfo = (userAgentString) => {
  try {
    const parser = new UAParser(userAgentString);
    const result = parser.getResult();
    let device = 'Desktop';
    if (result.device.type === 'mobile') {
      device = 'Mobile';
    } else if (result.device.type === 'tablet') {
      device = 'Tablet';
    } else if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgentString || '')) {
      device = /iPad|Tablet/i.test(userAgentString || '') ? 'Tablet' : 'Mobile';
    }
    return {
      device,
      browser: (result.browser.name || 'Chrome'),
      os: (result.os.name || 'Windows'),
    };
  } catch {
    return { device: 'Desktop', browser: 'Chrome', os: 'Windows' };
  }
};