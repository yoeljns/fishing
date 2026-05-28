"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type ToastKind = "success" | "error" | "info";
type Toast = { id: number; kind: ToastKind; message: string };

type Ctx = {
  show: (message: string, kind?: ToastKind) => void;
};

const ToastContext = createContext<Ctx | null>(null);

const EVENT = "fj-toast";

export function showToast(message: string, kind: ToastKind = "success"): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<{ message: string; kind: ToastKind }>(EVENT, {
      detail: { message, kind },
    }),
  );
}

export function useToast(): Ctx {
  const ctx = useContext(ToastContext);
  if (!ctx) return { show: showToast };
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, kind: ToastKind = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, kind, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ message: string; kind: ToastKind }>).detail;
      if (detail?.message) show(detail.message, detail.kind ?? "success");
    };
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, [show]);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-slide-up ${
              t.kind === "success"
                ? "bg-brand-600 text-white"
                : t.kind === "error"
                  ? "bg-red-600 text-white"
                  : "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
