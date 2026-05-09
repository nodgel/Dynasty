// HMAC-signed session cookie. Uses Web Crypto API so it works in both the
// Node runtime (server actions, route handlers) and the Edge runtime
// (middleware) without changing imports.
//
// Cookie format: <base64url payload>.<base64url HMAC-SHA256(payload, AUTH_SECRET)>
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

const enc = new TextEncoder();
const dec = new TextDecoder();

function bytesToB64Url(bytes: ArrayBuffer | Uint8Array): string {
  const u = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = "";
  for (let i = 0; i < u.length; i++) s += String.fromCharCode(u[i]);
  return btoa(s).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function b64UrlToBytes(s: string): Uint8Array {
  const norm = s.replaceAll("-", "+").replaceAll("_", "/");
  const padded = norm + "=".repeat((4 - (norm.length % 4)) % 4);
  const bin = atob(padded);
  const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return u;
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function signHmac(payload: string, secret: string): Promise<string> {
  const key = await importKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return bytesToB64Url(sig);
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function verifyPassword(input: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return constantTimeEqual(input, expected);
}

export async function createSessionCookieValue(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    role: "admin",
    iat: now,
    exp: now + COOKIE_MAX_AGE,
  };
  const encoded = bytesToB64Url(enc.encode(JSON.stringify(payload)));
  const signature = await signHmac(encoded, getSecret());
  return `${encoded}.${signature}`;
}

export async function verifySessionCookieValue(
  value: string | undefined | null
): Promise<SessionPayload | null> {
  if (!value) return null;
  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) return null;
  let expected: string;
  try {
    expected = await signHmac(encoded, getSecret());
  } catch {
    return null;
  }
  if (!constantTimeEqual(signature, expected)) return null;

  let payload: SessionPayload;
  try {
    payload = JSON.parse(dec.decode(b64UrlToBytes(encoded)));
  } catch {
    return null;
  }
  if (payload.role !== "admin") return null;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

// Server-only helpers (read/write the cookie store). These can't run in the
// middleware, so they're loaded lazily — the middleware only ever calls
// verifySessionCookieValue() above, which is runtime-agnostic.
export async function getSession(): Promise<SessionPayload | null> {
  const { cookies } = await import("next/headers");
  const c = await cookies();
  return verifySessionCookieValue(c.get(COOKIE_NAME)?.value);
}

export async function setSessionCookie() {
  const { cookies } = await import("next/headers");
  const c = await cookies();
  c.set(COOKIE_NAME, await createSessionCookieValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const { cookies } = await import("next/headers");
  const c = await cookies();
  c.delete(COOKIE_NAME);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
