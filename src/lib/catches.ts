import { sql } from "./db";
import type { CatchRow } from "./types";

export type SortMode = "date" | "length" | "weight";

export async function listCatches(
  limit = 200,
  sortMode: SortMode = "date",
): Promise<CatchRow[]> {
  const { rows } = await sql<CatchRow>`
    SELECT
      id,
      species_id,
      species_name_snapshot,
      length_cm::float8 AS length_cm,
      weight_kg::float8 AS weight_kg,
      to_char(caught_on, 'YYYY-MM-DD') AS caught_on,
      location,
      bait,
      notes,
      created_at,
      updated_at
    FROM catches
    ORDER BY caught_on DESC, id DESC
    LIMIT ${limit}
  `;
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

export async function getCatch(id: number): Promise<CatchRow | null> {
  const { rows } = await sql<CatchRow>`
    SELECT
      id,
      species_id,
      species_name_snapshot,
      length_cm::float8 AS length_cm,
      weight_kg::float8 AS weight_kg,
      to_char(caught_on, 'YYYY-MM-DD') AS caught_on,
      location,
      bait,
      notes,
      created_at,
      updated_at
    FROM catches
    WHERE id = ${id}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export type CatchInput = {
  species_id: number;
  species_name_snapshot: string;
  length_cm: number | null;
  weight_kg: number | null;
  caught_on: string;
  location: string | null;
  bait: string | null;
  notes: string | null;
};

export async function insertCatch(input: CatchInput): Promise<number> {
  const { rows } = await sql<{ id: number }>`
    INSERT INTO catches (
      species_id, species_name_snapshot, length_cm, weight_kg,
      caught_on, location, bait, notes
    )
    VALUES (
      ${input.species_id}, ${input.species_name_snapshot},
      ${input.length_cm}, ${input.weight_kg},
      ${input.caught_on}, ${input.location}, ${input.bait}, ${input.notes}
    )
    RETURNING id
  `;
  return rows[0].id;
}

export async function updateCatch(
  id: number,
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
      bait = ${input.bait},
      notes = ${input.notes},
      updated_at = NOW()
    WHERE id = ${id}
  `;
}

export async function deleteCatch(id: number): Promise<void> {
  await sql`DELETE FROM catches WHERE id = ${id}`;
}

export type Stats = {
  total_catches: number;
  distinct_species: number;
  this_month: number;
  longest: { species_name_snapshot: string; length_cm: number } | null;
  heaviest: { species_name_snapshot: string; weight_kg: number } | null;
};

export async function getStats(): Promise<Stats> {
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
  `;

  const longest = await sql<{ species_name_snapshot: string; length_cm: number }>`
    SELECT species_name_snapshot, length_cm::float8 AS length_cm
    FROM catches
    WHERE length_cm IS NOT NULL
    ORDER BY length_cm DESC
    LIMIT 1
  `;

  const heaviest = await sql<{ species_name_snapshot: string; weight_kg: number }>`
    SELECT species_name_snapshot, weight_kg::float8 AS weight_kg
    FROM catches
    WHERE weight_kg IS NOT NULL
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
