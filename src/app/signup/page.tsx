import Link from "next/link";
import { signupAction } from "./actions";
import { Logo } from "@/components/Logo";

export const dynamic = "force-dynamic";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="flex justify-center text-brand-600 dark:text-brand-400 mb-4">
          <Logo size={56} />
        </div>
        <h1 className="text-3xl font-bold text-center tracking-tight">
          Create your account
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-center mt-2 mb-8">
          Track your catches and share them with friends.
        </p>
        <form
          action={signupAction}
          className="space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm"
        >
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              required
              autoFocus
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="yourname"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors duration-150"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              3–20 characters · letters, numbers, underscores. This is your
              friend handle.
            </p>
          </div>
          <div>
            <label
              htmlFor="display_name"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Display name{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              id="display_name"
              type="text"
              name="display_name"
              autoComplete="name"
              placeholder="How friends see you"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors duration-150"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors duration-150"
            />
          </div>
          {error ? (
            <p
              role="alert"
              className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-md px-3 py-2"
            >
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="w-full px-3 py-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-medium rounded-md transition-colors duration-150 shadow-sm"
          >
            Create account
          </button>
        </form>
        <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-4">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-brand-700 dark:text-brand-400 font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
