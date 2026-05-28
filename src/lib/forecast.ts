export type HourSample = {
  iso: string;
  hour: number;
  temperature_c: number;
  wind_kmh: number;
  pressure_hpa: number;
  cloud_cover_pct: number;
  is_day: boolean;
};

export type DailyMeta = {
  date: string;
  sunrise: string;
  sunset: string;
  moon_phase: number; // 0..1, 0 = new, 0.5 = full
};

export type ScoredHour = HourSample & {
  score: number; // 0..100
  breakdown: {
    pressure: number;
    wind: number;
    moon: number;
    time_of_day: number;
    cloud: number;
  };
};

export type Forecast = {
  lat: number;
  lon: number;
  timezone: string;
  hours: HourSample[];
  daily: DailyMeta[];
  generated_at: string;
};

type OpenMeteoResponse = {
  timezone: string;
  hourly: {
    time: string[];
    temperature_2m: number[];
    wind_speed_10m: number[];
    pressure_msl: number[];
    cloud_cover: number[];
    is_day: number[];
  };
  daily: {
    time: string[];
    sunrise: string[];
    sunset: string[];
  };
};

function moonPhaseFor(date: Date): number {
  const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14, 0);
  const synodic = 29.530588853;
  const diffDays = (date.getTime() - knownNewMoon) / (1000 * 60 * 60 * 24);
  const phase = ((diffDays % synodic) + synodic) % synodic;
  return phase / synodic;
}

