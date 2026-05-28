import Link from "next/link";
import { listCatches } from "@/lib/catches";
import { CatchListItem } from "@/components/CatchListItem";

export const dynamic = "force-dynamic";

export default async function CatchesPage() {
  const catches = await listCatches();
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Catches</h1>
        <Link
          href="/catches/new"
          className="px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-md text-sm font-medium"
        >
          Log a catch
        </Link>
      </div>

      {catches.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
          <p className="text-slate-600 mb-4">No catches logged yet.</p>
          <Link
            href="/catches/new"
            className="inline-block px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-md text-sm font-medium"
          >
            Log your first catch
          </Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {catches.map((c) => (
            <CatchListItem key={c.id} catchRow={c} />
          ))}
        </ul>
      )}
    </div>
  );
}
