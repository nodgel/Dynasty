"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Client-only "Edit" pill shown on public pages when the visitor has a valid
// admin session. The check happens via fetch("/admin/_api/me") after mount —
// keeping it client-side means the parent route stays statically rendered for
// anonymous visitors (no cookies() → no force-dynamic).
//
// Process-level cache so navigating between figures doesn't refetch on every
// page transition.
let cachedAuth: boolean | null = null;
let inFlight: Promise<boolean> | null = null;

async function checkSession(): Promise<boolean> {
  if (cachedAuth !== null) return cachedAuth;
  if (inFlight) return inFlight;
  inFlight = fetch("/api/admin/me", { cache: "no-store" })
    .then((r) => r.ok)
    .catch(() => false)
    .then((v) => {
      cachedAuth = v;
      inFlight = null;
      return v;
    });
  return inFlight;
}

export default function EditFromSiteLink({ href }: { href: string }) {
  const [authed, setAuthed] = useState<boolean | null>(cachedAuth);

  useEffect(() => {
    let cancelled = false;
    if (authed === null) {
      checkSession().then((v) => {
        if (!cancelled) setAuthed(v);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [authed]);

  if (!authed) return null;

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs text-amber-900 hover:bg-amber-100"
      aria-label="Edit this entry in the admin panel"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
      Edit
    </Link>
  );
}
