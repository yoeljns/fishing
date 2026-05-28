import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatch } from "@/lib/catches";
import { listSpecies } from "@/lib/species";
import { CatchForm } from "@/components/CatchForm";
import { updateCatchAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditCatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isFinite(id)) notFound();

  const [catchRow, species] = await Promise.all([getCatch(id), listSpecies()]);
  if (!catchRow) notFound();

  const action = updateCatchAction.bind(null, id);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Edit catch
        </h1>
        <Link
          href="/catches"
          className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-150"
        >
          Cancel
        </Link>
      </div>
      <CatchForm species={species} action={action} initial={catchRow} />
    </div>
  );
}
