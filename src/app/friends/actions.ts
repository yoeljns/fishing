"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import { getUserById, getUserByUsername } from "@/lib/users";
import {
  acceptFriendRequest,
  removeFriendEdge,
  sendFriendRequest,
} from "@/lib/friends";

export type ActionResult = { ok: boolean; message?: string };

export async function sendRequestAction(
  targetUserId: number,
): Promise<ActionResult> {
  const user = await requireUser();
  if (targetUserId === user.id) {
    return { ok: false, message: "You can't friend yourself" };
  }
  const target = await getUserById(targetUserId);
  if (!target) return { ok: false, message: "User not found" };
  await sendFriendRequest(user.id, targetUserId);
  revalidatePath("/friends");
  revalidatePath(`/u/${target.username}`);
  return { ok: true };
}

export async function acceptRequestAction(
  requesterId: number,
): Promise<ActionResult> {
  const user = await requireUser();
  await acceptFriendRequest(user.id, requesterId);
  revalidatePath("/friends");
  revalidatePath("/");
  return { ok: true };
}

export async function removeFriendAction(
  otherId: number,
): Promise<ActionResult> {
  const user = await requireUser();
  await removeFriendEdge(user.id, otherId);
  revalidatePath("/friends");
  revalidatePath("/");
  return { ok: true };
}

export async function sendRequestByUsernameAction(
  username: string,
): Promise<ActionResult> {
  const user = await requireUser();
  const target = await getUserByUsername(username.trim());
  if (!target) return { ok: false, message: "No user with that username" };
  if (target.id === user.id) {
    return { ok: false, message: "You can't friend yourself" };
  }
  await sendFriendRequest(user.id, target.id);
  revalidatePath("/friends");
  revalidatePath(`/u/${target.username}`);
  return { ok: true, message: `Request sent to ${target.username}` };
}
