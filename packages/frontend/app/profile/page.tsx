"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  AtSign,
  BellRing,
  CircleHelp,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Smartphone,
  UserRound,
  WalletCards,
  History,
  ShoppingBag,
} from "lucide-react";
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

  const initials = user.name.trim().split(/\\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "C";

  return (
    <DashboardShell active="/profile">
      <main className="mx-auto w-full max-w-5xl space-y-6 pb-8 sm:space-y-7">
        <header className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-sky-600">ACCOUNT</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">My profile</h1>
          <p className="max-w-xl text-sm leading-6 text-slate-500 sm:text-base">Your personal details, account security and shortcuts to everything you need.</p>
        </header>

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-5 text-white shadow-lg shadow-slate-900/10 sm:p-7">
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border-[38px] border-white/[0.04]" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 right-24 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-[24px] border border-white/15 bg-white/10 text-2xl font-bold tracking-wide text-white shadow-inner sm:h-20 sm:w-20">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">Your CelluLite account</p>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Signed in
                </span>
              </div>
              <h2 className="mt-2 truncate text-2xl font-bold tracking-tight sm:text-[28px]">{user.name}</h2>
              <p className="mt-1 break-all text-sm text-slate-300">{user.email || "Add an email address to your account"}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-xs font-medium text-slate-200">
              <ShieldCheck size={16} className="text-cyan-300" />
              Account overview
            </div>
          </div>
          <div className="relative mt-6 grid grid-cols-2 gap-3 border-t border-white/10 pt-5 sm:max-w-md">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Phone number</p>
              <p className="mt-1 truncate text-sm font-semibold text-white">{user.phone || "Not provided"}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Email address</p>
              <p className="mt-1 truncate text-sm font-semibold text-white">{user.email || "Not provided"}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-700"><UserRound size={18} /></span>
                  <h2 className="text-base font-bold text-slate-900">Personal information</h2>
                </div>
                <p className="mt-2 text-sm text-slate-500">The details associated with your account.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">Account details</span>
            </div>

            <div className="mt-5 divide-y divide-slate-100">
              <DetailRow icon={<UserRound size={17} />} label="Full name" value={user.name} />
              <DetailRow icon={<Mail size={17} />} label="Email address" value={user.email || "Not provided"} />
              <DetailRow icon={<Smartphone size={17} />} label="Phone number" value={user.phone || "Not provided"} />
            </div>
            <div className="mt-4 flex items-start gap-3 rounded-xl bg-slate-50 p-3.5">
              <AtSign size={17} className="mt-0.5 shrink-0 text-slate-500" />
              <p className="text-xs leading-5 text-slate-500">Need to change your personal details? Contact our support team so we can help you update your account safely.</p>
            </div>
            <Link href="/support" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
              Request an account update <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><LockKeyhole size={18} /></span>
                <h2 className="text-base font-bold text-slate-900">Account security</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-500">A few simple steps help keep your account and purchases protected.</p>
              <div className="mt-4 space-y-3">
                <SecurityTip title="Keep your password private" description="Never share your password or one-time passcodes." />
                <SecurityTip title="Check your order activity" description="Review payments and order statuses regularly." />
              </div>
              <Link href="/support" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-sky-800">
                Get account help <ArrowRight size={15} />
              </Link>
            </div>

            <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-cyan-50 p-5 sm:p-6">
              <div className="flex items-center gap-2 text-sky-800">
                <BellRing size={18} />
                <h2 className="text-sm font-bold">Stay in control</h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">Keep track of payments, wallet activity and data orders from one place.</p>
              <Link href="/transactions" className="mt-3 inline-flex min-h-9 items-center gap-2 text-sm font-semibold text-sky-800 hover:text-sky-950">
                View your activity <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-3">
            <h2 className="text-base font-bold text-slate-900">Quick access</h2>
            <p className="mt-1 text-sm text-slate-500">Jump back into the things you use most.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <QuickLink href="/wallet" icon={<WalletCards size={19} />} title="My wallet" description="Balance and funding activity" />
            <QuickLink href="/transactions" icon={<History size={19} />} title="Transactions" description="Payments and order history" />
            <QuickLink href="/buy-data" icon={<ShoppingBag size={19} />} title="Buy data" description="Explore network bundles" />
            <QuickLink href="/support" icon={<CircleHelp size={19} />} title="Help & support" description="We're here to help" />
          </div>
        </section>
      </main>
    </DashboardShell>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3 py-4 first:pt-0 last:pb-0">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function SecurityTip({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-2.5">
      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
      <div>
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function QuickLink({ href, icon, title, description }: { href: string; icon: React.ReactNode; title: string; description: string }) {
  return (
    <Link href={href} className="group flex min-h-[92px] items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 transition group-hover:bg-sky-100">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-slate-900">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span>
      </span>
      <ArrowUpRight size={16} className="shrink-0 text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sky-700" />
    </Link>
  );
}
