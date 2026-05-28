import Link from "next/link";
import { listSpecies } from "@/lib/species";
import { CatchForm } from "@/components/CatchForm";
import { createCatchAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewCatchPage() {
  const species = await listSpecies();
  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Log a catch
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Fill in what you remember — only species and date are required.
          </p>
        </div>
        <Link
          href="/catches"
          className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-150"
        >
          Cancel
        </Link>
      </div>
      <CatchForm species={species} action={createCatchAction} />
    </div>
  );
}
