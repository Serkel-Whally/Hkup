"use client";

import Link from "next/link";
import { DashboardShell } from "@/app/components/dashboard-shell";
import { Bell, CheckCircle2, ChevronRight, Lock, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";

export default function ProfilePage() {
  return (
    <DashboardShell active="/profile">
      <main className="mx-auto max-w-6xl space-y-6 pb-8">
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-6 border-b border-slate-200 bg-gradient-to-r from-sky-50 via-white to-emerald-50 p-5 md:flex-row md:items-center md:justify-between md:p-7">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-600 text-xl font-bold text-white shadow-sm">
                K
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">Kyrios Mensah</h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
                    <CheckCircle2 size={12} /> Active
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600">Customer account</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Edit profile
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
              >
                Update account
              </button>
            </div>
          </div>

          <div className="grid gap-4 p-5 md:grid-cols-3 md:p-7">
            <InfoItem icon={<UserRound size={18} />} label="Full name" value="Kyrios Mensah" />
            <InfoItem icon={<Mail size={18} />} label="Email" value="kyrios@example.com" />
            <InfoItem icon={<Phone size={18} />} label="Phone" value="024 123 4567" />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Card title="Account overview" subtitle="Your current profile details and status.">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">Member since</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">March 2026</p>
                  </div>
                  <div className="rounded-xl bg-sky-100 px-3 py-2 text-sm font-semibold text-sky-700">Verified</div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">Preferred network</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">MTN</p>
                  </div>
                  <Link href="/buy-data" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700">
                    Change <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </Card>

            <Card title="Security" subtitle="Manage access and account protection.">
              <div className="space-y-3">
                {[
                  { label: "Password", value: "Last updated 2 months ago" },
                  { label: "Two-factor authentication", value: "Not enabled" },
                  { label: "Login activity", value: "Checked today" },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{item.label}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.value}</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-400" />
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Notifications" subtitle="Choose what you want to hear about.">
              <div className="space-y-3">
                {[
                  { label: "Data purchase updates", enabled: true },
                  { label: "Wallet activity", enabled: true },
                  { label: "Promotions and offers", enabled: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-sky-50 p-2 text-sky-600">
                        <Bell size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{item.label}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-pressed={item.enabled}
                      className={`relative h-6 w-11 rounded-full transition ${item.enabled ? "bg-sky-600" : "bg-slate-200"}`}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${item.enabled ? "left-6" : "left-1"}`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Quick actions" subtitle="Helpful links for your account.">
              <div className="space-y-3">
                <ActionLink href="/dashboard" label="Go to dashboard" />
                <ActionLink href="/wallet" label="Manage wallet" />
                <ActionLink href="/support" label="Contact support" />
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
                      <ShieldCheck size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Protected account</p>
                      <p className="mt-1 text-sm text-slate-600">Your account security is active and monitored.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </DashboardShell>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sky-600">{icon}</div>
      <p className="mt-3 text-xs font-medium uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-2 text-base font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function ActionLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
    >
      <span className="font-medium text-slate-900">{label}</span>
      <ChevronRight size={18} className="text-slate-400" />
    </Link>
  );
}
