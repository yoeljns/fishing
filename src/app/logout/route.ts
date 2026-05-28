import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  const url = new URL("/login", req.url);
  return NextResponse.redirect(url, { status: 303 });
}
