import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionUserId } from "@/lib/session";
import { sql } from "@/lib/db";
import { SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Delete the signed-in user's own account.
 *
 * Their catches are detached (user_id set to NULL) rather than deleted, so a
 * journal isn't lost to an accidental account removal. (Orphaned catches are
 * only ever re-adopted by the very first account on a fresh database.)
 */
export async function POST() {
  const userId = await getSessionUserId();
  if (userId == null) {
    return NextResponse.json(
      { ok: false, error: "Not authenticated" },
      { status: 401 },
    );
  }

  const detached = await sql`
    UPDATE catches SET user_id = NULL WHERE user_id = ${userId}
  `;
  await sql`DELETE FROM users WHERE id = ${userId}`;

  const store = await cookies();
  store.delete(SESSION_COOKIE);

  return NextResponse.json({
    ok: true,
    detached_catches: detached.rowCount ?? 0,
  });
}
