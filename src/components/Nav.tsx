"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UnitToggle } from "./UnitToggle";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/catches", label: "Catches" },
  { href: "/species", label: "Species" },
  { href: "/stats", label: "Stats" },
];

export function Nav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <>
      <nav className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-slate-950/60">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-brand-700 dark:text-brand-400 font-bold text-lg hover:opacity-80 transition-opacity"
              aria-label="Fishing Journal home"
            >
              <Logo size={22} />
              <span className="hidden sm:inline">Fishing Journal</span>
            </Link>
            <div className="hidden md:flex items-center gap-1 text-sm">
              {LINKS.filter((l) => l.href !== "/").map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={`px-3 py-1.5 rounded-md transition-colors duration-150 ${
                    isActive(l.href)
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300"
                      : "text-slate-700 dark:text-slate-300 hover:text-brand-700 dark:hover:text-brand-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <UnitToggle />
            <ThemeToggle />
            <form action="/logout" method="post">
              <button
                type="submit"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 px-2 py-1 transition-colors duration-150"
                aria-label="Sign out"
              >
                <SignOutIcon />
              </button>
            </form>
          </div>
        </div>
      </nav>

      <nav
        aria-label="Primary"
        className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur"
      >
        <div className="grid grid-cols-4 max-w-5xl mx-auto">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`flex flex-col items-center gap-1 py-2 text-xs transition-colors duration-150 ${
                isActive(l.href)
                  ? "text-brand-700 dark:text-brand-400"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <MobileIcon name={l.href} active={!!isActive(l.href)} />
              <span>{l.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}

function SignOutIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function MobileIcon({ name, active }: { name: string; active: boolean }) {
  const stroke = active ? 2.4 : 1.8;
  if (name === "/") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4a1 1 0 0 1-1-1v-5h-4v5a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2z" />
      </svg>
    );
  }
  if (name === "/catches") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 12 C 6 5, 16 5, 18 12 L 22 9 L 21 12 L 22 15 L 18 12 C 16 19, 6 19, 3 12 Z" />
        <circle cx="8" cy="11" r="0.8" fill="currentColor" />
      </svg>
    );
  }
  if (name === "/species") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