export async function fetchForecast(
  lat: number,
  lon: number,
): Promise<Forecast | null> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    hourly:
      "temperature_2m,wind_speed_10m,pressure_msl,cloud_cover,is_day",
    daily: "sunrise,sunset",
    forecast_days: "7",
    wind_speed_unit: "kmh",
    timezone: "auto",
  });
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
      { next: { revalidate: 60 * 30 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as OpenMeteoResponse;
    const hours: HourSample[] = data.hourly.time.map((iso, i) => {
      const d = new Date(iso);
      return {
        iso,
        hour: d.getHours(),
        temperature_c: data.hourly.temperature_2m[i],
        wind_kmh: data.hourly.wind_speed_10m[i],
        pressure_hpa: data.hourly.pressure_msl[i],
        cloud_cover_pct: data.hourly.cloud_cover[i],
        is_day: data.hourly.is_day[i] === 1,
      };
    });
    const daily: DailyMeta[] = data.daily.time.map((date, i) => ({
      date,
      sunrise: data.daily.sunrise[i],
      sunset: data.daily.sunset[i],
      moon_phase: moonPhaseFor(new Date(date)),
    }));
    return {
      lat,
      lon,
      timezone: data.timezone,
      hours,
      daily,
      generated_at: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

function pressureTrend(hours: HourSample[], index: number): number {
  const lookback = 6;
  const start = Math.max(0, index - lookback);
  const prev = hours[start].pressure_hpa;
  const now = hours[index].pressure_hpa;
  return now - prev; // hPa change over the last ~6h
}

function timeOfDayBonus(hour: HourSample, day: DailyMeta | undefined): number {
  if (!day) return 50;
  const sunrise = new Date(day.sunrise).getHours();
  const sunset = new Date(day.sunset).getHours();
  const h = hour.hour;
  // Best: dawn (-1..+2 of sunrise) and dusk (-2..+1 of sunset)
  const dawnDist = Math.min(
    Math.abs(h - sunrise),
    Math.abs(h - sunrise + 24),
    Math.abs(h - sunrise - 24),
  );
  const duskDist = Math.min(
    Math.abs(h - sunset),
    Math.abs(h - sunset + 24),
    Math.abs(h - sunset - 24),
  );
  const dist = Math.min(dawnDist, duskDist);
  if (dist === 0) return 100;
  if (dist === 1) return 90;
  if (dist === 2) return 75;
  if (hour.is_day) return 55;
  return 40; // deep night
}

function moonBonus(phase: number): number {
  // Best near new (0) and full (0.5). Cosine peaks at both.
  const distance = Math.min(
    Math.abs(phase),
    Math.abs(phase - 0.5),
    Math.abs(phase - 1),
  );
  // distance 0 → 100, distance 0.25 → 40
  return Math.round(100 - distance * 240);
}

function pressureBonus(deltaHpa: number): number {
  // Slow steady fall (~-1 to -3 hPa over 6h) is best (~85-95)
  // Steady high or rising slowly (~0 to +1) is OK (~50-60)
  // Sharp drop (>-4) or sharp rise (>+3) bad
  if (deltaHpa <= -4) return 35;
  if (deltaHpa <= -1) return 90;
  if (deltaHpa <= 1) return 60;
  if (deltaHpa <= 3) return 45;
  return 30;
}

function windBonus(kmh: number): number {
  if (kmh <= 5) return 85;
  if (kmh <= 12) return 95;
  if (kmh <= 20) return 70;
  if (kmh <= 30) return 45;
  return 25;
}

function cloudBonus(pct: number): number {
  // Overcast or lightly cloudy = best
  if (pct >= 40 && pct <= 80) return 90;
  if (pct >= 20 && pct < 40) return 70;
  if (pct > 80) return 75;
  return 55;
}

export function scoreForecast(forecast: Forecast): ScoredHour[] {
  const dayMap = new Map(forecast.daily.map((d) => [d.date, d]));
  return forecast.hours.map((h, i) => {
    const dateStr = h.iso.slice(0, 10);
    const day = dayMap.get(dateStr);
    const trend = pressureTrend(forecast.hours, i);
    const p = pressureBonus(trend);
    const w = windBonus(h.wind_kmh);
    const m = day ? moonBonus(day.moon_phase) : 50;
    const t = timeOfDayBonus(h, day);
    const c = cloudBonus(h.cloud_cover_pct);
    const score = Math.round(
      p * 0.3 + w * 0.25 + m * 0.2 + t * 0.15 + c * 0.1,
    );
    return {
      ...h,
      score,
      breakdown: {
        pressure: p,
        wind: w,
        moon: m,
        time_of_day: t,
        cloud: c,
      },
    };
  });
}

export function scoreLabel(score: number): { label: string; tone: string } {
  if (score >= 80) return { label: "Excellent", tone: "excellent" };
  if (score >= 65) return { label: "Good", tone: "good" };
  if (score >= 50) return { label: "Fair", tone: "fair" };
  if (score >= 35) return { label: "Slow", tone: "slow" };
  return { label: "Poor", tone: "poor" };
}

export type DaySummary = {
  date: string;
  weekday: string;
  dayOfMonth: number;
  hours: ScoredHour[];
  peakScore: number;
  avgScore: number;
  bestWindow: { startIso: string; endIso: string; avgScore: number } | null;
  sunrise: string;
  sunset: string;
  moon_phase: number;
};

export function groupByDay(
  scored: ScoredHour[],
  daily: DailyMeta[],
): DaySummary[] {
  const map = new Map<string, ScoredHour[]>();
  for (const h of scored) {
    const dateKey = h.iso.slice(0, 10);
    const arr = map.get(dateKey);
    if (arr) arr.push(h);
    else map.set(dateKey, [h]);
  }
  const dayMeta = new Map(daily.map((d) => [d.date, d]));
  const out: DaySummary[] = [];
  for (const [date, hours] of map) {
    if (hours.length === 0) continue;
    const meta = dayMeta.get(date);
    const d = new Date(date + "T12:00:00");
    const peakScore = hours.reduce(
      (acc, h) => Math.max(acc, h.score),
      0,
    );
    const avgScore = Math.round(
      hours.reduce((acc, h) => acc + h.score, 0) / hours.length,
    );
    out.push({
      date,
      weekday: d.toLocaleDateString([], { weekday: "short" }),
      dayOfMonth: d.getDate(),
      hours,
      peakScore,
      avgScore,
      bestWindow: bestWindowFor(hours),
      sunrise: meta?.sunrise ?? "",
      sunset: meta?.sunset ?? "",
      moon_phase: meta?.moon_phase ?? 0.5,
    });
  }
  return out.sort((a, b) => (a.date < b.date ? -1 : 1));
}

function bestWindowFor(
  hours: ScoredHour[],
): DaySummary["bestWindow"] {
  if (hours.length < 3) return null;
  const window = 3;
  let bestStart = 0;
  let bestAvg = -1;
  for (let i = 0; i + window <= hours.length; i++) {
    let s = 0;
    for (let j = 0; j < window; j++) s += hours[i + j].score;
    const avg = s / window;
    if (avg > bestAvg) {
      bestAvg = avg;
      bestStart = i;
    }
  }
  return {
    startIso: hours[bestStart].iso,
    endIso: hours[bestStart + window - 1].iso,
    avgScore: Math.round(bestAvg),
  };
}
