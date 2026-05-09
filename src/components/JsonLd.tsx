// Schema.org structured data emitter. Renders a JSON-LD <script> tag that
// search engines (especially Google) parse to populate knowledge panels and
// rich results.
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify already escapes characters that matter; we don't take
      // user-controllable HTML into the payload.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// ISO 8601 supports negative (BC) years with optional sign + 4-digit year:
// "+0069" / "-0069". Some crawlers handle this poorly, so we only emit a date
// when the year is positive (AD). BC dates are still in the description text.
function isoYear(year: number | null | undefined): string | undefined {
  if (year == null || year < 1) return undefined;
  return String(year).padStart(4, "0");
}

export function personLd(figure: {
  slug: string;
  name: string;
  nativeName?: string | null;
  birthYear: number | null;
  deathYear: number | null;
  biography: string | null;
  dynasty: { slug: string; name: string } | null;
  imageUrl?: string | null;
}) {
  const url = figure.dynasty
    ? `${SITE_URL}/dynasties/${figure.dynasty.slug}/${figure.slug}`
    : `${SITE_URL}/figures/${figure.slug}`;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: figure.name,
    url,
  };
  if (figure.nativeName) data.alternateName = figure.nativeName;
  const bd = isoYear(figure.birthYear);
  const dd = isoYear(figure.deathYear);
  if (bd) data.birthDate = bd;
  if (dd) data.deathDate = dd;
  if (figure.biography) data.description = figure.biography.slice(0, 500);
  if (figure.imageUrl) data.image = figure.imageUrl.startsWith("http") ? figure.imageUrl : `${SITE_URL}${figure.imageUrl}`;
  if (figure.dynasty) {
    data.memberOf = {
      "@type": "Organization",
      name: figure.dynasty.name,
      url: `${SITE_URL}/dynasties/${figure.dynasty.slug}`,
    };
  }
  return data;
}

export function dynastyLd(dynasty: {
  slug: string;
  name: string;
  nativeName?: string | null;
  description: string | null;
  region: string | null;
  foundedYear: number | null;
  endedYear: number | null;
  imageUrl?: string | null;
  coatOfArmsUrl?: string | null;
  figures: { slug: string; name: string }[];
}) {
  const url = `${SITE_URL}/dynasties/${dynasty.slug}`;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: dynasty.name,
    url,
    additionalType: "https://schema.org/Family",
  };
  if (dynasty.nativeName) data.alternateName = dynasty.nativeName;
  if (dynasty.description) data.description = dynasty.description.slice(0, 500);
  if (dynasty.region) data.areaServed = dynasty.region;
  if (dynasty.foundedYear && dynasty.foundedYear >= 1) {
    data.foundingDate = String(dynasty.foundedYear).padStart(4, "0");
  }
  if (dynasty.endedYear && dynasty.endedYear >= 1) {
    data.dissolutionDate = String(dynasty.endedYear).padStart(4, "0");
  }
  if (dynasty.imageUrl) {
    data.image = dynasty.imageUrl.startsWith("http") ? dynasty.imageUrl : `${SITE_URL}${dynasty.imageUrl}`;
  }
  if (dynasty.coatOfArmsUrl) {
    data.logo = dynasty.coatOfArmsUrl.startsWith("http")
      ? dynasty.coatOfArmsUrl
      : `${SITE_URL}${dynasty.coatOfArmsUrl}`;
  }
  if (dynasty.figures.length > 0) {
    data.member = dynasty.figures.map((f) => ({
      "@type": "Person",
      name: f.name,
      url: `${SITE_URL}/dynasties/${dynasty.slug}/${f.slug}`,
    }));
  }
  return data;
}
