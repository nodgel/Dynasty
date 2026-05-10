const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_TAG ?? "";

export function amazonSearchUrl(query: string): string {
  const params = new URLSearchParams({ k: query, i: "stripbooks" });
  if (AMAZON_TAG) params.set("tag", AMAZON_TAG);
  return `https://www.amazon.com/s?${params.toString()}`;
}

export type BookSearch = { label: string; query: string };

export function figureBookSearches(
  figureName: string,
  dynastyName: string | null,
): BookSearch[] {
  return [
    { label: "Biography", query: `${figureName} biography` },
    { label: "History", query: `${figureName} history` },
    {
      label: "Dynasty",
      query: dynastyName ? `${dynastyName} dynasty` : `${figureName} dynasty`,
    },
  ];
}
