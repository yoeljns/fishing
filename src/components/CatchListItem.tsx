"use client";

import Link from "next/link";
import { useState } from "react";
import type { CatchRow } from "@/lib/types";
import { formatLength, formatWeight } from "@/lib/units";
import { useUnits } from "./UnitToggle";

type Props = {
  catchRow: CatchRow;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
};

export function CatchListItem({ catchRow, onDelete, isDeleting }: Props) {
  const units = useUnits();
  const [confirming, setConfirming] = useState(false);

  return (
    <li
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex items-start justify-between gap-4 shadow-sm hover:shadow-md transition-all duration-200 ${
        isDeleting ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {catchRow.species_name_snapshot}
          </h3>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {catchRow.caught_on}
          </span>
          <VisibilityBadge visibility={catchRow.visibility} />
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400 mt-1 flex flex-wrap gap-x-4 gap-y-1">
          <span>Length: {formatLength(catchRow.length_cm, units)}</span>
          <span>Weight: {formatWeight(catchRow.weight_kg, units)}</span>
          {catchRow.location ? (
            <span>Location: {catchRow.location}</span>
          ) : null}
          {catchRow.bait ? <span>Bait: {catchRow.bait}</span> : null}
        </div>
        {catchRow.notes ? (
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-2 whitespace-pre-wrap">
            {catchRow.notes}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        <Link
          href={`/catches/${catchRow.id}/edit`}
          className="text-sm text-brand-700 dark:text-brand-400 hover:underline transition-colors duration-150"
        >
          Edit
        </Link>
        {confirming ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setConfirming(false);
                onDelete(catchRow.id);
              }}
              className="text-sm text-red-600 dark:text-red-400 font-medium hover:underline"
            >
              Confirm
            </button>
            <span className="text-xs text-slate-400">·</span>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="text-sm text-slate-500 dark:text-slate-400 hover:underline"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            disabled={isDeleting}
            className="text-sm text-red-600 dark:text-red-400 hover:underline disabled:opacity-50 transition-colors duration-150"
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        )}
      </div>
    </li>
  );
}

function VisibilityBadge({ visibility }: { visibility: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    private: {
      label: "Private",
      cls: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    },
    friends: {
      label: "Friends",
      cls: "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300",
    },
    public: {
      label: "Public",
      cls: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    },
  };
  const m = map[visibility] ?? map.friends;
  return (
    <span
      className={`text-[10px] uppercase tracking-wide font-medium px-1.5 py-0.5 rounded ${m.cls}`}
    >
      {m.label}
    </span>
  );
}
