"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, LockKeyhole, ShieldCheck } from "lucide-react";
import { DashboardShell } from "@/app/components/dashboard-shell";

export default function SecurityPage() {
  return (
    <DashboardShell active="/security">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <header className="flex items-center gap-3">
          <Link href="/profile" aria-label="Back to profile" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <p className="text-sm font-medium text-sky-600">Security</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">Account protection</h1>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)] md:p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600">
              <LockKeyhole size={22} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-slate-900">Your security overview</h2>
              <p className="mt-2 text-sm text-slate-500">
                Keep your CelluLite Data account protected with strong authentication and active monitoring.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <InfoCard
              icon={<ShieldCheck size={18} />}
              title="Password"
              description="Use a strong password and keep it private."
              status="Protected"
            />
            <InfoCard
              icon={<CheckCircle2 size={18} />}
              title="Device trust"
              description="This device is currently trusted for your account."
              status="Active"
            />
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

function InfoCard({ icon, title, description, status }: { icon: React.ReactNode; title: string; description: string; status: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sky-600 shadow-sm">{icon}</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
      </div>
      <div className="mt-4 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        {status}
      </div>
    </div>
  );
}
