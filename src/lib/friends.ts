import { sql } from "./db";
import type { FriendState, FriendUser, User } from "./types";

/**
 * Friendships are stored as a single directed row (requester → addressee)
 * with a status of 'pending' or 'accepted'. Acceptance keeps the original
 * row but flips status; either direction counts as friends once accepted.
 */

export async function friendState(
  viewerId: number,
  otherId: number,
): Promise<FriendState> {
  if (viewerId === otherId) return "self";
  const { rows } = await sql<{ requester_id: number; status: string }>`
    SELECT requester_id, status FROM friendships
    WHERE (requester_id = ${viewerId} AND addressee_id = ${otherId})
       OR (requester_id = ${otherId} AND addressee_id = ${viewerId})
    LIMIT 1
  `;
  const row = rows[0];
  if (!row) return "none";
  if (row.status === "accepted") return "friends";
  return row.requester_id === viewerId ? "outgoing" : "incoming";
}

export async function areFriends(a: number, b: number): Promise<boolean> {
  if (a === b) return true;
  const { rows } = await sql<{ exists: boolean }>`
    SELECT EXISTS (
      SELECT 1 FROM friendships
      WHERE status = 'accepted'
        AND ((requester_id = ${a} AND addressee_id = ${b})
          OR (requester_id = ${b} AND addressee_id = ${a}))
    ) AS exists
  `;
  return rows[0]?.exists ?? false;
}

export async function listFriends(userId: number): Promise<FriendUser[]> {
  const { rows } = await sql<FriendUser>`
    SELECT u.id, u.username, u.display_name,
           to_char(u.created_at, 'YYYY-MM-DD') AS created_at,
           COUNT(c.id)::int AS catch_count
    FROM friendships f
    JOIN users u ON u.id = CASE
      WHEN f.requester_id = ${userId} THEN f.addressee_id
      ELSE f.requester_id END
    LEFT JOIN catches c
      ON c.user_id = u.id AND c.visibility IN ('friends', 'public')
    WHERE f.status = 'accepted'
      AND (f.requester_id = ${userId} OR f.addressee_id = ${userId})
    GROUP BY u.id
    ORDER BY u.username ASC
  `;
  return rows;
}

export async function listIncomingRequests(userId: number): Promise<User[]> {
  const { rows } = await sql<User>`
    SELECT u.id, u.username, u.display_name,
           to_char(u.created_at, 'YYYY-MM-DD') AS created_at
    FROM friendships f
    JOIN users u ON u.id = f.requester_id
    WHERE f.addressee_id = ${userId} AND f.status = 'pending'
    ORDER BY f.created_at DESC
  `;
  return rows;
}

export async function listOutgoingRequests(userId: number): Promise<User[]> {
  const { rows } = await sql<User>`
    SELECT u.id, u.username, u.display_name,
           to_char(u.created_at, 'YYYY-MM-DD') AS created_at
    FROM friendships f
    JOIN users u ON u.id = f.addressee_id
    WHERE f.requester_id = ${userId} AND f.status = 'pending'
    ORDER BY f.created_at DESC
  `;
  return rows;
}

export async function countIncomingRequests(userId: number): Promise<number> {
  const { rows } = await sql<{ count: number }>`
    SELECT COUNT(*)::int AS count FROM friendships
    WHERE addressee_id = ${userId} AND status = 'pending'
  `;
  return rows[0]?.count ?? 0;
}

/**
 * Send a friend request. If the other user already sent one to us, this
 * accepts it instead (so two crossing requests resolve to friendship).
 */
export async function sendFriendRequest(
  requesterId: number,
  addresseeId: number,
): Promise<void> {
  if (requesterId === addresseeId) return;

  const reverse = await sql<{ id: number }>`
    SELECT id FROM friendships
    WHERE requester_id = ${addresseeId} AND addressee_id = ${requesterId}
    LIMIT 1
  `;
  if (reverse.rows[0]) {
    await sql`
      UPDATE friendships SET status = 'accepted', updated_at = NOW()
      WHERE id = ${reverse.rows[0].id}
    `;
    return;
  }

  await sql`
    INSERT INTO friendships (requester_id, addressee_id, status)
    VALUES (${requesterId}, ${addresseeId}, 'pending')
    ON CONFLICT (requester_id, addressee_id) DO NOTHING
  `;
}

/** Accept a pending request where the current user is the addressee. */
export async function acceptFriendRequest(
  userId: number,
  requesterId: number,
): Promise<void> {
  await sql`
    UPDATE friendships SET status = 'accepted', updated_at = NOW()
    WHERE requester_id = ${requesterId} AND addressee_id = ${userId}
      AND status = 'pending'
  `;
}

/** Remove any friendship/request edge in either direction between two users. */
export async function removeFriendEdge(
  userId: number,
  otherId: number,
): Promise<void> {
  await sql`
    DELETE FROM friendships
    WHERE (requester_id = ${userId} AND addressee_id = ${otherId})
       OR (requester_id = ${otherId} AND addressee_id = ${userId})
  `;
}
