"use client";

import Link from "next/link";
import { ArrowUpRight, BanknoteArrowUp, ChevronRight, CircleDollarSign, History, Plus, ShieldCheck, Wallet } from "lucide-react";
import { DashboardShell } from "@/app/components/dashboard-shell";
import { MOCK_USER, getMockWalletSummary } from "@/app/lib/mock-data";

const walletSummary = getMockWalletSummary();

export default function WalletPage() {
  return (
    <DashboardShell active="/wallet">
      <main className="mx-auto max-w-6xl space-y-6 pb-8">
        <section className="rounded-[28px] border border-slate-200 bg-gradient-to-r from-sky-600 via-sky-500 to-emerald-500 p-5 text-white shadow-sm md:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-100">Wallet</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">GH₵ 35.50</h1>
              <p className="mt-2 text-sm text-sky-50/90">Available balance</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
              >
                <Plus size={16} /> Fund wallet
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <ArrowUpRight size={16} /> Withdraw
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <StatCard
            icon={<CircleDollarSign size={18} />}
            label="Spent this month"
            value={walletSummary.spentThisMonth}
            tone="sky"
          />
          <StatCard
            icon={<BanknoteArrowUp size={18} />}
            label="Last top-up"
            value="GH₵ 50.00"
            tone="emerald"
          />
          <StatCard
            icon={<ShieldCheck size={18} />}
            label="Status"
            value="Secure"
            tone="slate"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Recent activity</h2>
                <p className="mt-1 text-sm text-slate-500">Your latest wallet transactions</p>
              </div>
              <Link href="/transactions" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700">
                View all <ChevronRight size={16} />
              </Link>
            </div>

            <div className="space-y-3">
              {walletSummary.activity.map((item) => (
                <div key={item.reference} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-sky-100 p-2 text-sky-700">
                      <History size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{item.network} {item.bundleSize}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.reference}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{item.amount}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.deliveryStatus}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Funding options</h2>
                <Wallet size={18} className="text-sky-600" />
              </div>

              <div className="space-y-3">
                {[
                  "Mobile money",
                  "Card payment",
                  "Bank transfer",
                ].map((method) => (
                  <button
                    key={method}
                    type="button"
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-slate-300 hover:bg-slate-100"
                  >
                    <span className="font-medium text-slate-900">{method}</span>
                    <ChevronRight size={16} className="text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900">Wallet tips</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-sky-500" />
                  Keep some balance for urgent data purchases.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  Wallet funding is processed instantly for supported methods.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-slate-400" />
                  Your account remains protected with secure transaction monitoring.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </DashboardShell>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "sky" | "emerald" | "slate";
}) {
  const toneStyles = {
    sky: "bg-sky-50 text-sky-700",
    emerald: "bg-emerald-50 text-emerald-700",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${toneStyles[tone]}`}>
        {icon}
      </div>
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}
