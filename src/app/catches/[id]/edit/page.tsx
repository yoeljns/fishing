import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatch } from "@/lib/catches";
import { listSpecies } from "@/lib/species";
import { requireUser } from "@/lib/session";
import { CatchForm } from "@/components/CatchForm";
import { CatchMapPreview } from "@/components/CatchMapPreview";
import { updateCatchAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditCatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isFinite(id)) notFound();

  const [catchRow, species] = await Promise.all([
    getCatch(id, user.id),
    listSpecies(),
  ]);
  if (!catchRow) notFound();

  const action = updateCatchAction.bind(null, id);
  const hasCoords =
    catchRow.latitude != null && catchRow.longitude != null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
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
      {hasCoords ? (
        <CatchMapPreview
          lat={Number(catchRow.latitude)}
          lon={Number(catchRow.longitude)}
        />
      ) : null}
    </div>
  );
}
