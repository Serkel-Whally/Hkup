"use client";

import { ArrowRight, Clock3, Headset, Mail, MessageCircle, Phone, Send } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { DashboardShell } from "@/app/components/dashboard-shell";

const faqs = [
  ["How long does delivery take?", "Most bundles arrive within a few seconds after payment is confirmed."],
  ["Which payment methods are supported?", "You can pay with Mobile Money, card, wallet balance, or bank transfer."],
  ["What if my bundle has not arrived?", "Keep your transaction ID ready and contact our support team for help."],
];

export default function SupportPage() {
  const [messageSent, setMessageSent] = useState(false);
  const [messageError, setMessageError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const message = new FormData(form).get("message");
    setMessageError("");
    if (!message || String(message).trim().length < 10) {
      setMessageError("Please write a bit more detail so our team can help.");
      return;
    }
    setMessageSent(true);
    form.reset();
  }

  return (
    <DashboardShell active="/support">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <header>
          <p className="text-sm font-medium text-sky-600">We are here to help</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">Support Centre</h1>
          <p className="mt-2 text-sm text-slate-500">Get help with your account, payments, and data bundles.</p>
        </header>

        <section className="rounded-2xl bg-gradient-to-r from-sky-700 via-cyan-600 to-emerald-500 p-5 text-white shadow-[0_16px_34px_rgba(14,116,144,0.16)] md:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/15"><Headset size={25} /></span>
              <div><h2 className="text-xl font-semibold">Need a hand?</h2><p className="mt-1 max-w-md text-sm leading-6 text-cyan-50">Our support team is ready to help you resolve an issue.</p></div>
            </div>
            <a href="tel:+233200000000" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-sky-700 transition hover:bg-cyan-50"><Phone size={16} /> Call support</a>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-3" aria-label="Support contact options">
          <ContactCard icon={<MessageCircle size={19} />} title="Live chat" detail="Available now" href="/support/live-chat" />
          <ContactCard icon={<Mail size={19} />} title="Email us" detail="help@cellulite.data" href="mailto:help@cellulite.data" />
          <ContactCard icon={<Clock3 size={19} />} title="Response time" detail="Usually under 10 min" href="#faq" />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div id="faq" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)] md:p-6">
            <h2 className="text-lg font-semibold text-slate-900">Frequently asked questions</h2>
            <div className="mt-4 divide-y divide-slate-100">
              {faqs.map(([question, answer]) => <details key={question} className="group py-4 first:pt-0 last:pb-0"><summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-slate-900"><span>{question}</span><ArrowRight size={16} className="transition group-open:rotate-90" /></summary><p className="mt-2 text-sm leading-6 text-slate-500">{answer}</p></details>)}
            </div>
          </div>

          <form id="contact-form" onSubmit={handleSubmit} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)] md:p-6">
            <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-600"><Headset size={19} /></span><div><h2 className="text-lg font-semibold text-slate-900">Contact support</h2><p className="text-xs text-slate-500">We will get back to you shortly.</p></div></div>
            <label className="mt-5 block text-sm font-medium text-slate-700">Your message<textarea name="message" required minLength={10} maxLength={2000} rows={5} placeholder="Tell us how we can help..." className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" /></label>
            <button type="submit" className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 text-sm font-semibold text-white transition hover:bg-sky-500"><Send size={16} /> Send message</button>
            {messageSent && <p className="mt-3 text-sm font-medium text-emerald-600" role="status">Your message has been sent.</p>}
            {messageError && <p className="mt-3 text-sm font-medium text-rose-600" role="alert">{messageError}</p>}
          </form>
        </section>

      </div>
    </DashboardShell>
  );
}

function ContactCard({ icon, title, detail, href }: { icon: React.ReactNode; title: string; detail: string; href: string }) {
  return <Link href={href} className="flex min-h-20 items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-[0_6px_18px_rgba(15,23,42,0.03)] transition hover:border-sky-200 hover:bg-sky-50/30"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-600">{icon}</span><span><span className="block text-sm font-semibold text-slate-900">{title}</span><span className="mt-1 block text-xs text-slate-500">{detail}</span></span></Link>;
}
