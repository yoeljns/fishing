"use client";

import { useState } from "react";
import {
  type Forecast,
  type ScoredHour,
  scoreLabel,
} from "@/lib/forecast";

type Props = {
  forecast: Forecast;
  scored: ScoredHour[];
  timezone: string;
};

function toneColor(tone: string): string {
  switch (tone) {
    case "excellent":
      return "bg-emerald-500";
    case "good":
      return "bg-brand-500";
    case "fair":
      return "bg-amber-400";
    case "slow":
      return "bg-orange-400";
    default:
      return "bg-red-400";
  }
}

function toneText(tone: string): string {
  switch (tone) {
    case "excellent":
      return "text-emerald-700 dark:text-emerald-400";
    case "good":
      return "text-brand-700 dark:text-brand-400";
    case "fair":
      return "text-amber-600 dark:text-amber-400";
    case "slow":
      return "text-orange-600 dark:text-orange-400";
    default:
      return "text-red-600 dark:text-red-400";
  }
}

function moonName(phase: number): string {
  if (phase < 0.05 || phase > 0.95) return "New moon";
  if (phase < 0.2) return "Waxing crescent";
  if (phase < 0.3) return "First quarter";
  if (phase < 0.45) return "Waxing gibbous";
  if (phase < 0.55) return "Full moon";
  if (phase < 0.7) return "Waning gibbous";
  if (phase < 0.8) return "Last quarter";
  return "Waning crescent";
}

function findCurrentIndex(scored: ScoredHour[]): number {
  const now = Date.now();
  let best = 0;
  let bestDiff = Infinity;
  for (let i = 0; i < scored.length; i++) {
    const t = new Date(scored[i].iso).getTime();
    const diff = Math.abs(t - now);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = i;
    }
  }
  return best;
}

export function ForecastView({ forecast, scored }: Props) {
  const currentIndex = findCurrentIndex(scored);
  const current = scored[currentIndex];
  const next48 = scored.slice(currentIndex, currentIndex + 48);
  const currentLabel = scoreLabel(current.score);
  const today = forecast.daily[0];

  const [selected, setSelected] = useState<number>(currentIndex);
  const selectedHour = scored[selected];
  const selectedLabel = scoreLabel(selectedHour.score);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Right now
            </div>
            <div className="flex items-baseline gap-3 mt-1">
              <div className="text-5xl sm:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {current.score}
              </div>
              <div className={`text-lg font-semibold ${toneText(currentLabel.tone)}`}>
                {currentLabel.label}
              </div>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              {Math.round(current.temperature_c)}°C ·{" "}
              {Math.round(current.wind_kmh)} km/h wind ·{" "}
              {Math.round(current.pressure_hpa)} hPa
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {today ? moonName(today.moon_phase) : ""}
              {today ? (
                <>
                  {" · "}
                  Sunrise{" "}
                  {new Date(today.sunrise).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  · Sunset{" "}
                  {new Date(today.sunset).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </>
              ) : null}
            </div>
          </div>
          <ScoreDial score={current.score} tone={currentLabel.tone} />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3 gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Next 48 hours
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Tap a bar
          </span>
        </div>
        <div className="overflow-x-auto -mx-1 px-1 pb-2">
          <div className="flex items-end gap-1 min-w-max" role="list">
            {next48.map((h, idx) => {
              const realIdx = currentIndex + idx;
              const tone = scoreLabel(h.score).tone;
              const t = new Date(h.iso);
              const hour = t.getHours();
              const isSelected = realIdx === selected;
              const showHourLabel = hour % 6 === 0;
              return (
                <button
                  key={h.iso}
                  type="button"
                  onClick={() => setSelected(realIdx)}
                  aria-label={`Score ${h.score} at ${t.toLocaleString()}`}
                  className={`flex flex-col items-center gap-1 transition-transform duration-100 ${
                    isSelected ? "scale-110" : ""
                  }`}
                >
                  <div
                    className={`w-3 sm:w-4 rounded-sm ${toneColor(tone)} ${
                      isSelected
                        ? "ring-2 ring-slate-900 dark:ring-white"
                        : "opacity-90 hover:opacity-100"
                    }`}
                    style={{ height: `${Math.max(6, h.score * 0.9)}px` }}
                  />
                  <span
                    className={`text-[10px] tabular-nums ${
                      showHourLabel
                        ? "text-slate-600 dark:text-slate-400"
                        : "text-transparent"
                    }`}
                  >
                    {hour}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <div className="text-slate-500 dark:text-slate-400">When</div>
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {new Date(selectedHour.iso).toLocaleString([], {
                weekday: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
          <div>
            <div className="text-slate-500 dark:text-slate-400">Score</div>
            <div className={`text-sm font-medium ${toneText(selectedLabel.tone)}`}>
              {selectedHour.score} · {selectedLabel.label}
            </div>
          </div>
          <div>
            <div className="text-slate-500 dark:text-slate-400">Wind</div>
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {Math.round(selectedHour.wind_kmh)} km/h
            </div>
          </div>
          <div>
            <div className="text-slate-500 dark:text-slate-400">Pressure</div>
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {Math.round(selectedHour.pressure_hpa)} hPa
            </div>
          </div>
        </div>
        <BreakdownBars breakdown={selectedHour.breakdown} />
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
        Weather data from Open-Meteo · scored locally from pressure trend, wind,
        moon phase, time of day, and cloud cover.
      </p>
    </div>
  );
}

function ScoreDial({ score, tone }: { score: number; tone: string }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c - (c * score) / 100;
  const color =
    tone === "excellent"
      ? "#10b981"
      : tone === "good"
        ? "#0d9488"
        : tone === "fair"
          ? "#f59e0b"
          : tone === "slow"
            ? "#fb923c"
            : "#ef4444";
  return (
    <svg
      width="92"
      height="92"
      viewBox="0 0 92 92"
      className="shrink-0"
      aria-hidden
    >
      <circle
        cx="46"
        cy="46"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.1"
        strokeWidth="8"
      />
      <circle
        cx="46"
        cy="46"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform="rotate(-90 46 46)"
        style={{ transition: "stroke-dashoffset 400ms" }}
      />
    </svg>
  );
}

function BreakdownBars({
  breakdown,
}: {
  breakdown: ScoredHour["breakdown"];
}) {
  const rows = [
    { label: "Pressure trend", value: breakdown.pressure, weight: "30%" },
    { label: "Wind", value: breakdown.wind, weight: "25%" },
    { label: "Moon phase", value: breakdown.moon, weight: "20%" },
    { label: "Time of day", value: breakdown.time_of_day, weight: "15%" },
    { label: "Cloud cover", value: breakdown.cloud, weight: "10%" },
  ];
  return (
    <details className="mt-3 group">
      <summary className="text-xs text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 select-none">
        Why this score
      </summary>
      <div className="mt-2 space-y-1.5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-2 text-xs">
            <div className="w-28 sm:w-32 text-slate-600 dark:text-slate-400 shrink-0">
              {r.label}
              <span className="text-slate-400 dark:text-slate-500 ml-1">
                ({r.weight})
              </span>
            </div>
            <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500"
                style={{ width: `${r.value}%` }}
              />
            </div>
            <div className="w-8 text-right tabular-nums text-slate-700 dark:text-slate-300">
              {r.value}
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}
