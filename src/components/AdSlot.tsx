import AdUnit from "./AdUnit";
import { getSlotId, type AdSlotName } from "@/lib/adSlots";

type AdSlotProps = {
  label: string;
  size: string;
  // When provided, renders a real AdSense ad unit (if a slot ID is configured
  // for that name). When the slot ID is empty / not configured, falls back to
  // the dashed-border placeholder so layouts stay readable in dev/staging.
  name?: AdSlotName;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  className?: string;
  variant?: "banner" | "rectangle";
};

export default function AdSlot({
  label,
  size,
  name,
  format,
  className = "",
  variant = "banner",
}: AdSlotProps) {
  const slotId = name ? getSlotId(name) : undefined;

  if (slotId) {
    // Live ad. AdSense rules: the <ins> needs to be inside something tall
    // enough to satisfy `display:block`, so we wrap in a min-height container
    // matching the placeholder's variant.
    const minHeight = variant === "rectangle" ? "250px" : "90px";
    return (
      <aside
        role="complementary"
        aria-label={`Advertisement — ${label}`}
        data-ad-slot={label}
        className={className}
        style={{ minHeight }}
      >
        <AdUnit slotId={slotId} format={format ?? (variant === "rectangle" ? "rectangle" : "auto")} />
      </aside>
    );
  }

  // Placeholder fallback (development / before approval / no slot ID set).
  const heightClass = variant === "rectangle" ? "min-h-[250px]" : "min-h-[90px]";
  return (
    <aside
      role="complementary"
      aria-label={`Advertisement slot — ${label}`}
      data-ad-slot={label}
      className={`flex items-center justify-center border border-dashed border-stone-300 bg-stone-50/60 text-stone-400 text-xs uppercase tracking-widest ${heightClass} ${className}`}
    >
      <span>
        Ad — {label} <span className="text-stone-300">·</span> {size}
      </span>
    </aside>
  );
}
