"use server";

import { requireUser } from "@/lib/session";
import { searchUsers } from "@/lib/users";
import { friendState } from "@/lib/friends";
import type { FriendState } from "@/lib/types";

export type UserSearchResult = {
  id: number;
  username: string;
  display_name: string | null;
  state: FriendState;
};

export async function searchUsersAction(
  query: string,
): Promise<UserSearchResult[]> {
  const user = await requireUser();
  const q = query.trim();
  if (q.length < 1) return [];
  const found = await searchUsers(q, user.id, 12);
  const withState = await Promise.all(
    found.map(async (u) => ({
      id: u.id,
      username: u.username,
      display_name: u.display_name,
      state: await friendState(user.id, u.id),
    })),
  );
  return withState;
}
