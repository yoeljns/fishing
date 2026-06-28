"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  signSession,
} from "@/lib/auth";
import {
  claimOrphanCatches,
  countUsers,
  createUser,
  usernameTaken,
} from "@/lib/users";
import { signupSchema } from "@/lib/validation";

export async function signupAction(formData: FormData): Promise<void> {
  const parsed = signupSchema.safeParse({
    username: formData.get("username"),
    display_name: formData.get("display_name") ?? undefined,
    password: formData.get("password"),
  });
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid details";
    redirect(`/signup?error=${encodeURIComponent(msg)}`);
  }

  const { username, display_name, password } = parsed.data;

  if (await usernameTaken(username)) {
    redirect(`/signup?error=${encodeURIComponent("That username is taken")}`);
  }

  const isFirstUser = (await countUsers()) === 0;
  const user = await createUser(username, display_name, password);

  // The very first account adopts any catches from the old single-user app.
  if (isFirstUser) {
    await claimOrphanCatches(user.id);
  }

  const store = await cookies();
  store.set({
    name: SESSION_COOKIE,
    value: signSession(user.id),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  redirect("/");
}
