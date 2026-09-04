import VisitorLog from "../models/VisitorLog.js";
import {
  getClientIp,
  resolveGeoLocation,
  classifyTrafficSource,
  parseUserAgentInfo,
  isBot,
} from "../utils/geoHelper.js";

/**
 * Parses start and end dates from timeframe option
 */
const getDateRanges = (rangeType, customStart, customEnd) => {
  const now = new Date();
  let currentStart = new Date(now);
  let currentEnd = new Date(now);
  let prevStart = new Date(now);
  let prevEnd = new Date(now);

  if (rangeType === "Today") {
    currentStart.setHours(0, 0, 0, 0);
    currentEnd.setHours(23, 59, 59, 999);

    prevStart.setDate(prevStart.getDate() - 1);
    prevStart.setHours(0, 0, 0, 0);
    prevEnd.setDate(prevEnd.getDate() - 1);
    prevEnd.setHours(23, 59, 59, 999);
  } else if (rangeType === "Yesterday") {
    currentStart.setDate(currentStart.getDate() - 1);
    currentStart.setHours(0, 0, 0, 0);
    currentEnd.setDate(currentEnd.getDate() - 1);
    currentEnd.setHours(23, 59, 59, 999);

    prevStart.setDate(prevStart.getDate() - 2);
    prevStart.setHours(0, 0, 0, 0);
    prevEnd.setDate(prevEnd.getDate() - 2);
    prevEnd.setHours(23, 59, 59, 999);
  } else if (rangeType === "Last 7 days" || !rangeType) {
    currentStart.setDate(now.getDate() - 6);
    currentStart.setHours(0, 0, 0, 0);

    const durationMs = currentEnd.getTime() - currentStart.getTime();
    prevEnd = new Date(currentStart.getTime() - 1);
    prevStart = new Date(prevEnd.getTime() - durationMs);
  } else if (rangeType === "Last 30 days") {
    currentStart.setDate(now.getDate() - 29);
    currentStart.setHours(0, 0, 0, 0);

    const durationMs = currentEnd.getTime() - currentStart.getTime();
    prevEnd = new Date(currentStart.getTime() - 1);
    prevStart = new Date(prevEnd.getTime() - durationMs);
  } else if (rangeType === "This Month") {
    currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
    currentStart.setHours(0, 0, 0, 0);

    prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    prevEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  } else if (rangeType === "Last Month") {
    currentStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    currentEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    prevStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    prevEnd = new Date(now.getFullYear(), now.getMonth() - 1, 0, 23, 59, 59, 999);
  } else if (rangeType === "This Year") {
    currentStart = new Date(now.getFullYear(), 0, 1);
    currentStart.setHours(0, 0, 0, 0);

    prevStart = new Date(now.getFullYear() - 1, 0, 1);
    prevEnd = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
  } else if (rangeType === "All Time") {
    currentStart = new Date(2020, 0, 1);
    prevStart = new Date(2019, 0, 1);
    prevEnd = new Date(2019, 11, 31);
  } else if (rangeType === "Custom" && customStart && customEnd) {
    currentStart = new Date(customStart);
    currentStart.setHours(0, 0, 0, 0);
    currentEnd = new Date(customEnd);
    currentEnd.setHours(23, 59, 59, 999);

    const durationMs = currentEnd.getTime() - currentStart.getTime();
    prevEnd = new Date(currentStart.getTime() - 1);
    prevStart = new Date(prevEnd.getTime() - durationMs);
  }

  return { currentStart, currentEnd, prevStart, prevEnd };
};

/**
 * Helper to compute percentage growth safely
 */
const calculateGrowth = (current, previous) => {
  if (previous === 0) {
    return current > 0 ? "+100.0%" : "0.0%";
  }
  const diff = ((current - previous) / previous) * 100;
  const sign = diff >= 0 ? "+" : "";
  return `${sign}${diff.toFixed(1)}%`;
};

/**
 * POST /api/analytics/track
 * Records a page visit beacon (Fast, non-blocking, bot-filtered)
 */
