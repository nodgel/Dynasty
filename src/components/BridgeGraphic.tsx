// Decorative bridge graphic shown above the "Follow the bloodlines" cards.
// Two dynasty nodes flanking a center node for the figure who married/was
// born into both houses. Pure HTML/CSS — no JS — so it ships in the SSR
// HTML and is legible to crawlers.

type Props = {
  leftDynasty: string;
  rightDynasty: string;
  bridgeName: string;
  bridgeYears: string;
  href: string;
};

export default function BridgeGraphic({
  leftDynasty,
  rightDynasty,
  bridgeName,
  bridgeYears,
  href,
}: Props) {
  return (
    <a
      href={href}
      aria-label={`${bridgeName} bridged the ${leftDynasty} and ${rightDynasty} houses`}
      className="not-prose group block"
    >
      <div className="flex items-stretch gap-2 sm:gap-4 select-none">
        {/* Left dynasty pill */}
        <div className="flex-1 flex items-center justify-end">
          <div className="flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 transition group-hover:border-stone-500">
            <span className="h-2 w-2 rounded-full bg-stone-400" aria-hidden />
            <span className="font-serif text-stone-900 text-sm sm:text-base whitespace-nowrap">
              {leftDynasty}
            </span>
          </div>
        </div>

        {/* Bridge node — name + dates with horizontal connector lines */}
        <div className="flex flex-col items-center justify-center px-1 sm:px-2 min-w-0">
          <div className="relative flex items-center w-full">
            <span
              className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t border-dashed border-stone-400"
              aria-hidden
            />
            <span className="relative mx-auto bg-stone-50 px-3 py-1 text-center">
              <span className="block font-serif text-sm sm:text-base text-stone-900 group-hover:text-stone-700 leading-tight whitespace-nowrap">
                {bridgeName}
              </span>
              <span className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-stone-500 mt-0.5">
                {bridgeYears}
              </span>
            </span>
          </div>
        </div>

        {/* Right dynasty pill */}
        <div className="flex-1 flex items-center justify-start">
          <div className="flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 transition group-hover:border-stone-500">
            <span className="font-serif text-stone-900 text-sm sm:text-base whitespace-nowrap">
              {rightDynasty}
            </span>
            <span className="h-2 w-2 rounded-full bg-stone-400" aria-hidden />
          </div>
        </div>
      </div>
    </a>
  );
}
