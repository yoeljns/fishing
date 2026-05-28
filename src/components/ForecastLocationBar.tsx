"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  forwardGeocodeMultiAction,
} from "@/app/forecast/actions";
import type { GeocodeCandidate } from "@/lib/geo";
import { showToast } from "./Toast";

type Props = {
  initialLat?: number;
  initialLon?: number;
};

export function ForecastLocationBar({ initialLat, initialLon }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [, startTransition] = useTransition();
  const [busy, setBusy] = useState<"idle" | "search" | "geo">("idle");
  const [results, setResults] = useState<GeocodeCandidate[]>([]);
  const [open, setOpen] = useState(false);

  const goTo = (lat: number, lon: number) => {
    setOpen(false);
    setResults([]);
    startTransition(() => {
      router.replace(`/forecast?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`);
    });
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 2) return;
    setBusy("search");
    startTransition(async () => {
      const list = await forwardGeocodeMultiAction(q);
      setBusy("idle");
      if (list.length === 0) {
        showToast("No places matched that search", "error");
        setResults([]);
        setOpen(false);
        return;
      }
      setResults(list);
      setOpen(true);
    });
  };

  const useMyLocation = () => {
    if (!("geolocation" in navigator)) {
      showToast("Geolocation isn't available on this device", "error");
      return;
    }
    setBusy("geo");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setBusy("idle");
        goTo(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setBusy("idle");
        if (err.code === err.PERMISSION_DENIED) {
          showToast("Location access denied", "error");
        } else {
          showToast("Couldn't get your location", "error");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-sm">
      <form onSubmit={onSearch} className="flex gap-2 flex-wrap">
        <input
          type="search"
          placeholder="Lake, beach, place… (e.g. 'Hecla Island Manitoba')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 min-w-[150px] px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
          aria-label="Search location"
        />
        <button
          type="submit"
          disabled={busy !== "idle"}
          className="px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-md transition-colors duration-150 disabled:opacity-60"
        >
          {busy === "search" ? "Searching…" : "Search"}
        </button>
        <button
          type="button"
          onClick={useMyLocation}
          disabled={busy !== "idle"}
          className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-200 hover:border-brand-500 transition-colors duration-150 disabled:opacity-60"
        >
          {busy === "geo" ? "Locating…" : "Use my location"}
        </button>
      </form>

      {open && results.length > 0 ? (
        <ul className="mt-3 border border-slate-200 dark:border-slate-800 rounded-md divide-y divide-slate-200 dark:divide-slate-800 max-h-72 overflow-y-auto bg-white dark:bg-slate-900">
          {results.map((r, i) => (
            <li key={`${r.lat}-${r.lon}-${i}`}>
              <button
                type="button"
                onClick={() => goTo(r.lat, r.lon)}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-150"
              >
                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {r.short_name}
                  {r.type ? (
                    <span className="ml-2 text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      {r.type.replace(/_/g, " ")}
                    </span>
                  ) : null}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {r.display_name}
                </div>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {initialLat != null && initialLon != null ? (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Tap the map below to fine-tune the spot.
        </p>
      ) : null}
    </div>
  );
}
