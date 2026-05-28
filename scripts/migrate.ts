import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import { sql } from "../src/lib/db";

async function main() {
  console.log("Running migrations…");

  await sql`
    CREATE TABLE IF NOT EXISTS species (
      id              SERIAL PRIMARY KEY,
      common_name     TEXT NOT NULL UNIQUE,
      scientific_name TEXT,
      family          TEXT,
      water_type      TEXT NOT NULL,
      regions         TEXT[] NOT NULL DEFAULT '{}',
      aliases         TEXT[] NOT NULL DEFAULT '{}',
      is_custom       BOOLEAN NOT NULL DEFAULT FALSE,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE species ADD COLUMN IF NOT EXISTS aliases TEXT[] NOT NULL DEFAULT '{}'`;
  await sql`CREATE INDEX IF NOT EXISTS idx_species_water_type ON species (water_type)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_species_regions    ON species USING GIN (regions)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_species_aliases    ON species USING GIN (aliases)`;

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
  await sql`CREATE INDEX IF NOT EXISTS idx_catches_caught_on  ON catches (caught_on DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_catches_species_id ON catches (species_id)`;

  console.log("Migrations complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
