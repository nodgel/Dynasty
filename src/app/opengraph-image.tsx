import { ImageResponse } from "next/og";
import { OG_SIZE, OG_CONTENT_TYPE, ogDefault } from "@/lib/og";

export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Dynastica — historical genealogy and dynasty database";

export default async function Image() {
  return new ImageResponse(ogDefault(), { ...OG_SIZE });
}
