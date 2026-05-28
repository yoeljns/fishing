import Link from "next/link";
import { listSpecies } from "@/lib/species";
import { CatchForm } from "@/components/CatchForm";
import { createCatchAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewCatchPage() {
  const species = await listSpecies();
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Log a catch</h1>
        <Link
          href="/catches"
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          Cancel
        </Link>
      </div>
      <CatchForm species={species} action={createCatchAction} />
    </div>
  );
}
