type AdSlotProps = {
  label: string;
  size: string;
  className?: string;
  variant?: "banner" | "rectangle";
};

export default function AdSlot({ label, size, className = "", variant = "banner" }: AdSlotProps) {
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
