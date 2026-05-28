import { listSpeciesWithStats } from "@/lib/species";
import { SpeciesChecklist } from "@/components/SpeciesChecklist";

export const dynamic = "force-dynamic";

export default async function SpeciesPage() {
  const species = await listSpeciesWithStats();

  const waterTypes = Array.from(
    new Set(species.map((s) => s.water_type)),
  ).sort();
  const regions = Array.from(
    new Set(species.flatMap((s) => s.regions)),
  ).sort();

  const caughtCount = species.filter((s) => s.catch_count > 0).length;
  const totalCount = species.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Species checklist</h1>
        <div className="text-sm text-slate-600">
          {caughtCount} of {totalCount} caught
        </div>
      </div>
      <SpeciesChecklist
        species={species}
        waterTypes={waterTypes}
        regions={regions}
      />
    </div>
  );
}
