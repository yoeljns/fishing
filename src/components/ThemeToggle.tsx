"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "fj_theme";

function readStored(): Theme {
  if (typeof window === "undefined") return "system";
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "light" || v === "dark" ? v : "system";
}

function apply(theme: Theme): void {
  const root = document.documentElement;
  const wantsDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", wantsDark);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    setTheme(readStored());
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystem = () => {
      if (readStored() === "system") apply("system");
    };
    mql.addEventListener("change", onSystem);
    return () => mql.removeEventListener("change", onSystem);
  }, []);

  const set = (next: Theme) => {
    setTheme(next);
    if (next === "system") window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, next);
    apply(next);
  };

  return (
    <div
      className="inline-flex rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs overflow-hidden"
      role="group"
      aria-label="Theme"
    >
      <ToggleButton active={theme === "light"} onClick={() => set("light")} label="Light">
        <SunIcon />
      </ToggleButton>
      <ToggleButton active={theme === "system"} onClick={() => set("system")} label="System">
        <SystemIcon />
      </ToggleButton>
      <ToggleButton active={theme === "dark"} onClick={() => set("dark")} label="Dark">
        <MoonIcon />
      </ToggleButton>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={`px-2 py-1 transition-colors duration-150 ${
        active
          ? "bg-brand-600 text-white"
          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
      }`}
    >
      {children}
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

export const themeBootScript = `(() => {
  try {
    var v = localStorage.getItem('${STORAGE_KEY}');
    var dark = v === 'dark' || ((v === null || v === 'system') && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
  } catch (_) {}
})();`;
