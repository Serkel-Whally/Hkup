"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, BadgeHelp, ChevronDown, CircleAlert, CreditCard, Headphones, LockKeyhole, PackageCheck, Search, Wallet } from "lucide-react";
import { ThemeToggle } from "../components/theme-toggle";

const topics = [
  { title: "I paid but my order has not updated", detail: "First, check the transaction status in your account. If the payment provider confirms a charge but the order remains unchanged, keep the order reference, amount, payment date and provider confirmation for investigation. Avoid paying again until the original payment status is clear." },
  { title: "My data bundle has not arrived", detail: "Open the relevant transaction and review its order status. Confirm that the recipient number and network were entered correctly. Keep the order reference so the operator can investigate the delivery status." },
  { title: "I entered the wrong phone number", detail: "Check the order details immediately. Do not assume a submitted order can be edited or reversed. Keep the order reference and contact the service operator through an officially published support channel when one is available." },
  { title: "How do I find my order reference?", detail: "Sign in using the account used for the purchase, open Transactions and select the relevant order. The reference helps identify the payment and order during an investigation." },
];

const quickLinks = [
  { title: "Track an order", description: "Review payment and delivery status.", href: "/transactions", icon: PackageCheck },
  { title: "Wallet", description: "Review your wallet balance and activity.", href: "/wallet", icon: Wallet },
  { title: "Browse bundles", description: "Find a bundle before placing an order.", href: "/bundles", icon: Search },
];

export default function SupportPage() {
  const [query, setQuery] = useState("");
  const [openTopic, setOpenTopic] = useState<number | null>(0);
  const filteredTopics = topics.filter((topic) => (topic.title + " " + topic.detail).toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <header className="border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
        <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 transition hover:text-sky-700 dark:text-slate-200 dark:hover:text-cyan-400">
            <ArrowLeft size={17} /> <span className="hidden sm:inline">Back to CelluLite</span><span className="sm:hidden">Home</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-semibold text-slate-500 dark:text-slate-400 sm:inline">Help centre</span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-7 sm:px-6 sm:pt-10 lg:px-8">
        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-sky-800 via-sky-700 to-cyan-600 px-5 py-8 text-white shadow-lg shadow-sky-950/10 sm:px-9 sm:py-10">
          <div aria-hidden="true" className="absolute -right-20 -top-28 h-72 w-72 rounded-full border-[38px] border-white/10" />
          <div aria-hidden="true" className="absolute -bottom-32 right-24 h-64 w-64 rounded-full border-[30px] border-white/[0.07]" />
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-sky-50"><Headphones size={14} /> CelluLite help centre</span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">How can we help?</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-sky-50 sm:text-base">Find guidance for your orders, payments and data bundles. Search common questions or jump straight to the part of your account you need.</p>
            <label className="mt-6 flex min-h-12 max-w-xl items-center gap-3 rounded-2xl bg-white px-4 text-slate-500 shadow-lg shadow-sky-950/10 focus-within:ring-4 focus-within:ring-white/25">
              <Search size={19} className="shrink-0" />
              <span className="sr-only">Search support questions</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search payments, orders, delivery…" className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400" />
              {query && <button type="button" onClick={() => setQuery("")} className="text-xs font-bold text-sky-700">Clear</button>}
            </label>
          </div>
        </section>

        <section className="mt-9" aria-labelledby="quick-help-heading">
          <div className="mb-4"><p className="text-xs font-bold uppercase tracking-[0.15em] text-sky-700 dark:text-cyan-400">Quick access</p><h2 id="quick-help-heading" className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">What do you need help with?</h2></div>
          <div className="grid gap-3 sm:grid-cols-3">
            {quickLinks.map(({ title, description, href, icon: Icon }) => <Link key={href} href={href} className="group flex min-h-[116px] items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-800">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-cyan-300"><Icon size={20} /></span>
              <span className="min-w-0 flex-1"><span className="block font-bold text-slate-900 dark:text-white">{title}</span><span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{description}</span><span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-sky-700 group-hover:gap-2 dark:text-cyan-400">Open <ArrowRight size={13} /></span></span>
            </Link>)}
          </div>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10">
          <div>
            <div className="mb-4"><p className="text-xs font-bold uppercase tracking-[0.15em] text-sky-700 dark:text-cyan-400">Help topics</p><h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">Frequently asked questions</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Answers to common order and payment questions.</p></div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              {filteredTopics.length ? filteredTopics.map((topic) => {
                const index = topics.indexOf(topic);
                const isOpen = openTopic === index;
                return <div key={topic.title} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                  <button type="button" aria-expanded={isOpen} onClick={() => setOpenTopic(isOpen ? null : index)} className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500 dark:hover:bg-slate-800/60 sm:px-5">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{topic.title}</span><ChevronDown size={18} className={`shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && <p className="px-4 pb-5 text-sm leading-6 text-slate-600 dark:text-slate-300 sm:px-5">{topic.detail}</p>}
                </div>;
              }) : <div className="px-5 py-10 text-center"><BadgeHelp className="mx-auto text-slate-400" size={25} /><p className="mt-3 font-bold text-slate-800 dark:text-slate-100">No matching help topics</p><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try a different search term.</p><button type="button" onClick={() => setQuery("")} className="mt-3 text-sm font-bold text-sky-700 dark:text-cyan-400">Clear search</button></div>}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/70 dark:bg-amber-950/30">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300"><CircleAlert size={18} /><h3 className="text-sm font-extrabold">Payment safety</h3></div>
              <p className="mt-3 text-sm leading-6 text-amber-900/80 dark:text-amber-100/80">If a payment is pending, check its status before trying again. This helps avoid accidental duplicate payments.</p>
              <p className="mt-3 text-xs font-semibold leading-5 text-amber-900/80 dark:text-amber-100/80">Never share your password, one-time passcode, Mobile Money PIN or full card details.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"><LockKeyhole size={19} /></span>
              <h3 className="mt-3 font-bold text-slate-900 dark:text-white">Need help with an order?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Sign in to find your transaction reference, payment details and order status.</p>
              <Link href="/login" className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">Sign in <ArrowRight size={15} /></Link>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200"><CreditCard size={18} /><h3 className="text-sm font-bold">Official support channels</h3></div>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Support contact details have not yet been published. Please use the guidance here and do not send sensitive account or payment information through unofficial channels.</p>
            </div>
          </aside>
        </section>

        <footer className="mt-12 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-500 dark:text-slate-400">CelluLite Bundle · Help centre</p>
          <div className="flex flex-wrap gap-5 font-semibold"><Link href="/privacy" className="text-slate-600 hover:text-sky-700 dark:text-slate-300 dark:hover:text-cyan-400">Privacy</Link><Link href="/terms" className="text-slate-600 hover:text-sky-700 dark:text-slate-300 dark:hover:text-cyan-400">Terms</Link><Link href="/" className="text-slate-600 hover:text-sky-700 dark:text-slate-300 dark:hover:text-cyan-400">Home</Link></div>
        </footer>
      </div>
    </main>
  );
}
