import { loginAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="max-w-sm mx-auto mt-16">
      <h1 className="text-3xl font-bold mb-2">Fishing Journal</h1>
      <p className="text-slate-600 mb-6">Enter the password to continue.</p>
      <form action={loginAction} className="space-y-4">
        <input
          type="password"
          name="password"
          required
          autoFocus
          autoComplete="current-password"
          placeholder="Password"
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        {error ? (
          <p className="text-sm text-red-600">Incorrect password.</p>
        ) : null}
        <button
          type="submit"
          className="w-full px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-md"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
