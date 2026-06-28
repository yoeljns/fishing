"use client";

import type { CatchRow } from "@/lib/types";
import { formatLength, formatWeight } from "@/lib/units";
import { useUnits } from "./UnitToggle";

export function ProfileCatchList({ catches }: { catches: CatchRow[] }) {
  const units = useUnits();
  return (
    <ul className="space-y-2">
      {catches.map((c) => (
        <li
          key={c.id}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {c.species_name_snapshot}
            </h3>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {c.caught_on}
            </span>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400 mt-1 flex flex-wrap gap-x-4 gap-y-1">
            <span>Length: {formatLength(c.length_cm, units)}</span>
            <span>Weight: {formatWeight(c.weight_kg, units)}</span>
            {c.location ? <span>Location: {c.location}</span> : null}
            {c.bait ? <span>Bait: {c.bait}</span> : null}
          </div>
          {c.notes ? (
            <p className="text-sm text-slate-700 dark:text-slate-300 mt-2 whitespace-pre-wrap">
              {c.notes}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
