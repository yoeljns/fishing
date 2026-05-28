"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { MapPicker } from "./MapPicker";

type Props = {
  lat: number;
  lon: number;
};

export function ForecastMap({ lat, lon }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [, startTransition] = useTransition();
  const [pendingCoords, setPendingCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  const onPick = (newLat: number, newLon: number) => {
    setPendingCoords({ lat: newLat, lon: newLon });
  };

  const applyPending = () => {
    if (!pendingCoords) return;
    setPending(true);
    startTransition(() => {
      router.replace(
        `/forecast?lat=${pendingCoords.lat.toFixed(4)}&lon=${pendingCoords.lon.toFixed(4)}`,
      );
      setPending(false);
    });
  };

  const cancelPending = () => setPendingCoords(null);

  const showLat = pendingCoords?.lat ?? lat;
  const showLon = pendingCoords?.lon ?? lon;

  return (
    <div className="space-y-2">
      <MapPicker
        lat={showLat}
        lon={showLon}
        zoom={11}
        onChange={onPick}
        height={300}
      />
      {pendingCoords ? (
        <div className="flex items-center justify-between gap-3 flex-wrap p-3 rounded-lg border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-900/30 text-sm">
          <span className="text-brand-800 dark:text-brand-200">
            New spot: {pendingCoords.lat.toFixed(4)}°,{" "}
            {pendingCoords.lon.toFixed(4)}°
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={cancelPending}
              className="text-sm px-2 py-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={applyPending}
              disabled={pending}
              className="text-sm px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-md font-medium disabled:opacity-60"
            >
              {pending ? "Loading…" : "Use this spot"}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-500 dark:text-slate-400 px-1">
          Tap anywhere on the map (or drag the pin) to move the spot.
        </p>
      )}
    </div>
  );
}
