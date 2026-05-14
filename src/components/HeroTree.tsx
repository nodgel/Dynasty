// Small decorative SVG of an abstract family tree — three generations, seven
// nodes. Sits above the homepage H1 as a visual cue for "the interactive
// trees" copy. Stone-palette stroke, no fills on nodes for a hand-drawn feel.
export default function HeroTree() {
  // Coordinates picked so the tree fits a 300×120 viewBox with comfortable
  // padding. Generation rows at y=18, y=60, y=102.
  const stroke = "currentColor";
  return (
    <svg
      viewBox="0 0 300 120"
      width="240"
      height="96"
      aria-hidden="true"
      className="mx-auto text-stone-400"
    >
      {/* Gen-1 → Gen-2 lines */}
      <line x1="150" y1="22" x2="90" y2="56" stroke={stroke} strokeWidth="1" />
      <line x1="150" y1="22" x2="210" y2="56" stroke={stroke} strokeWidth="1" />
      {/* Gen-2 → Gen-3 lines */}
      <line x1="90" y1="64" x2="50" y2="98" stroke={stroke} strokeWidth="1" />
      <line x1="90" y1="64" x2="130" y2="98" stroke={stroke} strokeWidth="1" />
      <line x1="210" y1="64" x2="170" y2="98" stroke={stroke} strokeWidth="1" />
      <line x1="210" y1="64" x2="250" y2="98" stroke={stroke} strokeWidth="1" />
      {/* Nodes — open circles with light stone fill */}
      {[
        [150, 18],
        [90, 60],
        [210, 60],
        [50, 102],
        [130, 102],
        [170, 102],
        [250, 102],
      ].map(([cx, cy]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="4"
          fill="#fafaf9"
          stroke={stroke}
          strokeWidth="1.25"
        />
      ))}
    </svg>
  );
}
