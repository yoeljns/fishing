import Link from "next/link";
import { UnitToggle } from "./UnitToggle";

export function Nav() {
  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-6">
          <Link href="/catches" className="text-lg font-bold text-brand-700">
            Fishing Journal
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/catches" className="text-slate-700 hover:text-brand-700">
              Catches
            </Link>
            <Link href="/species" className="text-slate-700 hover:text-brand-700">
              Species
            </Link>
            <Link href="/stats" className="text-slate-700 hover:text-brand-700">
              Stats
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <UnitToggle />
          <form action="/logout" method="post">
            <button
              type="submit"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
