import {
  createHmac,
  timingSafeEqual,
  randomBytes,
  scrypt as scryptCb,
} from "node:crypto";
import { promisify } from "node:util";

export const SESSION_COOKIE = "fj_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const scrypt = promisify(scryptCb) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
) => Promise<Buffer>;

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

export function signSession(userId: number): string {
  const issuedAt = Date.now().toString();
  const payload = `${userId}.${issuedAt}`;
  const sig = hmac(getSecret(), payload);
  return `${payload}.${sig}`;
}

/** Returns the authenticated user id, or null if the cookie is missing/invalid/expired. */
export function verifySession(cookieValue: string | undefined): number | null {
  if (!cookieValue) return null;
  const parts = cookieValue.split(".");
  if (parts.length !== 3) return null;
  const [userIdStr, issuedAt, sig] = parts;

  const userId = Number(userIdStr);
  const issuedAtMs = Number(issuedAt);
  if (!Number.isInteger(userId) || userId <= 0) return null;
  if (!Number.isFinite(issuedAtMs)) return null;
  if (Date.now() - issuedAtMs > SESSION_MAX_AGE_SECONDS * 1000) return null;

  let expected: string;
  try {
    expected = hmac(getSecret(), `${userIdStr}.${issuedAt}`);
  } catch {
    return null;
  }
  const a = Buffer.from(sig, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length) return null;
  return timingSafeEqual(a, b) ? userId : null;
}

/** Hash a plaintext password using scrypt. Format: scrypt:<saltHex>:<hashHex> */
export async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scrypt(plain, salt, 64);
  return `scrypt:${salt.toString("hex")}:${derived.toString("hex")}`;
}

export async function verifyPassword(
  plain: string,
  stored: string,
): Promise<boolean> {
  const parts = stored.split(":");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const salt = Buffer.from(parts[1], "hex");
  const expected = Buffer.from(parts[2], "hex");
  if (expected.length === 0) return false;
  let derived: Buffer;
  try {
    derived = await scrypt(plain, salt, expected.length);
  } catch {
    return false;
  }
  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}
