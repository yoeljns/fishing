"use client";

import { useMemo, useState } from "react";
import {
  type Forecast,
  type ScoredHour,
  type DaySummary,
  groupByDay,
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

function formatHour(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ForecastView({ forecast, scored }: Props) {
  const days = useMemo(
    () => groupByDay(scored, forecast.daily),
    [scored, forecast.daily],
  );

  const today = days[0];
  const currentIndex = findCurrentIndex(scored);
  const current = scored[currentIndex];
  const currentLabel = scoreLabel(current.score);

  const todayKey = today?.date ?? scored[0].iso.slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<string>(todayKey);
  const selectedDay = days.find((d) => d.date === selectedDate) ?? today;
  const isToday = selectedDay?.date === todayKey;

  const [selectedHourIso, setSelectedHourIso] = useState<string>(
    isToday ? current.iso : selectedDay?.hours[10]?.iso ?? current.iso,
  );
  const selectedHour =
    selectedDay?.hours.find((h) => h.iso === selectedHourIso) ??
    selectedDay?.hours[0] ??
    current;
  const selectedLabel = scoreLabel(selectedHour.score);

  const onPickDay = (date: string) => {
    setSelectedDate(date);
    const day = days.find((d) => d.date === date);
    if (!day) return;
    if (date === todayKey) {
      setSelectedHourIso(current.iso);
    } else if (day.bestWindow) {
      setSelectedHourIso(day.bestWindow.startIso);
    } else {
      setSelectedHourIso(day.hours[10]?.iso ?? day.hours[0].iso);
    }
  };

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
            {today ? (
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {moonName(today.moon_phase)} · Sunrise{" "}
                {formatHour(today.sunrise)} · Sunset {formatHour(today.sunset)}
              </div>
            ) : null}
          </div>
          <ScoreDial score={current.score} tone={currentLabel.tone} />
        </div>
      </div>

      <DayStrip
        days={days}
        selectedDate={selectedDate}
        todayKey={todayKey}
        onPick={onPickDay}
      />

      {selectedDay ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1 gap-3 flex-wrap">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {selectedDay.weekday},{" "}
                {new Date(selectedDay.date + "T12:00:00").toLocaleDateString(
                  [],
                  { month: "short", day: "numeric" },
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Peak{" "}
                <span
                  className={`font-semibold ${
                    toneText(scoreLabel(selectedDay.peakScore).tone)
                  }`}
                >
                  {selectedDay.peakScore}
                </span>{" "}
                · Avg {selectedDay.avgScore}
                {selectedDay.bestWindow ? (
                  <>
                    {" · Best "}
                    {formatHour(selectedDay.bestWindow.startIso)}–
                    {formatHour(selectedDay.bestWindow.endIso)}
                  </>
                ) : null}
              </p>
              {selectedDay.sunrise && selectedDay.sunset ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {moonName(selectedDay.moon_phase)} · Sunrise{" "}
                  {formatHour(selectedDay.sunrise)} · Sunset{" "}
                  {formatHour(selectedDay.sunset)}
                </p>
              ) : null}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Tap a bar
            </span>
          </div>

          <HourChart
            hours={selectedDay.hours}
            selectedIso={selectedHourIso}
            onSelect={setSelectedHourIso}
            sunrise={selectedDay.sunrise}
            sunset={selectedDay.sunset}
          />

          <HourDetail hour={selectedHour} />
        </div>
      ) : null}

      <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
        Weather from Open-Meteo · scored locally from pressure trend, wind,
        moon phase, time of day, and cloud cover.
      </p>
    </div>
  );
}

function DayStrip({
  days,
  selectedDate,
  todayKey,
  onPick,
}: {
  days: DaySummary[];
  selectedDate: string;
  todayKey: string;
  onPick: (date: string) => void;
}) {
  return (
    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-2 min-w-max pb-1">
        {days.map((d) => {
          const isSelected = d.date === selectedDate;
          const isToday = d.date === todayKey;
          const tone = scoreLabel(d.peakScore).tone;
          return (
            <button
              key={d.date}
              type="button"
              onClick={() => onPick(d.date)}
              aria-pressed={isSelected}
              className={`shrink-0 rounded-xl p-3 text-left transition-all duration-150 border min-w-[88px] ${
                isSelected
                  ? "bg-brand-600 text-white border-brand-600 shadow-md"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-brand-500"
              }`}
            >
              <div
                className={`text-[10px] uppercase tracking-wider ${
                  isSelected
                    ? "text-brand-100"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {isToday ? "Today" : d.weekday}
              </div>
              <div
                className={`text-xl font-bold tabular-nums ${
                  isSelected ? "text-white" : "text-slate-900 dark:text-slate-100"
                }`}
              >
                {d.dayOfMonth}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${toneColor(tone)}`}
                  aria-hidden
                />
                <span
                  className={`text-xs font-medium ${
                    isSelected
                      ? "text-white"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {d.peakScore}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function HourChart({
  hours,
  selectedIso,
  onSelect,
  sunrise,
  sunset,
}: {
  hours: ScoredHour[];
  selectedIso: string;
  onSelect: (iso: string) => void;
  sunrise?: string;
  sunset?: string;
}) {
  const sunriseHour = sunrise ? new Date(sunrise).getHours() : -1;
  const sunsetHour = sunset ? new Date(sunset).getHours() : -1;
  return (
    <div className="overflow-x-auto -mx-1 px-1 pb-2 mt-3">
      <div className="flex items-end gap-1 min-w-max" role="list">
        {hours.map((h) => {
          const tone = scoreLabel(h.score).tone;
          const t = new Date(h.iso);
          const hour = t.getHours();
          const isSelected = h.iso === selectedIso;
          const showHourLabel = hour % 3 === 0;
          const isSunrise = hour === sunriseHour;
          const isSunset = hour === sunsetHour;
          return (
            <button
              key={h.iso}
              type="button"
              onClick={() => onSelect(h.iso)}
              aria-label={`Score ${h.score} at ${t.toLocaleString()}`}
              className={`flex flex-col items-center gap-1 transition-transform duration-100 ${
                isSelected ? "scale-110" : ""
              }`}
            >
              <div className="text-[9px] h-3 leading-3">
                {isSunrise ? "☀" : isSunset ? "🌙" : ""}
              </div>
              <div
                className={`w-3.5 sm:w-4 rounded-sm ${toneColor(tone)} ${
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
  );
}

function HourDetail({ hour }: { hour: ScoredHour }) {
  const label = scoreLabel(hour.score);
  const rows = [
    { label: "Pressure trend", value: hour.breakdown.pressure, weight: "30%" },
    { label: "Wind", value: hour.breakdown.wind, weight: "25%" },
    { label: "Moon phase", value: hour.breakdown.moon, weight: "20%" },
    { label: "Time of day", value: hour.breakdown.time_of_day, weight: "15%" },
    { label: "Cloud cover", value: hour.breakdown.cloud, weight: "10%" },
  ];
  return (
    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <div className="text-slate-500 dark:text-slate-400">When</div>
          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
            {new Date(hour.iso).toLocaleString([], {
              weekday: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
        <div>
          <div className="text-slate-500 dark:text-slate-400">Score</div>
          <div className={`text-sm font-medium ${toneText(label.tone)}`}>
            {hour.score} · {label.label}
          </div>
        </div>
        <div>
          <div className="text-slate-500 dark:text-slate-400">Wind</div>
          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
            {Math.round(hour.wind_kmh)} km/h
          </div>
        </div>
        <div>
          <div className="text-slate-500 dark:text-slate-400">Pressure</div>
          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
            {Math.round(hour.pressure_hpa)} hPa
          </div>
        </div>
      </div>
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
