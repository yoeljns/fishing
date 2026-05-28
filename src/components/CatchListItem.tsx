"use client";

import Link from "next/link";
import { useTransition } from "react";
import type { CatchRow } from "@/lib/types";
import { formatLength, formatWeight } from "@/lib/units";
import { deleteCatchAction } from "@/app/catches/actions";
import { useUnits } from "./UnitToggle";

export function CatchListItem({ catchRow }: { catchRow: CatchRow }) {
  const units = useUnits();
  const [isPending, startTransition] = useTransition();

  const onDelete = () => {
    if (!confirm(`Delete this ${catchRow.species_name_snapshot} catch?`)) {
      return;
    }
    startTransition(async () => {
      await deleteCatchAction(catchRow.id);
    });
  };

  return (
    <li className="bg-white border border-slate-200 rounded-lg p-4 flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h3 className="text-lg font-semibold">
            {catchRow.species_name_snapshot}
          </h3>
          <span className="text-sm text-slate-500">{catchRow.caught_on}</span>
        </div>
        <div className="text-sm text-slate-600 mt-1 flex flex-wrap gap-x-4 gap-y-1">
          <span>Length: {formatLength(catchRow.length_cm, units)}</span>
          <span>Weight: {formatWeight(catchRow.weight_kg, units)}</span>
          {catchRow.location ? (
            <span>Location: {catchRow.location}</span>
          ) : null}
          {catchRow.bait ? <span>Bait: {catchRow.bait}</span> : null}
        </div>
        {catchRow.notes ? (
          <p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">
            {catchRow.notes}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        <Link
          href={`/catches/${catchRow.id}/edit`}
          className="text-sm text-brand-700 hover:underline"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={onDelete}
          disabled={isPending}
          className="text-sm text-red-600 hover:underline disabled:opacity-50"
        >
          {isPending ? "Deleting…" : "Delete"}
        </button>
      </div>
    </li>
  );
}
