"use client";

import { useMemo, useState } from "react";
import type { CatchRow, Species } from "@/lib/types";
import { cmToIn, kgToLb } from "@/lib/units";
import { useUnits } from "./UnitToggle";

type Props = {
  species: Species[];
  action: (formData: FormData) => void | Promise<void>;
  initial?: CatchRow;
};

function todayISO(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export function CatchForm({ species, action, initial }: Props) {
  const preferredUnits = useUnits();
  const initialLengthUnit = preferredUnits === "imperial" ? "in" : "cm";
  const initialWeightUnit = preferredUnits === "imperial" ? "lb" : "kg";

  const [lengthUnit, setLengthUnit] = useState<"cm" | "in">(initialLengthUnit);
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">(initialWeightUnit);
  const [speciesQuery, setSpeciesQuery] = useState(
    initial?.species_name_snapshot ?? "",
  );

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
    <form action={action} className="space-y-5 bg-white border border-slate-200 rounded-lg p-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Species
        </label>
        <input
          type="text"
          name="species_name"
          required
          list="species-list"
          autoComplete="off"
          value={speciesQuery}
          onChange={(e) => setSpeciesQuery(e.target.value)}
          placeholder="Start typing… or enter a custom species"
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <datalist id="species-list">
          {filteredEntries.map((e, i) => (
            <option key={`${e.value}-${i}`} value={e.value} label={e.label} />
          ))}
        </datalist>
        {!exactMatch && speciesQuery.trim().length > 0 ? (
          <p className="text-xs text-slate-500 mt-1">
            Not in the list — will be saved as a custom species.
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Length
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.1"
              min="0"
              name="length_value"
              defaultValue={initialLengthValue}
              placeholder="e.g. 42"
              className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <select
              name="length_unit"
              value={lengthUnit}
              onChange={(e) => setLengthUnit(e.target.value as "cm" | "in")}
              className="px-2 py-2 border border-slate-300 rounded-md bg-white"
            >
              <option value="cm">cm</option>
              <option value="in">in</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Weight
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              min="0"
              name="weight_value"
              defaultValue={initialWeightValue}
              placeholder="e.g. 0.8"
              className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <select
              name="weight_unit"
              value={weightUnit}
              onChange={(e) => setWeightUnit(e.target.value as "kg" | "lb")}
              className="px-2 py-2 border border-slate-300 rounded-md bg-white"
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Date
          </label>
          <input
            type="date"
            name="caught_on"
            required
            defaultValue={initial?.caught_on ?? todayISO()}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            defaultValue={initial?.location ?? ""}
            placeholder="River, lake, beach…"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Bait / lure
        </label>
        <input
          type="text"
          name="bait"
          defaultValue={initial?.bait ?? ""}
          placeholder="Worm, spinner, fly pattern…"
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Notes
        </label>
        <textarea
          name="notes"
          rows={3}
          defaultValue={initial?.notes ?? ""}
          placeholder="Weather, conditions, technique…"
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-md"
        >
          {initial ? "Save changes" : "Log catch"}
        </button>
      </div>
    </form>
  );
}
