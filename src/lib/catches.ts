import { sql } from "./db";
import type { CatchRow, Visibility } from "./types";

export type SortMode = "date" | "length" | "weight";

function applySort(rows: CatchRow[], sortMode: SortMode): CatchRow[] {
  if (sortMode === "length") {
    return [...rows].sort(
      (a, b) => (b.length_cm ?? -Infinity) - (a.length_cm ?? -Infinity),
    );
  }
  if (sortMode === "weight") {
    return [...rows].sort(
      (a, b) => (b.weight_kg ?? -Infinity) - (a.weight_kg ?? -Infinity),
    );
  }
  return rows;
}

/** A user's own catches (all visibilities). */
export async function listCatches(
  userId: number,
  limit = 200,
  sortMode: SortMode = "date",
): Promise<CatchRow[]> {
  const { rows } = await sql<CatchRow>`
    SELECT
      id, user_id, species_id, species_name_snapshot,
      length_cm::float8 AS length_cm,
      weight_kg::float8 AS weight_kg,
      to_char(caught_on, 'YYYY-MM-DD') AS caught_on,
      location,
      latitude::float8 AS latitude,
      longitude::float8 AS longitude,
      visibility, bait, notes, created_at, updated_at
    FROM catches
    WHERE user_id = ${userId}
    ORDER BY caught_on DESC, id DESC
    LIMIT ${limit}
  `;
  return applySort(rows, sortMode);
}

/**
 * Catches owned by `targetId` that `viewerId` is allowed to see.
 * Owner sees all; accepted friends see friends+public; others see public.
 */
export async function listVisibleCatches(
  targetId: number,
  viewerId: number,
  isFriend: boolean,
  limit = 200,
  sortMode: SortMode = "date",
): Promise<CatchRow[]> {
  const allowed: Visibility[] =
    viewerId === targetId
      ? ["private", "friends", "public"]
      : isFriend
        ? ["friends", "public"]
        : ["public"];
  const { rows } = await sql<CatchRow>`
    SELECT
      id, user_id, species_id, species_name_snapshot,
      length_cm::float8 AS length_cm,
      weight_kg::float8 AS weight_kg,
      to_char(caught_on, 'YYYY-MM-DD') AS caught_on,
      location,
      latitude::float8 AS latitude,
      longitude::float8 AS longitude,
      visibility, bait, notes, created_at, updated_at
    FROM catches
    WHERE user_id = ${targetId}
      AND visibility = ANY(${allowed})
    ORDER BY caught_on DESC, id DESC
    LIMIT ${limit}
  `;
  return applySort(rows, sortMode);
}

/** Recent catches from the viewer's accepted friends (friends+public). */
export async function listFriendsFeed(
  viewerId: number,
  limit = 15,
): Promise<Array<CatchRow & { username: string; display_name: string | null }>> {
  const { rows } = await sql<
    CatchRow & { username: string; display_name: string | null }
  >`
    SELECT
      c.id, c.user_id, c.species_id, c.species_name_snapshot,
      c.length_cm::float8 AS length_cm,
      c.weight_kg::float8 AS weight_kg,
      to_char(c.caught_on, 'YYYY-MM-DD') AS caught_on,
      c.location,
      c.latitude::float8 AS latitude,
      c.longitude::float8 AS longitude,
      c.visibility, c.bait, c.notes, c.created_at, c.updated_at,
      u.username, u.display_name
    FROM catches c
    JOIN users u ON u.id = c.user_id
    JOIN friendships f
      ON f.status = 'accepted'
      AND ((f.requester_id = ${viewerId} AND f.addressee_id = c.user_id)
        OR (f.addressee_id = ${viewerId} AND f.requester_id = c.user_id))
    WHERE c.visibility IN ('friends', 'public')
    ORDER BY c.created_at DESC, c.id DESC
    LIMIT ${limit}
  `;
  return rows;
}

