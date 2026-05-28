"use client";

import { memo } from "react";
import type { SpeciesWithStats } from "@/lib/types";
import { formatLength, formatWeight } from "@/lib/units";
import { useUnits } from "./UnitToggle";

type Props = {
  s: SpeciesWithStats;
};

function isHebrew(text: string): boolean {
  return /[֐-׿]/.test(text);
}

function SpeciesRowImpl({ s }: Props) {
  const units = useUnits();
  const caught = s.catch_count > 0;
  return (
    <li
      className={`border rounded-lg p-3 flex items-start justify-between gap-3 transition-colors duration-150 ${
        caught
          ? "bg-brand-50 border-brand-500 dark:bg-brand-900/30 dark:border-brand-700"
          : "bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center justify-center shrink-0 w-5 h-5 rounded border text-xs ${
              caught
                ? "bg-brand-600 border-brand-600 text-white"
                : "border-slate-300 dark:border-slate-600"
            }`}
            aria-hidden
          >
            {caught ? "✓" : ""}
          </span>
          <h3 className="font-medium truncate text-slate-900 dark:text-slate-100">
            {s.common_name}
          </h3>
        </div>
        {s.scientific_name ? (
          <p className="text-xs italic text-slate-500 dark:text-slate-400 ml-7">
            {s.scientific_name}
          </p>
        ) : null}
        {s.aliases.length > 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 ml-7 mt-1">
            Also:{" "}
            {s.aliases.map((a, i) => (
              <span key={a} dir={isHebrew(a) ? "rtl" : "ltr"}>
                {a}
                {i < s.aliases.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        ) : null}
        <p className="text-xs text-slate-500 dark:text-slate-400 ml-7 mt-1">
          {s.water_type}
          {s.regions.length > 0 ? ` · ${s.regions.join(", ")}` : ""}
        </p>
        {caught ? (
          <p className="text-xs text-brand-700 dark:text-brand-300 ml-7 mt-1 font-medium">
            Caught {s.catch_count}×
            {s.max_length_cm != null
              ? ` · best ${formatLength(s.max_length_cm, units)}`
              : ""}
            {s.max_weight_kg != null
              ? ` / ${formatWeight(s.max_weight_kg, units)}`
              : ""}
          </p>
        ) : (
          <p className="text-xs text-slate-400 dark:text-slate-500 ml-7 mt-1">
            Not caught yet
          </p>
        )}
      </div>
    </li>
  );
}

export const SpeciesRow = memo(SpeciesRowImpl, (a, b) => {
  const x = a.s;
  const y = b.s;
  return (
    x.id === y.id &&
    x.catch_count === y.catch_count &&
    x.max_length_cm === y.max_length_cm &&
    x.max_weight_kg === y.max_weight_kg
  );
});
