import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { getUserByUsername } from "@/lib/users";
import { friendState } from "@/lib/friends";
import { listVisibleCatches } from "@/lib/catches";
import { AddFriendButton } from "@/components/FriendButtons";
import { ProfileCatchList } from "@/components/ProfileCatchList";
import { Logo } from "@/components/Logo";

export const dynamic = "force-dynamic";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const viewer = await requireUser();
  const { username } = await params;
  const profile = await getUserByUsername(decodeURIComponent(username));
  if (!profile) notFound();

  const state = await friendState(viewer.id, profile.id);
  const isSelf = state === "self";
  const isFriend = state === "friends";

  const catches = await listVisibleCatches(
    profile.id,
    viewer.id,
    isFriend,
    200,
    "date",
  );

  const name = profile.display_name || profile.username;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand-50 dark:bg-brand-900/40 flex items-center justify-center text-brand-600 dark:text-brand-300 text-xl font-bold uppercase">
              {name.slice(0, 1)}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                @{profile.username} · member since {profile.created_at}
              </p>
            </div>
          </div>
          {isSelf ? (
            <Link
              href="/catches"
              className="text-sm px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-brand-500 transition-colors duration-150"
            >
              Manage my catches
            </Link>
          ) : (
            <AddFriendButton userId={profile.id} state={state} />
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
          <h2 className="text-lg font-semibold tracking-tight">
            {isSelf ? "Your catches" : `${name}'s catches`}
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {catches.length} shown
          </span>
        </div>

        {catches.length === 0 ? (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center shadow-sm">
            <div className="flex justify-center text-brand-500 mb-3">
              <Logo size={48} />
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              {isSelf
                ? "You haven't logged any catches yet."
                : isFriend
                  ? `${name} hasn't shared any catches yet.`
                  : `Only ${name}'s public catches are visible. Add them as a friend to see more.`}
            </p>
            {!isSelf && !isFriend ? (
              <div className="mt-4">
                <AddFriendButton userId={profile.id} state={state} />
              </div>
            ) : null}
          </div>
        ) : (
          <ProfileCatchList catches={catches} />
        )}
      </section>
    </div>
  );
}
