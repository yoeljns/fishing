import { Pool, type QueryResult, type QueryResultRow } from "pg";
import { SPECIES_SEED } from "./species-seed";

declare global {
  var _fjPgPool: Pool | undefined;
  var _fjSchemaReady: boolean | undefined;
  var _fjSchemaPromise: Promise<void> | undefined;
}

const SEED_VERSION = "2026-05-28-122-aliases";

function getPool(): Pool {
  if (!globalThis._fjPgPool) {
    const connectionString = process.env.POSTGRES_URL;
    if (!connectionString) {
      throw new Error("POSTGRES_URL environment variable is required");
    }
    const useSsl =
      process.env.PGSSLMODE === "require" ||
      /sslmode=require/i.test(connectionString) ||
      /\.vercel-storage\.com/.test(connectionString) ||
      /\.neon\.tech/.test(connectionString);
    globalThis._fjPgPool = new Pool({
      connectionString,
      ssl: useSsl ? { rejectUnauthorized: false } : undefined,
      max: 5,
    });
  }
  return globalThis._fjPgPool!;
}

async function runSchema(): Promise<void> {
  const pool = getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      username      TEXT NOT NULL,
      display_name  TEXT,
      password_hash TEXT NOT NULL,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_lower ON users (lower(username))`,
  );

  await pool.query(`
    CREATE TABLE IF NOT EXISTS friendships (
      id           SERIAL PRIMARY KEY,
      requester_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      addressee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status       TEXT NOT NULL DEFAULT 'pending',
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (requester_id, addressee_id)
    )
  `);
  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_friendships_addressee ON friendships (addressee_id, status)`,
  );
  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_friendships_requester ON friendships (requester_id, status)`,
  );

  await pool.query(`
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
  `);
  await pool.query(
    `ALTER TABLE species ADD COLUMN IF NOT EXISTS aliases TEXT[] NOT NULL DEFAULT '{}'`,
  );
  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_species_water_type ON species (water_type)`,
  );
  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_species_regions ON species USING GIN (regions)`,
  );
  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_species_aliases ON species USING GIN (aliases)`,
  );

  await pool.query(`
    CREATE TABLE IF NOT EXISTS catches (
      id                    SERIAL PRIMARY KEY,
      species_id            INTEGER REFERENCES species(id) ON DELETE SET NULL,
      species_name_snapshot TEXT NOT NULL,
      length_cm             NUMERIC(6,2),
      weight_kg             NUMERIC(6,3),
      caught_on             DATE NOT NULL,
      location              TEXT,
      latitude              NUMERIC(9,6),
      longitude             NUMERIC(9,6),
      bait                  TEXT,
      notes                 TEXT,
      created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(
    `ALTER TABLE catches ADD COLUMN IF NOT EXISTS latitude NUMERIC(9,6)`,
  );
  await pool.query(
    `ALTER TABLE catches ADD COLUMN IF NOT EXISTS longitude NUMERIC(9,6)`,
  );
  await pool.query(
    `ALTER TABLE catches ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE`,
  );
  await pool.query(
    `ALTER TABLE catches ADD COLUMN IF NOT EXISTS visibility TEXT NOT NULL DEFAULT 'friends'`,
  );
  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_catches_caught_on ON catches (caught_on DESC)`,
  );
  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_catches_species_id ON catches (species_id)`,
  );
  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_catches_user_id ON catches (user_id)`,
  );

  await pool.query(`
    CREATE TABLE IF NOT EXISTS _fj_meta (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  const versionResult = await pool.query<{ value: string }>(
    `SELECT value FROM _fj_meta WHERE key = 'seed_version'`,
  );
  if (versionResult.rows[0]?.value === SEED_VERSION) return;

  const placeholders: string[] = [];
  const params: unknown[] = [];
  let p = 1;
  for (const s of SPECIES_SEED) {
    placeholders.push(
      `($${p++}, $${p++}, $${p++}, $${p++}, $${p++}::text[], $${p++}::text[], FALSE)`,
    );
    params.push(
      s.common_name,
      s.scientific_name,
      s.family,
      s.water_type,
      pgTextArrayLiteral(s.regions),
      pgTextArrayLiteral(s.aliases),
    );
  }
  await pool.query(
    `INSERT INTO species (common_name, scientific_name, family, water_type, regions, aliases, is_custom)
     VALUES ${placeholders.join(",")}
     ON CONFLICT (common_name) DO UPDATE SET
       scientific_name = EXCLUDED.scientific_name,
       family          = EXCLUDED.family,
       water_type      = EXCLUDED.water_type,
       regions         = EXCLUDED.regions,
       aliases         = EXCLUDED.aliases`,
    params,
  );

  await pool.query(
    `INSERT INTO _fj_meta (key, value) VALUES ('seed_version', $1)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
    [SEED_VERSION],
  );
}

async function ensureSchema(): Promise<void> {
  if (globalThis._fjSchemaReady) return;
  if (!globalThis._fjSchemaPromise) {
    globalThis._fjSchemaPromise = runSchema()
      .then(() => {
        globalThis._fjSchemaReady = true;
      })
      .catch((err) => {
        globalThis._fjSchemaPromise = undefined;
        throw err;
      });
  }
  return globalThis._fjSchemaPromise;
}

export async function sql<T extends QueryResultRow = QueryResultRow>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<QueryResult<T>> {
  await ensureSchema();
  let text = "";
  for (let i = 0; i < strings.length; i++) {
    text += strings[i];
    if (i < values.length) text += `$${i + 1}`;
  }
  return getPool().query<T>(text, values as unknown[]);
}

export function pgTextArrayLiteral(values: string[]): string {
  const escaped = values.map(
    (v) => `"${v.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`,
  );
  return `{${escaped.join(",")}}`;
}
