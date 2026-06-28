"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  searchUsersAction,
  type UserSearchResult,
} from "@/app/friends/search-actions";
import { AddFriendButton } from "./FriendButtons";
import { showToast } from "./Toast";

export function UserSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [pending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 1) return;
    startTransition(async () => {
      try {
        const res = await searchUsersAction(q);
        setResults(res);
        setSearched(true);
      } catch {
        showToast("Search failed", "error");
      }
    });
  };

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find anglers by username or name…"
          aria-label="Search users"
          autoCapitalize="none"
          className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
        />
        <button
          type="submit"
          disabled={pending}
          className="px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-md transition-colors duration-150 disabled:opacity-60"
        >
          {pending ? "Searching…" : "Search"}
        </button>
      </form>

      {searched ? (
        results.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
            No anglers matched “{query.trim()}”.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-200 dark:divide-slate-800">
            {results.map((u) => (
              <li
                key={u.id}
                className="py-2 flex items-center justify-between gap-3"
              >
                <Link
                  href={`/u/${u.username}`}
                  className="min-w-0 group"
                >
                  <div className="font-medium text-slate-900 dark:text-slate-100 truncate group-hover:text-brand-700 dark:group-hover:text-brand-400">
                    {u.display_name || u.username}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    @{u.username}
                  </div>
                </Link>
                <AddFriendButton userId={u.id} state={u.state} />
              </li>
            ))}
          </ul>
        )
      ) : null}
    </div>
  );
}
