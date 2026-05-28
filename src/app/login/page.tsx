import { loginAction } from "./actions";
import { Logo } from "@/components/Logo";

export const dynamic = "force-dynamic";

export default async function LoginPage({
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
          Fishing Journal
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-center mt-2 mb-8">
          Sign in to log your catches.
        </p>
        <form
          action={loginAction}
          className="space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm"
        >
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
              autoFocus
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors duration-150"
            />
          </div>
          {error ? (
            <p
              role="alert"
              className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-md px-3 py-2"
            >
              Incorrect password.
            </p>
          ) : null}
          <button
            type="submit"
            className="w-full px-3 py-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-medium rounded-md transition-colors duration-150 shadow-sm"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
