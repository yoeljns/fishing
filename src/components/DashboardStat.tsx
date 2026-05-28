"use client";

import { formatLength, formatWeight } from "@/lib/units";
import { useUnits } from "./UnitToggle";

type Props = {
  label: string;
  value: number | null;
  format: "length" | "weight";
  species: string | null;
};

export function DashboardStat({ label, value, format, species }: Props) {
  const units = useUnits();
  const formatted =
    value == null
      ? null
      : format === "length"
        ? formatLength(value, units)
        : formatWeight(value, units);
  return (
    <div className="rounded-lg p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </div>
      {formatted ? (
        <>
          <div className="text-2xl font-semibold mt-1 text-slate-900 dark:text-slate-100">
            {formatted}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 truncate">
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
