import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

// Serves files written by the admin image-upload action at runtime.
//
// We can't rely on Next.js's `public/` static serving for these because the
// production build snapshots `public/` at build time — anything dropped in
// post-build returns 404. Funneling /uploads/* through a route handler that
// reads from disk works in both dev and prod, and keeps Nginx's config the
// pure-proxy "everything to localhost:3000" we already have.

export const runtime = "nodejs";

// Cap allowed extensions defensively. The upload action only writes these
// types (validated server-side), but a stricter allow-list here protects
// against anyone dropping files in the directory by other means.
const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

const UPLOADS_ROOT = path.resolve(path.join(process.cwd(), "public", "uploads"));

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: parts } = await params;
  if (!parts || parts.length === 0) {
    return new NextResponse("Not found", { status: 404 });
  }

  // Reject any traversal attempt before joining.
  for (const segment of parts) {
    if (!segment || segment.includes("..") || segment.includes("\0")) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  const candidate = path.resolve(path.join(UPLOADS_ROOT, ...parts));
  // Defense in depth: re-verify the resolved path is under the uploads root.
  if (candidate !== UPLOADS_ROOT && !candidate.startsWith(UPLOADS_ROOT + path.sep)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const ext = path.extname(candidate).toLowerCase();
  const contentType = MIME[ext];
  if (!contentType) {
    return new NextResponse("Unsupported file type", { status: 415 });
  }

  let info;
  try {
    info = await stat(candidate);
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
  if (!info.isFile()) {
    return new NextResponse("Not found", { status: 404 });
  }

  // Files are capped at 5MB by the upload action; reading whole-file into a
  // Buffer is fine here. Switch to streaming if that cap ever rises.
  const buf = await readFile(candidate);

  return new NextResponse(new Uint8Array(buf), {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(info.size),
      // Browser caches for 1 hour; the URL is content-hashed (random hex
      // filename) so re-uploads always produce a new URL — safe to cache.
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
