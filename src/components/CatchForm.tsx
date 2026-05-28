"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import type { CatchRow, Species } from "@/lib/types";
import { cmToIn, kgToLb } from "@/lib/units";
import { useUnits } from "./UnitToggle";
import { reverseGeocodeAction } from "@/app/catches/geo-actions";
import { showToast } from "./Toast";

type Props = {
  species: Species[];
  action: (formData: FormData) => void | Promise<void>;
  initial?: CatchRow;
};

function todayISO(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function formatCoord(value: number, kind: "lat" | "lon"): string {
  const abs = Math.abs(value).toFixed(4);
  const dir =
    kind === "lat"
      ? value >= 0
        ? "N"
        : "S"
      : value >= 0
        ? "E"
        : "W";
  return `${abs}° ${dir}`;
}

const inputClass =
  "w-full px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors duration-150";

const selectClass =
  "px-2 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 rounded-md transition-colors duration-150";

const labelClass =
  "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

export function CatchForm({ species, action, initial }: Props) {
  const preferredUnits = useUnits();
  const initialLengthUnit = preferredUnits === "imperial" ? "in" : "cm";
  const initialWeightUnit = preferredUnits === "imperial" ? "lb" : "kg";

  const [lengthUnit, setLengthUnit] = useState<"cm" | "in">(initialLengthUnit);
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">(initialWeightUnit);
  const [speciesQuery, setSpeciesQuery] = useState(
    initial?.species_name_snapshot ?? "",
  );

  const [location, setLocation] = useState(initial?.location ?? "");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    initial?.latitude != null && initial?.longitude != null
      ? { lat: Number(initial.latitude), lon: Number(initial.longitude) }
      : null,
  );
  const [geoState, setGeoState] = useState<"idle" | "locating" | "naming">(
    "idle",
  );
  const [, startTransition] = useTransition();
  const manualCoordsRef = useRef(false);

  const useMyLocation = () => {
    if (!("geolocation" in navigator)) {
      showToast("Geolocation isn't available on this device", "error");
      return;
    }
    setGeoState("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lon: longitude });
        setGeoState("naming");
        startTransition(async () => {
          const result = await reverseGeocodeAction(latitude, longitude);
          if (result?.short_name && !manualCoordsRef.current) {
            setLocation(result.short_name);
          }
          setGeoState("idle");
        });
      },
      (err) => {
        setGeoState("idle");
        if (err.code === err.PERMISSION_DENIED) {
          showToast("Location access denied", "error");
        } else {
          showToast("Couldn't get your location", "error");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  const clearCoords = () => {
    setCoords(null);
    manualCoordsRef.current = false;
  };

  const initialLengthValue = useMemo(() => {
    if (initial?.length_cm == null) return "";
    return (
      initialLengthUnit === "in"
        ? cmToIn(Number(initial.length_cm))
        : Number(initial.length_cm)
    ).toFixed(1);
  }, [initial, initialLengthUnit]);

  const initialWeightValue = useMemo(() => {
    if (initial?.weight_kg == null) return "";
    return (
      initialWeightUnit === "lb"
        ? kgToLb(Number(initial.weight_kg))
        : Number(initial.weight_kg)
    ).toFixed(2);
  }, [initial, initialWeightUnit]);

  type PickerEntry = { value: string; label: string };

  const allEntries = useMemo<PickerEntry[]>(() => {
    const out: PickerEntry[] = [];
    for (const s of species) {
      out.push({ value: s.common_name, label: s.common_name });
      for (const a of s.aliases) {
        out.push({ value: a, label: `${a} — ${s.common_name}` });
      }
    }
    return out;
  }, [species]);

  const filteredEntries = useMemo(() => {
    const q = speciesQuery.trim().toLowerCase();
    if (!q) return allEntries.slice(0, 10);
    return allEntries
      .filter((e) => e.value.toLowerCase().includes(q))
      .slice(0, 10);
  }, [allEntries, speciesQuery]);

  const exactMatch = allEntries.some(
    (e) => e.value.toLowerCase() === speciesQuery.trim().toLowerCase(),
  );

  return (
    <form
      action={action}
      className="space-y-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm"
    >
      <div>
        <label className={labelClass} htmlFor="species_name">
          Species
        </label>
        <input
          id="species_name"
          type="text"
          name="species_name"
          required
          list="species-list"
          autoComplete="off"
          value={speciesQuery}
          onChange={(e) => setSpeciesQuery(e.target.value)}
          placeholder="Start typing… or enter a custom species"
          className={inputClass}
        />
        <datalist id="species-list">
          {filteredEntries.map((e, i) => (
            <option key={`${e.value}-${i}`} value={e.value} label={e.label} />
          ))}
        </datalist>
        {!exactMatch && speciesQuery.trim().length > 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Not in the list — will be saved as a custom species.
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="length_value">
            Length
          </label>
          <div className="flex gap-2">
            <input
              id="length_value"
              type="number"
              step="0.1"
              min="0"
              name="length_value"
              defaultValue={initialLengthValue}
              placeholder="e.g. 42"
              className={`flex-1 ${inputClass}`}
            />
            <select
              name="length_unit"
              value={lengthUnit}
              onChange={(e) => setLengthUnit(e.target.value as "cm" | "in")}
              className={selectClass}
              aria-label="Length unit"
            >
              <option value="cm">cm</option>
              <option value="in">in</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="weight_value">
            Weight
          </label>
          <div className="flex gap-2">
            <input
              id="weight_value"
              type="number"
              step="0.01"
              min="0"
              name="weight_value"
              defaultValue={initialWeightValue}
              placeholder="e.g. 0.8"
              className={`flex-1 ${inputClass}`}
            />
            <select
              name="weight_unit"
              value={weightUnit}
              onChange={(e) => setWeightUnit(e.target.value as "kg" | "lb")}
              className={selectClass}
              aria-label="Weight unit"
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="caught_on">
          Date
        </label>
        <input
          id="caught_on"
          type="date"
          name="caught_on"
          required
          defaultValue={initial?.caught_on ?? todayISO()}
          className={`sm:max-w-xs ${inputClass}`}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="location">
          Location
        </label>
        <div className="flex gap-2">
          <input
            id="location"
            type="text"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="River, lake, beach…"
            className={`flex-1 ${inputClass}`}
          />
          <button
            type="button"
            onClick={useMyLocation}
            disabled={geoState !== "idle"}
            className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-200 hover:border-brand-500 transition-colors duration-150 disabled:opacity-60 flex items-center gap-1.5"
            aria-label="Use my current location"
          >
            <PinIcon />
            <span className="hidden sm:inline">
              {geoState === "locating"
                ? "Locating…"
                : geoState === "naming"
                  ? "Naming…"
                  : "Use my location"}
            </span>
          </button>
        </div>

        {coords ? (
          <div className="mt-2 flex items-center gap-2 flex-wrap text-xs">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              <PinIcon small />
              {formatCoord(coords.lat, "lat")} ·{" "}
              {formatCoord(coords.lon, "lon")}
            </span>
            <a
              href={`https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lon}#map=14/${coords.lat}/${coords.lon}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-700 dark:text-brand-400 hover:underline"
            >
              View on map →
            </a>
            <button
              type="button"
              onClick={clearCoords}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              Clear
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tap{" "}
            <span className="inline-flex items-center gap-1 text-brand-700 dark:text-brand-400">
              <PinIcon small />
              Use my location
            </span>{" "}
            to attach GPS coordinates and auto-name the spot.
          </p>
        )}

        <input
          type="hidden"
          name="latitude"
          value={coords?.lat.toFixed(6) ?? ""}
        />
        <input
          type="hidden"
          name="longitude"
          value={coords?.lon.toFixed(6) ?? ""}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="bait">
          Bait / lure
        </label>
        <input
          id="bait"
          type="text"
          name="bait"
          defaultValue={initial?.bait ?? ""}
          placeholder="Worm, spinner, fly pattern…"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="notes">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={initial?.notes ?? ""}
          placeholder="Weather, conditions, technique…"
          className={inputClass}
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-medium rounded-md transition-colors duration-150 shadow-sm hover:shadow"
        >
          {initial ? "Save changes" : "Log catch"}
        </button>
      </div>
    </form>
  );
}

function PinIcon({ small }: { small?: boolean }) {
  const size = small ? 12 : 14;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
