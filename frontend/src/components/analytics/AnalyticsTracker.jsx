"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { API_BASE_URL } from "@/config/api";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPath = useRef(null);

  useEffect(() => {
    // 1. Skip tracking for Admin dashboard or API routes
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    // 2. Prevent duplicate tracking on identical re-renders
    const fullPath = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    if (lastTrackedPath.current === fullPath) {
      return;
    }
    lastTrackedPath.current = fullPath;

    try {
      // 3. Visitor Identification (Persistent)
      let visitorId = localStorage.getItem("leela_visitor_id");
      let isNewVisitor = false;

      if (!visitorId) {
        visitorId = `vis_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem("leela_visitor_id", visitorId);
        isNewVisitor = true;
      }

      // 4. Session Tracking (30-minute rolling session window)
      let sessionId = sessionStorage.getItem("leela_session_id");
      if (!sessionId) {
        sessionId = `ses_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        sessionStorage.setItem("leela_session_id", sessionId);
      }

      // 5. Build Hit Payload
      const timeZone =
        typeof Intl !== "undefined"
          ? Intl.DateTimeFormat().resolvedOptions().timeZone
          : "";
      const language = typeof navigator !== "undefined" ? navigator.language : "";

      const payload = {
        visitorId,
        sessionId,
        path: pathname,
        pageTitle: typeof document !== "undefined" ? document.title : "Leela Gulf",
        referrer: typeof document !== "undefined" && document.referrer ? document.referrer : "direct",
        screenResolution:
          typeof window !== "undefined"
            ? `${window.screen.width}x${window.screen.height}`
            : "1920x1080",
        timeZone,
        language,
        isNewVisitor,
      };

      const trackUrl = `${API_BASE_URL}/analytics/track`;

      // 6. Send Beacon to Backend
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], {
          type: "application/json",
        });
        navigator.sendBeacon(trackUrl, blob);
      } else {
        fetch(trackUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Silent catch to never impact user browsing experience
    }
  }, [pathname, searchParams]);

  return null;
}
