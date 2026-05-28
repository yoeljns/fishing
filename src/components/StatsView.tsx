"use client";

import type { Stats } from "@/lib/catches";
import { formatLength, formatWeight } from "@/lib/units";
import { useUnits } from "./UnitToggle";

export function StatsView({ stats }: { stats: Stats }) {
  const units = useUnits();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard
          label="Total catches"
          value={String(stats.total_catches)}
          tone="brand"
        />
        <StatCard
          label="Distinct species"
          value={String(stats.distinct_species)}
        />
        <StatCard
          label="Last 30 days"
          value={String(stats.this_month)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <RecordCard
          label="Longest catch"
          value={
            stats.longest
              ? formatLength(stats.longest.length_cm, units)
              : null
          }
          species={stats.longest?.species_name_snapshot ?? null}
        />
        <RecordCard
          label="Heaviest catch"
          value={
            stats.heaviest
              ? formatWeight(stats.heaviest.weight_kg, units)
              : null
          }
          species={stats.heaviest?.species_name_snapshot ?? null}
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "brand" | "neutral";
}) {
  return (
    <div
      className={`rounded-lg p-4 border shadow-sm transition-colors duration-150 ${
        tone === "brand"
          ? "bg-brand-50 dark:bg-brand-900/30 border-brand-200 dark:border-brand-800"
          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
      }`}
    >
      <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div
        className={`text-2xl font-semibold mt-1 ${
          tone === "brand"
            ? "text-brand-700 dark:text-brand-300"
            : "text-slate-900 dark:text-slate-100"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function RecordCard({
  label,
  value,
  species,
}: {
  label: string;
  value: string | null;
  species: string | null;
}) {
  return (
    <div className="rounded-lg p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </div>
      {value ? (
        <>
          <div className="text-2xl font-semibold mt-1 text-slate-900 dark:text-slate-100">
            {value}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            {species}
          </div>
        </>
      ) : (
        <div className="text-sm text-slate-400 dark:text-slate-500 mt-2 italic">
          No catches yet
        </div>
      )}
    </div>
  );
}
