import Link from "next/link";
import { listCatches, getStats } from "@/lib/catches";
import { listSpeciesWithStats } from "@/lib/species";
import { Logo } from "@/components/Logo";
import { DashboardCatches } from "@/components/DashboardCatches";
import { DashboardStat } from "@/components/DashboardStat";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [recent, stats, allSpecies] = await Promise.all([
    listCatches(5, "date"),
    getStats(),
    listSpeciesWithStats(),
  ]);

  const totalSpecies = allSpecies.length;
  const caughtSpecies = allSpecies.filter((s) => s.catch_count > 0).length;
  const pct =
    totalSpecies === 0 ? 0 : Math.round((caughtSpecies / totalSpecies) * 100);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-brand-100 dark:border-brand-900/40 bg-gradient-to-br from-brand-50 via-white to-white dark:from-brand-900/30 dark:via-slate-900 dark:to-slate-900 p-6 sm:p-8 shadow-sm">
        <div className="absolute -right-6 -bottom-6 text-brand-200/60 dark:text-brand-700/40 pointer-events-none">
          <Logo size={180} />
        </div>
        <div className="relative max-w-xl">
          <p className="text-xs uppercase tracking-widest text-brand-700 dark:text-brand-400 font-semibold">
            Your journal
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">
            {stats.total_catches === 0
              ? "Welcome aboard."
              : `${stats.total_catches} ${stats.total_catches === 1 ? "catch" : "catches"} so far.`}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-md">
            {stats.total_catches === 0
              ? "Log your first catch to start building your journal."
              : `${stats.distinct_species} distinct species · ${stats.this_month} in the last 30 days.`}
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            <Link
              href="/catches/new"
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-md text-sm font-medium transition-colors duration-150 shadow-sm"
            >
              + Log a catch
            </Link>
            <Link
              href="/catches"
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-md text-sm font-medium hover:border-brand-500 transition-colors duration-150"
            >
              View all
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <DashboardStat
          label="Longest"
          value={stats.longest?.length_cm ?? null}
          format="length"
          species={stats.longest?.species_name_snapshot ?? null}
        />
        <DashboardStat
          label="Heaviest"
          value={stats.heaviest?.weight_kg ?? null}
          format="weight"
          species={stats.heaviest?.species_name_snapshot ?? null}
        />
        <Link
          href="/species"
          className="block rounded-lg p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500 transition-colors duration-150 shadow-sm"
        >
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Species progress
          </div>
          <div className="text-2xl font-semibold mt-1 text-slate-900 dark:text-slate-100">
            {caughtSpecies} <span className="text-base text-slate-500 dark:text-slate-400 font-normal">/ {totalSpecies}</span>
          </div>
          <div className="mt-2 h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {pct}% caught
          </div>
        </Link>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold tracking-tight">
            Recent catches
          </h2>
          {recent.length > 0 ? (
            <Link
              href="/catches"
              className="text-sm text-brand-700 dark:text-brand-400 hover:underline"
            >
              See all →
            </Link>
          ) : null}
        </div>
        {recent.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-white/40 dark:bg-slate-900/40 p-8 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-3">
              Nothing logged yet.
            </p>
            <Link
              href="/catches/new"
              className="inline-block px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-md text-sm font-medium"
            >
              Log your first catch
            </Link>
          </div>
        ) : (
          <DashboardCatches catches={recent} />
        )}
      </section>
    </div>
  );
}
