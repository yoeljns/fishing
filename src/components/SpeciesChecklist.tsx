"use client";

import { useDeferredValue, useMemo, useState, useTransition } from "react";
import type { SpeciesWithStats } from "@/lib/types";
import { SpeciesRow } from "./SpeciesRow";

type Filter = "all" | "caught" | "not_caught";

type Props = {
  species: SpeciesWithStats[];
  waterTypes: string[];
  regions: string[];
};

export function SpeciesChecklist({ species, waterTypes, regions }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [waterType, setWaterType] = useState<string | "any">("any");
  const [selectedRegions, setSelectedRegions] = useState<Set<string>>(
    new Set(),
  );
  const [, startTransition] = useTransition();

  const deferredSearch = useDeferredValue(search);
  const deferredFilter = useDeferredValue(filter);
  const deferredWaterType = useDeferredValue(waterType);
  const deferredRegions = useDeferredValue(selectedRegions);

  const toggleRegion = (r: string) => {
    startTransition(() => {
      setSelectedRegions((prev) => {
        const next = new Set(prev);
        if (next.has(r)) next.delete(r);
        else next.add(r);
        return next;
      });
    });
  };

  const setFilterT = (f: Filter) => startTransition(() => setFilter(f));
  const setWaterTypeT = (w: string | "any") =>
    startTransition(() => setWaterType(w));

  const filtered = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase();
    return species.filter((s) => {
      if (q) {
        const inName = s.common_name.toLowerCase().includes(q);
        const inAlias = s.aliases.some((a) => a.toLowerCase().includes(q));
        const inSci = s.scientific_name?.toLowerCase().includes(q) ?? false;
        if (!inName && !inAlias && !inSci) return false;
      }
      if (deferredFilter === "caught" && s.catch_count === 0) return false;
      if (deferredFilter === "not_caught" && s.catch_count > 0) return false;
      if (deferredWaterType !== "any" && s.water_type !== deferredWaterType)
        return false;
      if (deferredRegions.size > 0) {
        const matches = s.regions.some((r) => deferredRegions.has(r));
        if (!matches) return false;
      }
      return true;
    });
  }, [species, deferredSearch, deferredFilter, deferredWaterType, deferredRegions]);

  const showingStale =
    deferredSearch !== search ||
    deferredFilter !== filter ||
    deferredWaterType !== waterType ||
    deferredRegions !== selectedRegions;

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3 shadow-sm">
        <div className="relative">
          <SearchIcon />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, alias, or scientific…"
            aria-label="Search species"
            className="w-full pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors duration-150"
          />
        </div>

        <ChipGroup label="Show">
          {(["all", "caught", "not_caught"] as Filter[]).map((f) => (
            <Chip
              key={f}
              active={filter === f}
              onClick={() => setFilterT(f)}
              label={f === "all" ? "All" : f === "caught" ? "Caught" : "Not caught"}
            />
          ))}
        </ChipGroup>

        <ChipGroup label="Water">
          <Chip
            active={waterType === "any"}
            onClick={() => setWaterTypeT("any")}
            label="Any"
          />
          {waterTypes.map((w) => (
            <Chip
              key={w}
              active={waterType === w}
              onClick={() => setWaterTypeT(w)}
              label={w}
            />
          ))}
        </ChipGroup>

        <ChipGroup label="Region">
          {regions.map((r) => (
            <Chip
              key={r}
              active={selectedRegions.has(r)}
              onClick={() => toggleRegion(r)}
              label={r}
            />
          ))}
          {selectedRegions.size > 0 ? (
            <button
              type="button"
              onClick={() => startTransition(() => setSelectedRegions(new Set()))}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 underline"
            >
              Clear
            </button>
          ) : null}
        </ChipGroup>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          Showing {filtered.length} of {species.length}
        </span>
        {showingStale ? <span className="italic">filtering…</span> : null}
      </div>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <ul
          className={`grid grid-cols-1 sm:grid-cols-2 gap-2 transition-opacity duration-150 ${
            showingStale ? "opacity-70" : ""
          }`}
        >
          {filtered.map((s) => (
            <SpeciesRow key={s.id} s={s} />
          ))}
        </ul>
      )}
    </div>
  );
}

function ChipGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex flex-wrap gap-2 items-center"
    >
      <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 shrink-0">
        {label}
      </span>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-2.5 py-1 text-xs rounded-md border transition-colors duration-150 ${
        active
          ? "bg-brand-600 text-white border-brand-600"
          : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500"
      }`}
    >
      {label}
    </button>
  );
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function EmptyState() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-8 text-center text-slate-600 dark:text-slate-400">
      <p className="text-base">No species match these filters.</p>
      <p className="text-xs mt-1">Try clearing a filter or broadening your search.</p>
    </div>
  );
}
