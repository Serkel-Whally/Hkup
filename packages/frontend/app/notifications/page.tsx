"use client";

import { Bell, CheckCircle2, Clock3, Inbox, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/app/components/dashboard-shell";
import {
  getStoredNotifications,
  markAllNotificationsAsRead,
  type NotificationItem,
} from "@/app/lib/notifications";

type NotificationTab = "All" | "Unread" | "System";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<NotificationTab>("All");

  useEffect(() => {
    setNotifications(getStoredNotifications());
    setLoading(false);
  }, []);

  const unreadCount = notifications.filter((notification) => notification.unread).length;

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      if (activeTab === "Unread") {
        return notification.unread;
      }

      if (activeTab === "System") {
        return notification.kind === "system";
      }

      return true;
    });
  }, [activeTab, notifications]);

  const formatTime = (value: string) =>
    new Intl.DateTimeFormat("en-GH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

  const handleMarkAllAsRead = () => {
    setNotifications(markAllNotificationsAsRead());
  };

  return (
    <DashboardShell active="/notifications">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-sky-600">Stay updated</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">Notifications</h1>
            <p className="mt-2 text-sm text-slate-500">Updates about your wallet, purchases, and account activity.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-sky-50 px-3 text-sm font-medium text-sky-700">
              <Bell size={16} />
              {unreadCount} unread
            </span>

            {(["All", "Unread", "System"] as NotificationTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`inline-flex min-h-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition ${
                  activeTab === tab
                    ? "border-sky-600 bg-sky-600 text-white shadow-sm"
                    : "border-sky-100 bg-sky-50 text-sky-700 hover:bg-sky-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.03)] md:p-6" aria-labelledby="notification-list-title">
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 id="notification-list-title" className="text-lg font-semibold text-slate-900">Recent notifications</h2>
              <p className="mt-1 text-xs text-slate-500">Your latest account updates</p>
            </div>

            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className="text-xs font-medium text-sky-600 hover:text-sky-700 disabled:cursor-not-allowed disabled:text-slate-400"
            >
              Mark all as read
            </button>
          </div>

          <ul className="divide-y divide-slate-100" role="list">
            {loading ? (
              <li className="py-10 text-center text-sm text-slate-500">Loading notifications...</li>
            ) : filteredNotifications.length === 0 ? (
              <li className="py-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <Inbox size={30} />
                </div>
                <p className="mt-4 text-base font-semibold text-slate-700">There is no notification</p>
                <p className="mt-1 text-sm text-slate-500">Your account updates will appear here when something important happens.</p>
              </li>
            ) : (
              filteredNotifications.map((notification) => {
                const Icon = notification.kind === "system" ? ShieldCheck : CheckCircle2;

                return (
                  <li
                    key={notification.id}
                    className={`flex min-w-0 gap-3 py-4 first:pt-5 last:pb-1 ${notification.unread ? "bg-sky-50/30" : ""}`}
                  >
                    <div
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                        notification.tone === "green"
                          ? "bg-emerald-50 text-emerald-600"
                          : notification.tone === "amber"
                            ? "bg-amber-50 text-amber-600"
                            : notification.tone === "slate"
                              ? "bg-slate-100 text-slate-600"
                              : "bg-sky-50 text-sky-600"
                      }`}
                    >
                      <Icon size={19} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-900">{notification.title}</h3>
                        {notification.unread && <span className="h-2 w-2 rounded-full bg-sky-600" aria-label="Unread" />}
                      </div>

                      <p className="mt-1 text-sm leading-5 text-slate-600">{notification.message}</p>

                      <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                        <Clock3 size={13} />
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </section>
      </div>
    </DashboardShell>
  );
}
