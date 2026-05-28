import { NextResponse } from "next/server";
import { sql, pgTextArrayLiteral } from "@/lib/db";
import { SPECIES_SEED } from "@/lib/species-seed";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

async function runSetup() {
  await sql`
    CREATE TABLE IF NOT EXISTS species (
      id              SERIAL PRIMARY KEY,
      common_name     TEXT NOT NULL UNIQUE,
      scientific_name TEXT,
      family          TEXT,
      water_type      TEXT NOT NULL,
      regions         TEXT[] NOT NULL DEFAULT '{}',
      is_custom       BOOLEAN NOT NULL DEFAULT FALSE,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_species_water_type ON species (water_type)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_species_regions ON species USING GIN (regions)`;

  await sql`
    CREATE TABLE IF NOT EXISTS catches (
      id                    SERIAL PRIMARY KEY,
      species_id            INTEGER REFERENCES species(id) ON DELETE SET NULL,
      species_name_snapshot TEXT NOT NULL,
      length_cm             NUMERIC(6,2),
      weight_kg             NUMERIC(6,3),
      caught_on             DATE NOT NULL,
      location              TEXT,
      bait                  TEXT,
      notes                 TEXT,
      created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_catches_caught_on ON catches (caught_on DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_catches_species_id ON catches (species_id)`;

  let seeded = 0;
  for (const s of SPECIES_SEED) {
    const regionsLit = pgTextArrayLiteral(s.regions);
    await sql`
      INSERT INTO species (common_name, scientific_name, family, water_type, regions, is_custom)
      VALUES (${s.common_name}, ${s.scientific_name}, ${s.family}, ${s.water_type}, ${regionsLit}::text[], FALSE)
      ON CONFLICT (common_name) DO UPDATE SET
        scientific_name = EXCLUDED.scientific_name,
        family          = EXCLUDED.family,
        water_type      = EXCLUDED.water_type,
        regions         = EXCLUDED.regions
    `;
    seeded++;
  }

  const counts = await sql<{ species: number; catches: number }>`
    SELECT
      (SELECT COUNT(*) FROM species)::int AS species,
      (SELECT COUNT(*) FROM catches)::int AS catches
  `;

  return {
    ok: true,
    seeded,
    totals: counts.rows[0],
  };
}

async function handle(req: Request) {
  const expected = process.env.SETUP_TOKEN;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "SETUP_TOKEN env var not set" },
      { status: 500 },
    );
  }
  const url = new URL(req.url);
  const submitted = url.searchParams.get("token") ?? "";
  if (submitted !== expected) {
    return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 401 });
  }
  try {
    const result = await runSetup();
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;
