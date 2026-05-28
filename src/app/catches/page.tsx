import Link from "next/link";
import { listCatches, type SortMode } from "@/lib/catches";
import { CatchList } from "@/components/CatchList";
import { CatchesSort } from "@/components/CatchesSort";
import { Logo } from "@/components/Logo";

export const dynamic = "force-dynamic";

export default async function CatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort } = await searchParams;
  const sortMode: SortMode =
    sort === "length" || sort === "weight" ? sort : "date";
  const catches = await listCatches(200, sortMode);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Catches
        </h1>
        <div className="flex items-center gap-2">
          {catches.length > 0 ? <CatchesSort value={sortMode} /> : null}
          <Link
            href="/catches/new"
            className="px-3 py-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-md text-sm font-medium transition-colors duration-150 shadow-sm"
          >
            + Log a catch
          </Link>
        </div>
      </div>

      {catches.length === 0 ? <EmptyState /> : <CatchList catches={catches} />}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center shadow-sm">
      <div className="flex justify-center text-brand-500 mb-3">
        <Logo size={56} />
      </div>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        No catches logged yet
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mt-1">
        Start your journal with the first one — it only takes a few seconds.
      </p>
      <Link
        href="/catches/new"
        className="inline-block mt-5 px-4 py-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-md text-sm font-medium transition-colors duration-150 shadow-sm"
      >
        Log your first catch
      </Link>
    </div>
  );
}
