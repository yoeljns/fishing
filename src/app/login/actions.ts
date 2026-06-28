"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  signSession,
  verifyPassword,
} from "@/lib/auth";
import { getUserWithHash } from "@/lib/users";
import { loginSchema } from "@/lib/validation";

function setSessionCookie(store: Awaited<ReturnType<typeof cookies>>, userId: number) {
  store.set({
    name: SESSION_COOKIE,
    value: signSession(userId),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function loginAction(formData: FormData): Promise<void> {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (!parsed.success) redirect("/login?error=1");

  const user = await getUserWithHash(parsed.data.username);
  if (!user || !(await verifyPassword(parsed.data.password, user.password_hash))) {
    redirect("/login?error=1");
  }

  const store = await cookies();
  setSessionCookie(store, user.id);
  redirect("/");
}
