"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import type { SortMode } from "@/lib/catches";

const LABELS: Record<SortMode, string> = {
  date: "Newest first",
  length: "Longest first",
  weight: "Heaviest first",
};

export function CatchesSort({ value }: { value: SortMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const onChange = (next: SortMode) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (next === "date") params.delete("sort");
    else params.set("sort", next);
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `/catches?${qs}` : "/catches");
    });
  };

  return (
    <label className="text-sm flex items-center gap-2">
      <span className="sr-only">Sort</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortMode)}
        disabled={isPending}
        className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 transition-colors duration-150 disabled:opacity-60"
      >
        {(Object.keys(LABELS) as SortMode[]).map((k) => (
          <option key={k} value={k}>
            {LABELS[k]}
          </option>
        ))}
      </select>
    </label>
  );
}
