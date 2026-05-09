import "server-only";
import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

// HMAC-signed session cookie. No DB sessions, no third-party auth library —
// fits the Path-A "single admin" model. Format:
//   <base64url payload>.<base64url HMAC-SHA256(payload, AUTH_SECRET)>
//
// Required env vars:
//   ADMIN_PASSWORD — the literal admin password
//   AUTH_SECRET    — long random string used to sign cookies (rotate to
//                    invalidate every session at once)

const COOKIE_NAME = "dynastica_admin";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

type SessionPayload = {
  role: "admin";
  iat: number; // issued-at unix seconds
  exp: number; // expiry unix seconds
};

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET env var must be set to a string of at least 32 characters"
    );
  }
  return secret;
}

function b64url(buf: Buffer | string): string {
  return Buffer.from(buf).toString("base64url");
}

function fromB64url(s: string): Buffer {
  return Buffer.from(s, "base64url");
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function createSessionCookieValue(): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    role: "admin",
    iat: now,
    exp: now + COOKIE_MAX_AGE,
  };
  const encoded = b64url(JSON.stringify(payload));
  const signature = sign(encoded, getSecret());
  return `${encoded}.${signature}`;
}

export function verifySessionCookieValue(value: string | undefined | null): SessionPayload | null {
  if (!value) return null;
  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) return null;
  const expected = sign(encoded, getSecret());
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  if (!timingSafeEqual(a, b)) return null;
  let payload: SessionPayload;
  try {
    payload = JSON.parse(fromB64url(encoded).toString("utf8"));
  } catch {
    return null;
  }
  if (payload.role !== "admin") return null;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

export async function getSession(): Promise<SessionPayload | null> {
  const c = await cookies();
  return verifySessionCookieValue(c.get(COOKIE_NAME)?.value);
}

export async function setSessionCookie() {
  const c = await cookies();
  c.set(COOKIE_NAME, createSessionCookieValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;

// Helper for first-time setup: prints a generator suggestion if AUTH_SECRET
// looks weak. Used by the admin login page banner.
export function suggestStrongSecret(): string {
  return randomBytes(48).toString("base64url");
}
