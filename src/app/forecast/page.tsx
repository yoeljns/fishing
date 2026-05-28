import { listCatches } from "@/lib/catches";
import { listSpeciesWithStats } from "@/lib/species";
import { fetchForecast, scoreForecast } from "@/lib/forecast";
import { regionFromCoords, reverseGeocode } from "@/lib/geo";
import { ForecastLocationBar } from "@/components/ForecastLocationBar";
import { ForecastView } from "@/components/ForecastView";
import { LikelySpecies } from "@/components/LikelySpecies";
import { ForecastEmpty } from "@/components/ForecastEmpty";

export const dynamic = "force-dynamic";

export default async function ForecastPage({
  searchParams,
}: {
  searchParams: Promise<{ lat?: string; lon?: string; q?: string }>;
}) {
  const { lat: latParam, lon: lonParam } = await searchParams;
  const queryLat = latParam ? Number(latParam) : NaN;
  const queryLon = lonParam ? Number(lonParam) : NaN;

  let lat = Number.isFinite(queryLat) ? queryLat : null;
  let lon = Number.isFinite(queryLon) ? queryLon : null;

  if (lat == null || lon == null) {
    const recent = await listCatches(5, "date");
    const withCoords = recent.find(
      (c) => c.latitude != null && c.longitude != null,
    );
    if (withCoords) {
      lat = Number(withCoords.latitude);
      lon = Number(withCoords.longitude);
    }
  }

  if (lat == null || lon == null) {
    return (
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          Forecast
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Pick a spot to see fishing conditions for the next 48 hours.
        </p>
        <ForecastLocationBar />
        <div className="mt-6">
          <ForecastEmpty />
        </div>
      </div>
    );
  }

  const [forecast, place, allSpecies] = await Promise.all([
    fetchForecast(lat, lon),
    reverseGeocode(lat, lon),
    listSpeciesWithStats(),
  ]);

  const region = regionFromCoords(lat, lon);
  const scored = forecast ? scoreForecast(forecast) : [];
  const likely =
    region == null
      ? []
      : allSpecies.filter((s) => s.regions.includes(region)).slice(0, 24);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Forecast
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
          {place?.short_name ?? `${lat.toFixed(3)}°, ${lon.toFixed(3)}°`}
        </p>
      </div>
      <ForecastLocationBar initialLat={lat} initialLon={lon} />
      {forecast && scored.length > 0 ? (
        <ForecastView
          forecast={forecast}
          scored={scored}
          timezone={forecast.timezone}
        />
      ) : (
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center text-slate-600 dark:text-slate-400">
          Couldn&apos;t fetch a forecast right now. Try again in a minute.
        </div>
      )}
      {likely.length > 0 ? (
        <LikelySpecies region={region!} species={likely} />
      ) : null}
    </div>
  );
}
