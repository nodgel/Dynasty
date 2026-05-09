import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import GAPageTracker from "./GAPageTracker";

// Loads gtag.js + initial config, then mounts a client tracker that fires a
// page_view on each App Router pathname change. Renders nothing when no GA ID
// is configured (so dev/staging make zero requests to Google).
export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
        `}
      </Script>
      <GAPageTracker />
    </>
  );
}
