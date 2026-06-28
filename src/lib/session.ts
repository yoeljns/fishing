import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySession } from "./auth";
import { getUserById } from "./users";
import type { User } from "./types";

export async function getSessionUserId(): Promise<number | null> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

export async function getCurrentUser(): Promise<User | null> {
  const id = await getSessionUserId();
  if (id == null) return null;
  return getUserById(id);
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getSessionUserId()) != null;
}
