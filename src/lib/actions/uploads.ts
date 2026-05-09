"use server";

import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import path from "node:path";
import { getSession } from "@/lib/auth";

const ALLOWED = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export type UploadResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export async function uploadImageAction(formData: FormData): Promise<UploadResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Unauthorized" };

  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "No file provided" };

  const ext = ALLOWED.get(file.type);
  if (!ext) return { ok: false, error: `Unsupported type: ${file.type}` };

  if (file.size > MAX_BYTES) {
    return { ok: false, error: `File too large (max ${MAX_BYTES / 1024 / 1024} MB)` };
  }
  if (file.size === 0) return { ok: false, error: "Empty file" };

  // Layout uploads by year/month so the directory doesn't grow unbounded.
  const now = new Date();
  const yyyy = now.getUTCFullYear().toString();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const subdir = path.join(yyyy, mm);
  const fileName = `${randomBytes(12).toString("hex")}.${ext}`;
  const absDir = path.join(UPLOAD_DIR, subdir);
  const absPath = path.join(absDir, fileName);

  await mkdir(absDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(absPath, buffer);

  const url = `/uploads/${yyyy}/${mm}/${fileName}`;
  return { ok: true, url };
}
