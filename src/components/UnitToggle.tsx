"use client";

import { useEffect, useState } from "react";
import type { UnitSystem } from "@/lib/units";

const STORAGE_KEY = "fj_units";

export function getStoredUnits(): UnitSystem {
  if (typeof window === "undefined") return "metric";
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "imperial" ? "imperial" : "metric";
}

export function setStoredUnits(system: UnitSystem): void {
  window.localStorage.setItem(STORAGE_KEY, system);
  window.dispatchEvent(new CustomEvent("fj-units-change", { detail: system }));
}

export function useUnits(): UnitSystem {
  const [units, setUnits] = useState<UnitSystem>("metric");
  useEffect(() => {
    setUnits(getStoredUnits());
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<UnitSystem>).detail;
      if (detail === "metric" || detail === "imperial") setUnits(detail);
    };
    window.addEventListener("fj-units-change", handler);
    return () => window.removeEventListener("fj-units-change", handler);
  }, []);
  return units;
}

export function UnitToggle() {
  const units = useUnits();
  return (
    <div className="inline-flex rounded-md border border-slate-300 bg-white text-xs overflow-hidden">
      <button
        type="button"
        onClick={() => setStoredUnits("metric")}
        className={`px-2 py-1 ${units === "metric" ? "bg-brand-600 text-white" : "text-slate-700"}`}
        aria-pressed={units === "metric"}
      >
        cm / kg
      </button>
      <button
        type="button"
        onClick={() => setStoredUnits("imperial")}
        className={`px-2 py-1 ${units === "imperial" ? "bg-brand-600 text-white" : "text-slate-700"}`}
        aria-pressed={units === "imperial"}
      >
        in / lb
      </button>
    </div>
  );
}
