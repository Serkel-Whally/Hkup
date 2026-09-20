"use client";

import Link from "next/link";
import { ChevronRight, CircleDashed, Download, Search, ShieldCheck } from "lucide-react";
import { DashboardShell } from "@/app/components/dashboard-shell";
import { getMockOrdersForUser } from "@/app/lib/mock-data";

const orders = getMockOrdersForUser();

export default function TransactionsPage() {
  return (
    <DashboardShell active="/transactions">
      <main className="mx-auto max-w-6xl space-y-6 pb-8">
        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-600">Transactions</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Purchase history</h1>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <Search size={16} className="text-slate-400" />
              <input
                aria-label="Search transactions"
                placeholder="Search reference"
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 md:w-52"
              />
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <StatCard label="Total purchases" value="3" tone="sky" />
          <StatCard label="Successful" value="2" tone="emerald" />
          <StatCard label="Pending" value="1" tone="amber" />
        </section>

        <section className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent transactions</h2>
            <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
              <Download size={16} /> Export
            </button>
          </div>

          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href="/transactions"
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-sky-200 hover:bg-sky-50/50 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-white p-2.5 text-sky-600 shadow-sm">
                    <CircleDashed size={18} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold text-slate-900">{order.network} {order.bundleSize}</p>
                      <StatusBadge status={order.paymentStatus} />
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{order.reference}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString("en-GH", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 md:justify-end md:min-w-[240px]">
                  <div className="text-left md:text-right">
                    <p className="text-base font-semibold text-slate-900">{order.amount}</p>
                    <p className="mt-1 text-xs text-slate-500">{order.recipientPhone}</p>
                  </div>
                  <ChevronRight size={18} className="text-slate-400" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Transaction protection</h2>
              <p className="mt-1 text-sm text-slate-500">Every purchase is verified before data delivery is processed.</p>
            </div>
          </div>
        </section>
      </main>
    </DashboardShell>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "sky" | "emerald" | "amber";
}) {
  const toneStyles = {
    sky: "bg-sky-50 text-sky-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`mb-3 inline-flex rounded-xl px-2.5 py-2 ${toneStyles[tone]}`}>{value}</div>
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">{label}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toUpperCase();
  const styles =
    normalized === "PAID"
      ? "bg-emerald-100 text-emerald-700"
      : normalized === "FAILED"
        ? "bg-red-100 text-red-700"
        : "bg-amber-100 text-amber-700";

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${styles}`}>
      {normalized === "PENDING_PAYMENT" ? "Pending" : normalized}
    </span>
  );
}
