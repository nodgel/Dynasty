import type { MetadataRoute } from "next";
import { listAllDynastySlugs, listAllFigureSlugs } from "@/lib/queries";

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
  ];

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

  return [...staticEntries, ...dynastyEntries, ...figureEntries];
}
