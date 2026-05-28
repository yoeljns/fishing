"use client";

import type { Stats } from "@/lib/catches";
import { formatLength, formatWeight } from "@/lib/units";
import { useUnits } from "./UnitToggle";

export function StatsView({ stats }: { stats: Stats }) {
  const units = useUnits();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <StatCard label="Total catches" value={String(stats.total_catches)} />
      <StatCard label="Distinct species" value={String(stats.distinct_species)} />
      <StatCard
        label="Longest catch"
        value={
          stats.longest
            ? `${formatLength(stats.longest.length_cm, units)} — ${stats.longest.species_name_snapshot}`
            : "—"
        }
      />
      <StatCard
        label="Heaviest catch"
        value={
          stats.heaviest
            ? `${formatWeight(stats.heaviest.weight_kg, units)} — ${stats.heaviest.species_name_snapshot}`
            : "—"
        }
      />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </div>
  );
}
