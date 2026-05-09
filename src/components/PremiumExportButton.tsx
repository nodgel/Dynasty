export default function PremiumExportButton() {
  return (
    <div className="mt-6 flex items-center gap-3">
      <button
        type="button"
        disabled
        aria-disabled
        title="Coming soon"
        className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-stone-100 px-4 py-2 text-sm text-stone-500 cursor-not-allowed"
      >
        <span aria-hidden>↓</span>
        Download High-Res Family Tree (PDF)
      </button>
      <span className="text-xs text-stone-400 uppercase tracking-widest">Premium · Coming soon</span>
    </div>
  );
}
