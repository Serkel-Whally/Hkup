"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bell, ChevronRight, CircleHelp, LockKeyhole, Mail, Phone, UserRound, WalletCards } from "lucide-react";
import { DashboardShell } from "@/app/components/dashboard-shell";
import { getAuthSession } from "@/app/lib/auth";

type ProfileUser = { name: string; email: string; phone: string };

export default function ProfilePage() {
  const [user, setUser] = useState<ProfileUser>({ name: "Customer", email: "", phone: "" });

  useEffect(() => {
    const session = getAuthSession();
    if (session?.user) {
      setUser({
        name: session.user.name || "Customer",
        email: session.user.email || "",
        phone: session.user.phone || "",
      });
    }
  }, []);

  const initials = user.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "C";

  return (
    <DashboardShell active="/profile">
      <main className="mx-auto max-w-5xl space-y-6 pb-8">
        <header>
          <p className="text-sm font-semibold text-sky-600">Your account</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Profile</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Your account information and useful account links.</p>
        </header>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-sky-50 via-white to-cyan-50 p-5 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-sky-600 text-xl font-bold text-white shadow-sm" aria-hidden="true">{initials}</div>
              <div className="min-w-0">
                <h2 className="truncate text-xl font-bold tracking-tight text-slate-900">{user.name}</h2>
                <p className="mt-1 break-all text-sm text-slate-600">{user.email || "Email not available"}</p>
              </div>
              <div className="sm:ml-auto">
                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">Account signed in</span>
              </div>
            </div>
          </div>

          <div className="grid gap-px border-t border-slate-100 bg-slate-100 sm:grid-cols-3">
            <ProfileDetail icon={<UserRound size={17} />} label="Full name" value={user.name} />
            <ProfileDetail icon={<Mail size={17} />} label="Email address" value={user.email || "Not provided"} />
            <ProfileDetail icon={<Phone size={17} />} label="Phone number" value={user.phone || "Not provided"} />
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h2 className="font-semibold text-slate-900">Account & security</h2>
              <p className="mt-1 text-sm text-slate-500">Keep your sign-in details safe and up to date.</p>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <span className="rounded-lg bg-white p-2 text-sky-700 shadow-sm"><LockKeyhole size={18} /></span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">Password protection</p>
                <p className="mt-1 text-sm leading-5 text-slate-600">Never share your password or one-time passcodes. If you need help accessing your account, contact support.</p>
                <Link href="/support" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-sky-700 hover:text-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">Get account help <ArrowRight size={15} /></Link>
              </div>
            </div>
            <div className="mt-3 flex items-start gap-3 rounded-xl border border-slate-200 p-4">
              <span className="rounded-lg bg-sky-50 p-2 text-sky-700"><Bell size={18} /></span>
              <div>
                <p className="text-sm font-semibold text-slate-900">Order updates</p>
                <p className="mt-1 text-sm leading-5 text-slate-600">Check the latest payment and order status from your transaction history.</p>
                <Link href="/transactions" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-sky-700 hover:text-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">View transactions <ArrowRight size={15} /></Link>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4">
              <h2 className="font-semibold text-slate-900">Quick links</h2>
              <p className="mt-1 text-sm text-slate-500">Get to the things you use most.</p>
            </div>
            <div className="space-y-2">
              <ProfileLink href="/wallet" icon={<WalletCards size={18} />} label="My wallet" detail="View your balance and funding activity" />
              <ProfileLink href="/buy-data" icon={<Phone size={18} />} label="Buy data" detail="Browse available network bundles" />
              <ProfileLink href="/support" icon={<CircleHelp size={18} />} label="Help & support" detail="Get guidance with an order or account" />
            </div>
          </div>
        </section>
      </main>
    </DashboardShell>
  );
}

function ProfileDetail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="min-w-0 bg-white p-4 sm:p-5">
      <div className="flex items-center gap-2 text-sky-700">{icon}<span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span></div>
      <p className="mt-2 break-words text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function ProfileLink({ href, icon, label, detail }: { href: string; icon: React.ReactNode; label: string; detail: string }) {
  return (
    <Link href={href} className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 transition hover:border-sky-200 hover:bg-sky-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
      <span className="rounded-lg bg-sky-50 p-2.5 text-sky-700">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-slate-900">{label}</span>
        <span className="mt-0.5 block text-xs leading-5 text-slate-500">{detail}</span>
      </span>
      <ChevronRight size={18} className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-sky-700" />
    </Link>
  );
}
