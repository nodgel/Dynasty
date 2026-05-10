import type { MetadataRoute } from "next";
import { listAllDynastySlugs, listAllFigureSlugs } from "@/lib/queries";
import { REGIONS } from "@/lib/regions";
import { ERAS } from "@/lib/eras";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [dynasties, figures] = await Promise.all([
    listAllDynastySlugs(),
    listAllFigureSlugs(),
  ]);

  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/dynasties`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/dynasties/region`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/dynasties/era`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const regionEntries: MetadataRoute.Sitemap = REGIONS.map((r) => ({
    url: `${SITE_URL}/dynasties/region/${r.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const eraEntries: MetadataRoute.Sitemap = ERAS.map((e) => ({
    url: `${SITE_URL}/dynasties/era/${e.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const dynastyEntries: MetadataRoute.Sitemap = dynasties.map((d) => ({
    url: `${SITE_URL}/dynasties/${d.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const figureEntries: MetadataRoute.Sitemap = figures
    .filter((f) => f.dynasty?.slug)
    .map((f) => ({
      url: `${SITE_URL}/dynasties/${f.dynasty!.slug}/${f.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  return [
    ...staticEntries,
    ...regionEntries,
    ...eraEntries,
    ...dynastyEntries,
    ...figureEntries,
  ];
}
