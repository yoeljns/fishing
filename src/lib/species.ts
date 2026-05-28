import { sql, pgTextArrayLiteral } from "./db";
import type { Species, SpeciesWithStats } from "./types";

export async function listSpecies(): Promise<Species[]> {
  const { rows } = await sql<Species>`
    SELECT id, common_name, scientific_name, family, water_type, regions, aliases, is_custom
    FROM species
    ORDER BY common_name ASC
  `;
  return rows;
}

export async function listSpeciesWithStats(): Promise<SpeciesWithStats[]> {
  const { rows } = await sql<SpeciesWithStats>`
    SELECT
      s.id,
      s.common_name,
      s.scientific_name,
      s.family,
      s.water_type,
      s.regions,
      s.aliases,
      s.is_custom,
      COUNT(c.id)::int AS catch_count,
      MAX(c.length_cm)::float8 AS max_length_cm,
      MAX(c.weight_kg)::float8 AS max_weight_kg
    FROM species s
    LEFT JOIN catches c ON c.species_id = s.id
    GROUP BY s.id
    ORDER BY s.common_name ASC
  `;
  return rows;
}

export async function findSpeciesByName(
  name: string,
): Promise<Species | null> {
  const { rows } = await sql<Species>`
    SELECT id, common_name, scientific_name, family, water_type, regions, aliases, is_custom
    FROM species
    WHERE LOWER(common_name) = LOWER(${name})
       OR EXISTS (
         SELECT 1 FROM unnest(aliases) AS a
         WHERE LOWER(a) = LOWER(${name})
       )
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function upsertCustomSpecies(name: string): Promise<Species> {
  const trimmed = name.trim();
  const existing = await findSpeciesByName(trimmed);
  if (existing) return existing;

  const regionsLit = pgTextArrayLiteral(["Custom"]);
  const aliasesLit = pgTextArrayLiteral([]);
  const { rows } = await sql<Species>`
    INSERT INTO species (common_name, scientific_name, family, water_type, regions, aliases, is_custom)
    VALUES (${trimmed}, NULL, NULL, 'Unknown', ${regionsLit}::text[], ${aliasesLit}::text[], TRUE)
    ON CONFLICT (common_name) DO UPDATE SET common_name = EXCLUDED.common_name
    RETURNING id, common_name, scientific_name, family, water_type, regions, aliases, is_custom
  `;
  return rows[0];
}
