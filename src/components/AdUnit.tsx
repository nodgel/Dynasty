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
    // AdSense's adsbygoogle script mutates this <ins> after the SSR pass:
    // it sets data-adsbygoogle-status="done" and injects an <iframe> child.
    // Both trigger React hydration warnings.
    //
    // suppressHydrationWarning doesn't help here — it only covers attribute
    // and text-content mismatches on the element itself, NOT structural
    // child added/removed mismatches, even with a wrapper div.
    //
    // The fix: dangerouslySetInnerHTML={{__html: ""}}. This declares to
    // React that we own this element's children outside the reconciler.
    // AdSense can then inject whatever it wants and React never tries to
    // diff it. suppressHydrationWarning still helps for the attribute
    // mutation on the <ins> itself.
    <ins
      suppressHydrationWarning
      className={`adsbygoogle ${className}`}
      style={{ display: "block", ...style }}
      data-ad-client={PUBLISHER_ID}
      data-ad-slot={slotId}
      data-ad-format={format}
      {...(layout ? { "data-ad-layout": layout } : {})}
      {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
      data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      dangerouslySetInnerHTML={{ __html: "" }}
    />
  );
}
