"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Application error boundary captured:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-6 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-600">Something went wrong</p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">We hit a runtime error</h1>
        <p className="mt-2 text-sm text-slate-600">
          Please refresh the page or try again. If this keeps happening, contact support.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
