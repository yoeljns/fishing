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
  const pct = totalCount === 0 ? 0 : Math.round((caughtCount / totalCount) * 100);

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Species checklist
          </h1>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {caughtCount}
            </span>{" "}
            of {totalCount} caught
            <span className="ml-2 text-xs text-slate-500 dark:text-slate-500">
              ({pct}%)
            </span>
          </div>
        </div>
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500"
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Species caught"
          />
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
