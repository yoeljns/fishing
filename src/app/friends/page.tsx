import Link from "next/link";
import { requireUser } from "@/lib/session";
import {
  listFriends,
  listIncomingRequests,
  listOutgoingRequests,
} from "@/lib/friends";
import { UserSearch } from "@/components/UserSearch";
import {
  IncomingRequestActions,
  RemoveFriendButton,
} from "@/components/FriendButtons";

export const dynamic = "force-dynamic";

export default async function FriendsPage() {
  const user = await requireUser();
  const [friends, incoming, outgoing] = await Promise.all([
    listFriends(user.id),
    listIncomingRequests(user.id),
    listOutgoingRequests(user.id),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Friends
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          You&apos;re <span className="font-medium">@{user.username}</span> —
          share that handle so friends can find you.
        </p>
      </div>

      <UserSearch />

      {incoming.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
            Requests ({incoming.length})
          </h2>
          <ul className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 shadow-sm">
            {incoming.map((u) => (
              <li
                key={u.id}
                className="px-4 py-3 flex items-center justify-between gap-3"
              >
                <Link href={`/u/${u.username}`} className="min-w-0 group">
                  <div className="font-medium text-slate-900 dark:text-slate-100 truncate group-hover:text-brand-700 dark:group-hover:text-brand-400">
                    {u.display_name || u.username}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    @{u.username}
                  </div>
                </Link>
                <IncomingRequestActions requesterId={u.id} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
          Your friends ({friends.length})
        </h2>
        {friends.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-white/40 dark:bg-slate-900/40 p-8 text-center text-slate-600 dark:text-slate-400">
            No friends yet. Search above to find anglers and send a request.
          </div>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 shadow-sm">
            {friends.map((u) => (
              <li
                key={u.id}
                className="px-4 py-3 flex items-center justify-between gap-3"
              >
                <Link href={`/u/${u.username}`} className="min-w-0 group">
                  <div className="font-medium text-slate-900 dark:text-slate-100 truncate group-hover:text-brand-700 dark:group-hover:text-brand-400">
                    {u.display_name || u.username}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    @{u.username} · {u.catch_count}{" "}
                    {u.catch_count === 1 ? "catch" : "catches"} shared
                  </div>
                </Link>
                <RemoveFriendButton userId={u.id} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {outgoing.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
            Pending sent ({outgoing.length})
          </h2>
          <ul className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 shadow-sm">
            {outgoing.map((u) => (
              <li
                key={u.id}
                className="px-4 py-3 flex items-center justify-between gap-3"
              >
                <Link href={`/u/${u.username}`} className="min-w-0 group">
                  <div className="font-medium text-slate-900 dark:text-slate-100 truncate group-hover:text-brand-700 dark:group-hover:text-brand-400">
                    {u.display_name || u.username}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    @{u.username}
                  </div>
                </Link>
                <RemoveFriendButton userId={u.id} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
