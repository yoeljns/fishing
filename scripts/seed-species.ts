import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import { sql, pgTextArrayLiteral } from "../src/lib/db";
import { SPECIES_SEED } from "../src/lib/species-seed";

async function main() {
  console.log(`Seeding ${SPECIES_SEED.length} species…`);
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
  }
  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
