"use client";

import { useMemo, useState } from "react";
import type { SpeciesWithStats } from "@/lib/types";
import { formatLength, formatWeight } from "@/lib/units";
import { useUnits } from "./UnitToggle";

type Filter = "all" | "caught" | "not_caught";

type Props = {
  species: SpeciesWithStats[];
  waterTypes: string[];
  regions: string[];
};

export function SpeciesChecklist({ species, waterTypes, regions }: Props) {
  const units = useUnits();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [waterType, setWaterType] = useState<string | "any">("any");
  const [selectedRegions, setSelectedRegions] = useState<Set<string>>(
    new Set(),
  );

  const toggleRegion = (r: string) => {
    setSelectedRegions((prev) => {
      const next = new Set(prev);
      if (next.has(r)) next.delete(r);
      else next.add(r);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return species.filter((s) => {
      if (q) {
        const inName = s.common_name.toLowerCase().includes(q);
        const inAlias = s.aliases.some((a) => a.toLowerCase().includes(q));
        if (!inName && !inAlias) return false;
      }
      if (filter === "caught" && s.catch_count === 0) return false;
      if (filter === "not_caught" && s.catch_count > 0) return false;
      if (waterType !== "any" && s.water_type !== waterType) return false;
      if (selectedRegions.size > 0) {
        const matches = s.regions.some((r) => selectedRegions.has(r));
        if (!matches) return false;
      }
      return true;
    });
  }, [species, search, filter, waterType, selectedRegions]);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search species…"
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
        />

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs uppercase tracking-wide text-slate-500">
            Show
          </span>
          {(["all", "caught", "not_caught"] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-2 py-1 text-xs rounded-md border ${
                filter === f
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white text-slate-700 border-slate-300"
              }`}
            >
              {f === "all" ? "All" : f === "caught" ? "Caught" : "Not caught"}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs uppercase tracking-wide text-slate-500">
            Water
          </span>
          <button
            type="button"
            onClick={() => setWaterType("any")}
            className={`px-2 py-1 text-xs rounded-md border ${
              waterType === "any"
                ? "bg-brand-600 text-white border-brand-600"
                : "bg-white text-slate-700 border-slate-300"
            }`}
          >
            Any
          </button>
          {waterTypes.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setWaterType(w)}
              className={`px-2 py-1 text-xs rounded-md border ${
                waterType === w
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white text-slate-700 border-slate-300"
              }`}
            >
              {w}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs uppercase tracking-wide text-slate-500">
            Region
          </span>
          {regions.map((r) => {
            const on = selectedRegions.has(r);
            return (
              <button
                key={r}
                type="button"
                onClick={() => toggleRegion(r)}
                className={`px-2 py-1 text-xs rounded-md border ${
                  on
                    ? "bg-brand-600 text-white border-brand-600"
                    : "bg-white text-slate-700 border-slate-300"
                }`}
              >
                {r}
              </button>
            );
          })}
          {selectedRegions.size > 0 ? (
            <button
              type="button"
              onClick={() => setSelectedRegions(new Set())}
              className="text-xs text-slate-500 hover:text-slate-700 underline"
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-600">
          No species match these filters.
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filtered.map((s) => {
            const caught = s.catch_count > 0;
            return (
              <li
                key={s.id}
                className={`border rounded-lg p-3 flex items-start justify-between gap-3 ${
                  caught
                    ? "bg-brand-50 border-brand-500"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block w-5 h-5 rounded border text-center text-xs leading-5 ${
                        caught
                          ? "bg-brand-600 border-brand-600 text-white"
                          : "border-slate-300"
                      }`}
                      aria-hidden
                    >
                      {caught ? "✓" : ""}
                    </span>
                    <h3 className="font-medium truncate">{s.common_name}</h3>
                  </div>
                  {s.scientific_name ? (
                    <p className="text-xs italic text-slate-500 ml-7">
                      {s.scientific_name}
                    </p>
                  ) : null}
                  {s.aliases.length > 0 ? (
                    <p className="text-xs text-slate-500 ml-7 mt-1">
                      Also: {s.aliases.join(", ")}
                    </p>
                  ) : null}
                  <p className="text-xs text-slate-500 ml-7 mt-1">
                    {s.water_type}
                    {s.regions.length > 0 ? ` · ${s.regions.join(", ")}` : ""}
                  </p>
                  {caught ? (
                    <p className="text-xs text-brand-700 ml-7 mt-1">
                      Caught {s.catch_count}×
                      {s.max_length_cm != null
                        ? ` · best ${formatLength(s.max_length_cm, units)}`
                        : ""}
                      {s.max_weight_kg != null
                        ? ` / ${formatWeight(s.max_weight_kg, units)}`
                        : ""}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500 ml-7 mt-1">
                      Not caught yet
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
