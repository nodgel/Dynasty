"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
  }
}

// Manually fires a GA4 page_view on every client-side route change. We
// disable gtag's automatic page_view in the GoogleAnalytics component (via
// `send_page_view: false`) so we don't double-count — Next.js App Router
// uses History API for navigation, which GA4's enhanced measurement also
// listens to, and both firing leads to inflated metrics.
//
// /admin paths are excluded so the editor's traffic doesn't pollute reports.
export default function GAPageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    if (typeof window === "undefined" || !window.gtag) return;
    if (pathname.startsWith("/admin")) return;
    window.gtag("event", "page_view", {
      page_path: pathname,
      send_to: GA_MEASUREMENT_ID,
    });
  }, [pathname]);

  return null;
}
