"use client";

import { useEffect } from "react";
import { PUBLISHER_ID } from "@/lib/adSlots";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type Props = {
  slotId: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  layout?: string;
  layoutKey?: string;
  fullWidthResponsive?: boolean;
  className?: string;
  // Inline style passed to <ins>; AdSense REQUIRES display:block, so we
  // always set that and merge any extra rules on top.
  style?: React.CSSProperties;
};

// Renders one AdSense ad unit. The loader script (in the root layout) provides
// `adsbygoogle`; this component just emits the <ins> placeholder and triggers
// a fill via push({}). Each slot must push exactly once per mount.
export default function AdUnit({
  slotId,
  format = "auto",
  layout,
  layoutKey,
  fullWidthResponsive = true,
  className = "",
  style,
}: Props) {
  useEffect(() => {
    try {
      // adsbygoogle.push() with an empty object asks AdSense to fill the
      // most recently inserted <ins>. Wrapped in try/catch so an ad blocker
      // (or the loader still loading) doesn't blow up the page.
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* no-op */
    }
  }, [slotId]);

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: "block", ...style }}
      data-ad-client={PUBLISHER_ID}
      data-ad-slot={slotId}
      data-ad-format={format}
      {...(layout ? { "data-ad-layout": layout } : {})}
      {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
      data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
    />
  );
}