export const trackHit = async (req, res) => {
  try {
    const {
      visitorId,
      sessionId,
      path,
      pageTitle,
      referrer,
      screenResolution,
      timeZone,
      isNewVisitor,
    } = req.body || {};

    // 1. Ignore Admin Panel or system API calls
    if (!path || path.startsWith("/admin") || path.startsWith("/api")) {
      return res.status(200).json({ success: true, ignored: true });
    }

    // 2. Filter out Search Engine Crawlers, Bots, and Scrapers
    const userAgent = req.headers["user-agent"] || "";
    if (isBot(userAgent)) {
      return res.status(200).json({ success: true, ignored: true, reason: "bot" });
    }

    const ip = getClientIp(req);
    const { country, countryCode, city } = resolveGeoLocation(req, ip, timeZone);
    const source = classifyTrafficSource(referrer);
    const { device, browser, os } = parseUserAgentInfo(userAgent);

    const log = new VisitorLog({
      visitorId: visitorId || `vis_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      sessionId: sessionId || `ses_${Date.now()}`,
      ip,
      path: path || "/",
      pageTitle: pageTitle || "Home Page",
      referrer: referrer || "direct",
      source,
      country,
      countryCode,
      city,
      device,
      browser,
      os,
      screenResolution: screenResolution || "1920x1080",
      isNewVisitor: Boolean(isNewVisitor),
      timestamp: new Date(),
    });

    // 3. Respond immediately to keep user navigation fast and smooth
    res.status(201).json({ success: true });

    // 4. Save to MongoDB in background
    log.save().catch((err) => {
      console.error("[Analytics] Background log save error:", err.message);
    });
  } catch (error) {
    console.error("Tracking Error:", error);
    // Silent fail so client navigation is never broken
    return res.status(200).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/analytics/stats
 * Aggregates visitors data for the dashboard
 */
export const getAnalyticsStats = async (req, res) => {
  try {
    const { range = "Last 7 days", startDate, endDate } = req.query;
    const { currentStart, currentEnd, prevStart, prevEnd } = getDateRanges(
      range,
      startDate,
      endDate
    );

    // Clean real-time tracking (No automatic fake seeding)
    // ── 1. KPI Aggregations (Current Period) ──
    const currentLogs = await VisitorLog.find({
      timestamp: { $gte: currentStart, $lte: currentEnd },
    });

    // ── 2. KPI Aggregations (Previous Period) ──
    const prevLogs = await VisitorLog.find({
      timestamp: { $gte: prevStart, $lte: prevEnd },
    });

    const currentUniqueVisitors = new Set(currentLogs.map((l) => l.visitorId)).size;
    const prevUniqueVisitors = new Set(prevLogs.map((l) => l.visitorId)).size;

    const currentNewVisitors = currentLogs.filter((l) => l.isNewVisitor).length;
    const prevNewVisitors = prevLogs.filter((l) => l.isNewVisitor).length;

    const currentPageViews = currentLogs.length;
    const prevPageViews = prevLogs.length;

    // Calculation of days for daily average
    const diffDays = Math.max(
      1,
      Math.round((currentEnd.getTime() - currentStart.getTime()) / (1000 * 60 * 60 * 24))
    );
    const avgDailyVisitors = Math.round(currentUniqueVisitors / diffDays);
    const prevDiffDays = Math.max(
      1,
      Math.round((prevEnd.getTime() - prevStart.getTime()) / (1000 * 60 * 60 * 24))
    );
    const prevAvgDaily = Math.round(prevUniqueVisitors / prevDiffDays);

    const kpiSummary = {
      totalVisitors: {
        value: currentUniqueVisitors.toLocaleString(),
        raw: currentUniqueVisitors,
        trend: calculateGrowth(currentUniqueVisitors, prevUniqueVisitors),
        isPositive: currentUniqueVisitors >= prevUniqueVisitors,
      },
      newVisitors: {
        value: currentNewVisitors.toLocaleString(),
        raw: currentNewVisitors,
        trend: calculateGrowth(currentNewVisitors, prevNewVisitors),
        isPositive: currentNewVisitors >= prevNewVisitors,
      },
      totalPageViews: {
        value: currentPageViews.toLocaleString(),
        raw: currentPageViews,
        trend: calculateGrowth(currentPageViews, prevPageViews),
        isPositive: currentPageViews >= prevPageViews,
      },
      avgDailyVisitors: {
        value: avgDailyVisitors.toLocaleString(),
        trend: calculateGrowth(avgDailyVisitors, prevAvgDaily),
      },
      growthRate: calculateGrowth(currentUniqueVisitors, prevUniqueVisitors),
    };

    // ── 3. Chart Timeline Points (Comparison Line Graph) ──
    const daysMap = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const chartData = daysMap.map((dayLabel, idx) => {
      // Aggregate by day of week or bucket
      const currentHits = currentLogs.filter((l) => {
        const d = new Date(l.timestamp).getDay();
        const mappedIdx = d === 0 ? 6 : d - 1; // Map Sunday=6, Mon=0
        return mappedIdx === idx;
      }).length;

      const prevHits = prevLogs.filter((l) => {
        const d = new Date(l.timestamp).getDay();
        const mappedIdx = d === 0 ? 6 : d - 1;
        return mappedIdx === idx;
      }).length;

      return {
        label: dayLabel,
        current: currentHits,
        previous: prevHits,
      };
    });

    // ── 4. Traffic Sources Breakdown ──
    const sourceBuckets = {
      "Organic Search": 0,
      Direct: 0,
      "Social Media": 0,
      Referral: 0,
      Email: 0,
    };
    currentLogs.forEach((l) => {
      const src = l.source || "Direct";
      if (sourceBuckets[src] !== undefined) {
        sourceBuckets[src]++;
      } else {
        sourceBuckets["Referral"]++;
      }
    });

    const totalSourceHits = Math.max(1, currentLogs.length);
    const sourcesData = [
      {
        name: "Organic Search",
        count: sourceBuckets["Organic Search"],
        percentage: Math.round((sourceBuckets["Organic Search"] / totalSourceHits) * 100),
        color: "#1e3a8a",
      },
      {
        name: "Direct",
        count: sourceBuckets["Direct"],
        percentage: Math.round((sourceBuckets["Direct"] / totalSourceHits) * 100),
        color: "#c29d38",
      },
      {
        name: "Social Media",
        count: sourceBuckets["Social Media"],
        percentage: Math.round((sourceBuckets["Social Media"] / totalSourceHits) * 100),
        color: "#0284c7",
      },
      {
        name: "Referral",
        count: sourceBuckets["Referral"],
        percentage: Math.round((sourceBuckets["Referral"] / totalSourceHits) * 100),
        color: "#10b981",
      },
      {
        name: "Email",
        count: sourceBuckets["Email"],
        percentage: Math.round((sourceBuckets["Email"] / totalSourceHits) * 100),
        color: "#8b5cf6",
      },
    ];

    // ── 5. Visitors by Country (All Countries for modal + Top 5 for card) ──
    const countryMap = {};
    currentLogs.forEach((l) => {
      const code = l.countryCode || "AE";
      const name = l.country || "United Arab Emirates";
      if (!countryMap[code]) {
        countryMap[code] = { code, name, count: 0 };
      }
      countryMap[code].count++;
    });

    const allCountries = Object.values(countryMap)
      .sort((a, b) => b.count - a.count)
      .map((c, index) => ({
        rank: index + 1,
        code: c.code,
        name: c.name,
        visitors: c.count.toLocaleString(),
        rawCount: c.count,
        percentage: Math.round((c.count / totalSourceHits) * 100),
      }));

    const top5Countries = allCountries.slice(0, 5);

    // ── 6. Top Visited Pages (All Pages for modal + Top 5 for card) ──
    const pageMap = {};
    currentLogs.forEach((l) => {
      const p = l.path || "/";
      const title = l.pageTitle || p;
      if (!pageMap[p]) {
        pageMap[p] = { path: p, title, views: 0 };
      }
      pageMap[p].views++;
    });

    const allPages = Object.values(pageMap)
      .sort((a, b) => b.views - a.views)
      .map((p, index) => ({
        rank: index + 1,
        path: p.path,
        title: p.title,
        views: p.views.toLocaleString(),
        rawViews: p.views,
        percentage: Math.round((p.views / totalSourceHits) * 100),
      }));

    const top5Pages = allPages.slice(0, 5);

    // ── 7. Devices Breakdown ──
    const deviceCounts = { Desktop: 0, Mobile: 0, Tablet: 0 };
    currentLogs.forEach((l) => {
      const dev = l.device || "Desktop";
      if (deviceCounts[dev] !== undefined) {
        deviceCounts[dev]++;
      } else {
        deviceCounts["Desktop"]++;
      }
    });

    const devicesData = [
      {
        name: "Desktop",
        count: deviceCounts.Desktop,
        percentage: Math.round((deviceCounts.Desktop / totalSourceHits) * 100),
        color: "#1e3a8a",
      },
      {
        name: "Mobile",
        count: deviceCounts.Mobile,
        percentage: Math.round((deviceCounts.Mobile / totalSourceHits) * 100),
        color: "#c29d38",
      },
      {
        name: "Tablet",
        count: deviceCounts.Tablet,
        percentage: Math.round((deviceCounts.Tablet / totalSourceHits) * 100),
        color: "#0284c7",
      },
    ];

    // ── 8. Dynamic Insight String ──
    const topSource = sourcesData[0]?.name || "Organic Search";
    const topCountry = top5Countries[0]?.name || "United Arab Emirates";
    const insightsText = `Traffic is up ${kpiSummary.totalVisitors.trend} compared to previous period. ${topSource} is your leading acquisition channel, with strong visitor engagement from ${topCountry}.`;

    return res.status(200).json({
      success: true,
      range,
      dateRangeText: `${currentStart.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} - ${currentEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
      kpiSummary,
      chartData,
      sourcesData,
      top5Countries,
      allCountries,
      top5Pages,
      allPages,
      devicesData,
      insightsText,
    });
  } catch (error) {
    console.error("Get Analytics Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to compute visitor analytics",
      error: error.message,
    });
  }
};




/**
 * DELETE /api/analytics/clear
 * Clears all visitor logs for clean fresh start from 0
 */
export const clearAllLogs = async (req, res) => {
  try {
    await VisitorLog.deleteMany({});
    return res.status(200).json({
      success: true,
      message: "Visitor analytics database successfully reset to clean 0 state",
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

