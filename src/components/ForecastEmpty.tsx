export function ForecastEmpty() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/40 dark:bg-slate-900/40 p-8 text-center">
      <p className="text-slate-700 dark:text-slate-300 font-medium">
        Tell us where you're fishing
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
        Search a place above, share your current location, or attach GPS to a
        catch — the forecast picks up automatically next time.
      </p>
    </div>
  );
}
