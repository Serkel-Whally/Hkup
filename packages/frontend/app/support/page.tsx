"use client";

import Link from "next/link";
import { ArrowRight, Headphones, MessageCircleMore, ShieldCheck, Smartphone, Sparkles } from "lucide-react";
import { DashboardShell } from "@/app/components/dashboard-shell";

export default function SupportPage() {
  return (
    <DashboardShell active="/support">
      <main className="mx-auto max-w-6xl space-y-6 pb-8">
        <section className="rounded-[28px] border border-slate-200 bg-gradient-to-r from-sky-50 via-white to-emerald-50 p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-600">Support</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">We’re here to help</h1>
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
            >
              <MessageCircleMore size={16} /> Chat on WhatsApp
            </button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <SupportStat
            icon={<Headphones size={18} />}
            title="Quick help"
            value="24/7"
            text="Customer support for purchase and delivery issues."
          />
          <SupportStat
            icon={<Smartphone size={18} />}
            title="Delivery status"
            value="Live"
            text="Track your order and confirm bundle delivery updates."
          />
          <SupportStat
            icon={<ShieldCheck size={18} />}
            title="Secure support"
            value="Verified"
            text="Your account and transactions remain protected."
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Popular help topics</h2>
              <Sparkles size={18} className="text-sky-600" />
            </div>

            <div className="space-y-3">
              {[
                "How do I buy a data bundle?",
                "Why is my bundle delivery pending?",
                "How do I fund my wallet?",
                "Can I buy for another person?",
              ].map((question) => (
                <button
                  key={question}
                  type="button"
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-sky-200 hover:bg-sky-50/50"
                >
                  <span className="font-medium text-slate-900">{question}</span>
                  <ArrowRight size={16} className="text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-xl font-semibold text-slate-900">Contact options</h2>

              <div className="mt-5 space-y-3">
                <ContactItem
                  title="WhatsApp support"
                  detail="+233 24 000 0000"
                  accent="bg-emerald-100 text-emerald-700"
                />
                <ContactItem
                  title="Email support"
                  detail="support@cellulitedata.com"
                  accent="bg-sky-100 text-sky-700"
                />
                <ContactItem
                  title="Business hours"
                  detail="Mon - Sat • 8:00am - 8:00pm"
                  accent="bg-slate-100 text-slate-700"
                />
              </div>
            </div>

            <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900">Need immediate help?</h2>
              <p className="mt-2 text-sm text-slate-600">
                Use WhatsApp for urgent order problems, payment issues, or delivery follow-ups.
              </p>
              <Link
                href="/dashboard"
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Back to dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>
    </DashboardShell>
  );
}

function SupportStat({
  icon,
  title,
  value,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  text: string;
}) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
        {icon}
      </div>
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{text}</p>
    </div>
  );
}

function ContactItem({
  title,
  detail,
  accent,
}: {
  title: string;
  detail: string;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className={`rounded-xl p-2 ${accent}`}>
        <MessageCircleMore size={16} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="mt-1 font-semibold text-slate-900">{detail}</p>
      </div>
    </div>
  );
}