export async function getCatch(
  id: number,
  userId: number,
): Promise<CatchRow | null> {
  const { rows } = await sql<CatchRow>`
    SELECT
      id, user_id, species_id, species_name_snapshot,
      length_cm::float8 AS length_cm,
      weight_kg::float8 AS weight_kg,
      to_char(caught_on, 'YYYY-MM-DD') AS caught_on,
      location,
      latitude::float8 AS latitude,
      longitude::float8 AS longitude,
      visibility, bait, notes, created_at, updated_at
    FROM catches
    WHERE id = ${id} AND user_id = ${userId}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export type CatchInput = {
  user_id: number;
  species_id: number;
  species_name_snapshot: string;
  length_cm: number | null;
  weight_kg: number | null;
  caught_on: string;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  visibility: Visibility;
  bait: string | null;
  notes: string | null;
};

export async function insertCatch(input: CatchInput): Promise<number> {
  const { rows } = await sql<{ id: number }>`
    INSERT INTO catches (
      user_id, species_id, species_name_snapshot, length_cm, weight_kg,
      caught_on, location, latitude, longitude, visibility, bait, notes
    )
    VALUES (
      ${input.user_id}, ${input.species_id}, ${input.species_name_snapshot},
      ${input.length_cm}, ${input.weight_kg},
      ${input.caught_on}, ${input.location},
      ${input.latitude}, ${input.longitude},
      ${input.visibility}, ${input.bait}, ${input.notes}
    )
    RETURNING id
  `;
  return rows[0].id;
}

export async function updateCatch(
  id: number,
  userId: number,
  input: CatchInput,
): Promise<void> {
  await sql`
    UPDATE catches SET
      species_id = ${input.species_id},
      species_name_snapshot = ${input.species_name_snapshot},
      length_cm = ${input.length_cm},
      weight_kg = ${input.weight_kg},
      caught_on = ${input.caught_on},
      location = ${input.location},
      latitude = ${input.latitude},
      longitude = ${input.longitude},
      visibility = ${input.visibility},
      bait = ${input.bait},
      notes = ${input.notes},
      updated_at = NOW()
    WHERE id = ${id} AND user_id = ${userId}
  `;
}

export async function deleteCatch(id: number, userId: number): Promise<void> {
  await sql`DELETE FROM catches WHERE id = ${id} AND user_id = ${userId}`;
}

export type Stats = {
  total_catches: number;
  distinct_species: number;
  this_month: number;
  longest: { species_name_snapshot: string; length_cm: number } | null;
  heaviest: { species_name_snapshot: string; weight_kg: number } | null;
};

export async function getStats(userId: number): Promise<Stats> {
  const totals = await sql<{
    total: number;
    distinct: number;
    this_month: number;
  }>`
    SELECT
      COUNT(*)::int AS total,
      COUNT(DISTINCT species_id)::int AS distinct,
      COUNT(*) FILTER (WHERE caught_on >= (CURRENT_DATE - INTERVAL '30 days'))::int AS this_month
    FROM catches
    WHERE user_id = ${userId}
  `;

  const longest = await sql<{ species_name_snapshot: string; length_cm: number }>`
    SELECT species_name_snapshot, length_cm::float8 AS length_cm
    FROM catches
    WHERE user_id = ${userId} AND length_cm IS NOT NULL
    ORDER BY length_cm DESC
    LIMIT 1
  `;

  const heaviest = await sql<{ species_name_snapshot: string; weight_kg: number }>`
    SELECT species_name_snapshot, weight_kg::float8 AS weight_kg
    FROM catches
    WHERE user_id = ${userId} AND weight_kg IS NOT NULL
    ORDER BY weight_kg DESC
    LIMIT 1
  `;

  return {
    total_catches: totals.rows[0]?.total ?? 0,
    distinct_species: totals.rows[0]?.distinct ?? 0,
    this_month: totals.rows[0]?.this_month ?? 0,
    longest: longest.rows[0] ?? null,
    heaviest: heaviest.rows[0] ?? null,
  };
}
