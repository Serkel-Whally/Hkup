import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({ eyebrow, title, subtitle, children, footer }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-slate-100/80 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)] lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-sky-600 via-cyan-500 to-emerald-500 p-8 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.24),transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.18),transparent_30%)]" />

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3 rounded-full bg-white/10 p-2 pr-4 backdrop-blur-sm ring-1 ring-white/20">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-lg font-bold shadow-sm">
                C
              </div>
              <span className="text-sm font-semibold tracking-[0.14em] uppercase text-sky-50">CelluLite Data</span>
            </Link>
          </div>

          <div className="relative z-10 space-y-8">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.32em] text-sky-100">Fast and simple</p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">Buy mobile data in seconds.</h1>
            </div>

            <div className="grid gap-4">
              {[
                "Browse top Ghana mobile bundles",
                "Pay securely and track every order",
                "Get instant delivery and wallet support",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/8 px-4 py-3 backdrop-blur-sm">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-base font-bold text-white">✓</span>
                  <span className="text-sm text-sky-50">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-sm text-sky-50/90">
            <span>Trusted by Ghanaian users</span>
            <div className="flex -space-x-2">
              {"MTN Telecel Airtel".split(" ").map((network) => (
                <span key={network} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[10px] font-bold">
                  {network.slice(0, 2).toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center bg-white p-5 sm:p-7 lg:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-xl font-bold text-sky-700 shadow-sm lg:mx-0">
                C
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">{eyebrow}</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
              <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
            </div>

            {children}

            <div className="mt-6 text-center text-sm text-slate-600">{footer}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
