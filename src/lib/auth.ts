import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "fj_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "SESSION_SECRET environment variable is required (min 16 chars)",
    );
  }
  return secret;
}

function hmac(secret: string, payload: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function signSession(): string {
  const issuedAt = Date.now().toString();
  const sig = hmac(getSecret(), issuedAt);
  return `${issuedAt}.${sig}`;
}

export function verifySession(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  const dot = cookieValue.indexOf(".");
  if (dot < 0) return false;
  const issuedAt = cookieValue.slice(0, dot);
  const sig = cookieValue.slice(dot + 1);

  const issuedAtMs = Number(issuedAt);
  if (!Number.isFinite(issuedAtMs)) return false;
  if (Date.now() - issuedAtMs > SESSION_MAX_AGE_SECONDS * 1000) return false;

  let expected: string;
  try {
    expected = hmac(getSecret(), issuedAt);
  } catch {
    return false;
  }
  const a = Buffer.from(sig, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function checkPassword(submitted: string): boolean {
  const expected = process.env.APP_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(submitted);
  const b = Buffer.from(expected);
  const max = Math.max(a.length, b.length);
  const aPadded = Buffer.alloc(max);
  const bPadded = Buffer.alloc(max);
  a.copy(aPadded);
  b.copy(bPadded);
  return timingSafeEqual(aPadded, bPadded) && a.length === b.length;
}
