"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { uploadImageAction } from "@/lib/actions/uploads";

type Props = {
  name: string;
  initialUrl?: string | null;
  label?: string;
};

export default function ImageUpload({ name, initialUrl = null, label = "Image" }: Props) {
  const [url, setUrl] = useState<string | null>(initialUrl);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    startTransition(async () => {
      const res = await uploadImageAction(fd);
      if (res.ok) setUrl(res.url);
      else setError(res.error);
    });
  };

  return (
    <div>
      <label className="block text-sm text-stone-700 mb-1">{label}</label>
      <input type="hidden" name={name} value={url ?? ""} />
      <div className="flex items-start gap-4">
        <div className="w-32 h-32 rounded-md border border-stone-300 bg-stone-50 overflow-hidden flex items-center justify-center text-xs text-stone-400">
          {url ? (
            <Image src={url} alt="" width={128} height={128} className="w-full h-full object-cover" unoptimized />
          ) : (
            <span>No image</span>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="block text-sm"
            disabled={isPending}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          {isPending && <p className="text-xs text-stone-500">Uploading…</p>}
          {error && <p className="text-xs text-red-600">{error}</p>}
          {url && (
            <button
              type="button"
              onClick={() => {
                setUrl(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="text-xs text-stone-500 underline hover:text-stone-700"
            >
              Remove image
            </button>
          )}
          <p className="text-xs text-stone-400">JPEG, PNG, WebP, or GIF. Max 5 MB.</p>
        </div>
      </div>
    </div>
  );
}
