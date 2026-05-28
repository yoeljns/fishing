type Props = {
  lat: number;
  lon: number;
  delta?: number;
  title?: string;
};

export function CatchMapPreview({
  lat,
  lon,
  delta = 0.01,
  title = "Catch location",
}: Props) {
  const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
  const fullUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=14/${lat}/${lon}`;
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
      <iframe
        title={title}
        src={src}
        className="w-full h-64 sm:h-72 border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400">
          {lat.toFixed(4)}°, {lon.toFixed(4)}°
        </span>
        <a
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-700 dark:text-brand-400 hover:underline"
        >
          Open in OpenStreetMap →
        </a>
      </div>
    </div>
  );
}
