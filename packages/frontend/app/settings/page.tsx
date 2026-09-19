"use client";

import Link from "next/link";
import { Bell, ChevronRight, Globe2, LockKeyhole, LogOut, Moon, ShieldCheck, Smartphone } from "lucide-react";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { DashboardShell } from "@/app/components/dashboard-shell";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [transactionAlerts, setTransactionAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");

  useEffect(() => {
    setNotifications(window.localStorage.getItem("cellulite-notifications") !== "off");
    setTransactionAlerts(window.localStorage.getItem("cellulite-transaction-alerts") !== "off");
    setDarkMode(window.localStorage.getItem("cellulite-dark-mode") === "on");
    setLanguage(window.localStorage.getItem("cellulite-language") || "English");
  }, []);

  function updateNotifications(enabled: boolean) {
    setNotifications(enabled);
    window.localStorage.setItem("cellulite-notifications", enabled ? "on" : "off");
  }

  function updateTransactionAlerts(enabled: boolean) {
    setTransactionAlerts(enabled);
    window.localStorage.setItem("cellulite-transaction-alerts", enabled ? "on" : "off");
  }

  function updateDarkMode(enabled: boolean) {
    setDarkMode(enabled);
    window.localStorage.setItem("cellulite-dark-mode", enabled ? "on" : "off");
  }

  function updateLanguage(value: string) {
    setLanguage(value);
    window.localStorage.setItem("cellulite-language", value);
  }

  async function handleLogout() {
    await signOut({ callbackUrl: "/login" });
  }

  return (
    <DashboardShell active="/settings">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <header>
          <p className="text-sm font-medium text-sky-600">Preferences</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">Settings</h1>
          <p className="mt-2 text-sm text-slate-500">Manage your CelluLite Data experience.</p>
        </header>

        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)] md:p-6" aria-labelledby="notifications-title">
          <div className="border-b border-slate-100 pb-4">
            <h2 id="notifications-title" className="text-lg font-semibold text-slate-900">Notifications</h2>
            <p className="mt-1 text-xs text-slate-500">Choose which updates you receive.</p>
          </div>
          <div className="divide-y divide-slate-100">
            <SettingToggle icon={<Bell size={18} />} title="Push notifications" description="Receive updates about your account and offers." enabled={notifications} onChange={updateNotifications} />
            <SettingToggle icon={<ShieldCheck size={18} />} title="Transaction alerts" description="Get notified when a purchase or wallet action is completed." enabled={transactionAlerts} onChange={updateTransactionAlerts} />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)] md:p-6" aria-labelledby="app-title">
          <div className="border-b border-slate-100 pb-4">
            <h2 id="app-title" className="text-lg font-semibold text-slate-900">App preferences</h2>
            <p className="mt-1 text-xs text-slate-500">Adjust how the application behaves.</p>
          </div>
          <div className="divide-y divide-slate-100">
            <SettingToggle icon={<Moon size={18} />} title="Dark mode" description="Use a darker appearance for the dashboard." enabled={darkMode} onChange={updateDarkMode} />
            <div className="flex min-h-16 items-center gap-3 py-4">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600"><Globe2 size={18} /></span>
              <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-slate-900">Language</p><p className="mt-1 text-xs text-slate-500">Choose your preferred language.</p></div>
              <select aria-label="Language" value={language} onChange={(event) => updateLanguage(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"><option>English</option><option>French</option><option>Twi</option></select>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)] md:p-6" aria-labelledby="security-title">
          <div className="border-b border-slate-100 pb-4">
            <h2 id="security-title" className="text-lg font-semibold text-slate-900">Security</h2>
            <p className="mt-1 text-xs text-slate-500">Keep your account protected.</p>
          </div>
          <div className="divide-y divide-slate-100">
            <Link href="/security" className="flex min-h-16 items-center gap-3 py-4 transition hover:bg-slate-50">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600"><LockKeyhole size={18} /></span>
              <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-900">Account security</span><span className="mt-1 block text-xs text-slate-500">Review your personal details and account protection.</span></span>
              <ChevronRight size={18} className="flex-shrink-0 text-slate-400" />
            </Link>
            <div className="flex min-h-16 items-center gap-3 py-4">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><Smartphone size={18} /></span>
              <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-900">Trusted device</span><span className="mt-1 block text-xs text-slate-500">This device is currently protected.</span></span>
              <span className="text-xs font-semibold text-emerald-600">Active</span>
            </div>
            <button type="button" onClick={handleLogout} className="flex min-h-16 w-full items-center gap-3 py-4 text-left transition hover:bg-slate-50">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600"><LogOut size={18} /></span>
              <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-900">Logout</span><span className="mt-1 block text-xs text-slate-500">Sign out from this device.</span></span>
              <ChevronRight size={18} className="flex-shrink-0 text-slate-400" />
            </button>
          </div>
        </section>

      </div>
    </DashboardShell>
  );
}

function SettingToggle({ icon, title, description, enabled, onChange }: { icon: React.ReactNode; title: string; description: string; enabled: boolean; onChange: (enabled: boolean) => void }) {
  return (
    <div className="flex min-h-16 items-center gap-3 py-4">
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600">{icon}</span>
      <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-slate-900">{title}</p><p className="mt-1 text-xs text-slate-500">{description}</p></div>
      <button type="button" role="switch" aria-checked={enabled} aria-label={`Toggle ${title}`} onClick={() => onChange(!enabled)} className={`relative h-6 w-11 flex-shrink-0 rounded-full transition ${enabled ? "bg-sky-600" : "bg-slate-200"}`}>
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${enabled ? "left-6" : "left-1"}`} />
      </button>
    </div>
  );
}
