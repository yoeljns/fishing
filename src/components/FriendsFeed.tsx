"use client";

import Link from "next/link";
import type { CatchRow } from "@/lib/types";
import { formatLength, formatWeight } from "@/lib/units";
import { useUnits } from "./UnitToggle";

type FeedItem = CatchRow & { username: string; display_name: string | null };

export function FriendsFeed({ items }: { items: FeedItem[] }) {
  const units = useUnits();

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-white/40 dark:bg-slate-900/40 p-8 text-center">
        <p className="text-slate-600 dark:text-slate-400">
          No friend activity yet.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
          Add friends to see their catches here.
        </p>
        <Link
          href="/friends"
          className="inline-block mt-3 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-md text-sm font-medium"
        >
          Find friends
        </Link>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      {items.map((c) => (
        <li key={c.id} className="px-4 py-3">
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
          <Link
            href={`/u/${c.username}`}
            className="text-xs text-brand-700 dark:text-brand-400 hover:underline mt-1 inline-block"
          >
            {c.display_name || c.username}
          </Link>
        </li>
      ))}
    </ul>
  );
}
