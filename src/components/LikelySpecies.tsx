import type { SpeciesWithStats } from "@/lib/types";

type Props = {
  region: string;
  species: SpeciesWithStats[];
};

export function LikelySpecies({ region, species }: Props) {
  return (
    <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Likely here · {region}
        </h2>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {species.length} species
        </span>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {species.map((s) => (
          <li
            key={s.id}
            className={`border rounded-md p-2 flex items-center justify-between gap-2 text-sm ${
              s.catch_count > 0
                ? "bg-brand-50 dark:bg-brand-900/30 border-brand-200 dark:border-brand-800"
                : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
            }`}
          >
            <span className="truncate text-slate-900 dark:text-slate-100">
              {s.common_name}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">
              {s.water_type}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
