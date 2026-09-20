"use client";

import { DashboardShell } from "@/app/components/dashboard-shell";
import { MOCK_ANNOUNCEMENTS, MOCK_NOTIFICATIONS } from "@/app/lib/mock-data";
import { Bell, ChevronRight, Megaphone, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

export default function NotificationsPage() {
  const notifications = MOCK_NOTIFICATIONS;
  const announcements = MOCK_ANNOUNCEMENTS;

  return (
    <DashboardShell active="/notifications">
      <main className="mx-auto max-w-6xl space-y-6 pb-8">
        <section className="rounded-[28px] border border-slate-200 bg-gradient-to-r from-sky-50 via-white to-emerald-50 p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-600">Notifications</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Your updates</h1>
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Bell size={16} /> Mark all read
            </button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <StatCard label="Unread" value="2" tone="sky" />
          <StatCard label="This week" value="5" tone="emerald" />
          <StatCard label="Announcements" value="2" tone="slate" />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Recent activity</h2>
              <Bell size={18} className="text-sky-600" />
            </div>

            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-2xl border p-4 ${
                    notification.unread
                      ? "border-sky-200 bg-sky-50/60"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 rounded-xl p-2 ${
                          notification.tone === "green"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-sky-100 text-sky-700"
                        }`}
                      >
                        <Bell size={16} />
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">{notification.title}</p>
                        <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
                        <p className="mt-2 text-xs text-slate-400">
                          {new Date(notification.createdAt).toLocaleDateString("en-GH", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    {notification.unread ? (
                      <span className="inline-flex rounded-full bg-sky-600 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
                        New
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Announcements</h2>
                <Megaphone size={18} className="text-sky-600" />
              </div>

              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-slate-900">{announcement.title}</p>
                      <span className="inline-flex rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-amber-700">
                        {announcement.category}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{announcement.content}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                      <span>{announcement.priority}</span>
                      <span>{announcement.audience}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Delivery alerts</h2>
                  <p className="mt-1 text-sm text-slate-600">Status updates for every purchase are sent here.</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">Order tracking</span>
                  <Sparkles size={16} className="text-sky-600" />
                </div>
                <Link
                  href="/transactions"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700"
                >
                  View recent orders <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </DashboardShell>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string; tone: "sky" | "emerald" | "slate" }) {
  const toneStyles = {
    sky: "bg-sky-50 text-sky-700",
    emerald: "bg-emerald-50 text-emerald-700",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`mb-3 inline-flex rounded-xl px-2.5 py-2 ${toneStyles[tone]}`}>{value}</div>
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">{label}</p>
    </div>
  );
}
