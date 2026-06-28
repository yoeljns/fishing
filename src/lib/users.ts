import { sql } from "./db";
import { hashPassword } from "./auth";
import type { User } from "./types";

export async function getUserById(id: number): Promise<User | null> {
  const { rows } = await sql<User>`
    SELECT id, username, display_name,
           to_char(created_at, 'YYYY-MM-DD') AS created_at
    FROM users WHERE id = ${id} LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function getUserByUsername(
  username: string,
): Promise<User | null> {
  const { rows } = await sql<User>`
    SELECT id, username, display_name,
           to_char(created_at, 'YYYY-MM-DD') AS created_at
    FROM users WHERE lower(username) = lower(${username}) LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function getUserWithHash(
  username: string,
): Promise<{ id: number; password_hash: string } | null> {
  const { rows } = await sql<{ id: number; password_hash: string }>`
    SELECT id, password_hash FROM users
    WHERE lower(username) = lower(${username}) LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function usernameTaken(username: string): Promise<boolean> {
  const { rows } = await sql<{ exists: boolean }>`
    SELECT EXISTS (
      SELECT 1 FROM users WHERE lower(username) = lower(${username})
    ) AS exists
  `;
  return rows[0]?.exists ?? false;
}

export async function countUsers(): Promise<number> {
  const { rows } = await sql<{ count: number }>`
    SELECT COUNT(*)::int AS count FROM users
  `;
  return rows[0]?.count ?? 0;
}

export async function createUser(
  username: string,
  displayName: string | null,
  password: string,
): Promise<User> {
  const hash = await hashPassword(password);
  const { rows } = await sql<User>`
    INSERT INTO users (username, display_name, password_hash)
    VALUES (${username}, ${displayName}, ${hash})
    RETURNING id, username, display_name,
              to_char(created_at, 'YYYY-MM-DD') AS created_at
  `;
  return rows[0];
}

/** One-time migration: give any pre-multi-user catches to the first account. */
export async function claimOrphanCatches(userId: number): Promise<number> {
  const { rowCount } = await sql`
    UPDATE catches SET user_id = ${userId} WHERE user_id IS NULL
  `;
  return rowCount ?? 0;
}

/** Search users by username / display name, excluding the viewer. */
export async function searchUsers(
  query: string,
  excludeUserId: number,
  limit = 12,
): Promise<User[]> {
  const like = `%${query.trim()}%`;
  const { rows } = await sql<User>`
    SELECT id, username, display_name,
           to_char(created_at, 'YYYY-MM-DD') AS created_at
    FROM users
    WHERE id <> ${excludeUserId}
      AND (username ILIKE ${like} OR display_name ILIKE ${like})
    ORDER BY username ASC
    LIMIT ${limit}
  `;
  return rows;
}
