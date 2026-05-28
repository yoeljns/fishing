"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  checkPassword,
  signSession,
} from "@/lib/auth";

export async function loginAction(formData: FormData): Promise<void> {
  const submitted = String(formData.get("password") ?? "");
  if (!checkPassword(submitted)) {
    redirect("/login?error=1");
  }
  const store = await cookies();
  store.set({
    name: SESSION_COOKIE,
    value: signSession(),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  redirect("/catches");
}
