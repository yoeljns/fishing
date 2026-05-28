"use client";

import Link from "next/link";
import type { CatchRow } from "@/lib/types";
import { formatLength, formatWeight } from "@/lib/units";
import { useUnits } from "./UnitToggle";

export function DashboardCatches({ catches }: { catches: CatchRow[] }) {
  const units = useUnits();
  return (
    <ul className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      {catches.map((c) => (
        <li key={c.id}>
          <Link
            href={`/catches/${c.id}/edit`}
            className="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150"
          >
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <div className="font-medium text-slate-900 dark:text-slate-100">
                {c.species_name_snapshot}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {c.caught_on}
              </div>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 flex flex-wrap gap-x-3">
              <span>{formatLength(c.length_cm, units)}</span>
              <span>{formatWeight(c.weight_kg, units)}</span>
              {c.location ? <span>· {c.location}</span> : null}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
