export default function SearchInput() {
  return (
    <form action="/search" method="GET" role="search" className="flex">
      <label htmlFor="global-search" className="sr-only">Search dynasties and figures</label>
      <input
        id="global-search"
        name="q"
        type="search"
        placeholder="Search dynasties, figures…"
        className="w-full h-9 px-3 text-sm rounded-md border border-stone-300 bg-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400"
      />
    </form>
  );
}
