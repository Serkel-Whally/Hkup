import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock3,
  LockKeyhole,
  Smartphone,
  WalletCards,
} from "lucide-react";
import { FooterLinks } from "./components/footer-links";
import { ThemeToggle } from "./components/theme-toggle";

const networks = [
  { name: "MTN", logo: "/mtn.svg", tone: "bg-amber-50 ring-amber-100" },
  { name: "Telecel", logo: "/Telecel_Group.png", tone: "bg-rose-50 ring-rose-100" },
  { name: "AirtelTigo", logo: "/airtel.svg", tone: "bg-blue-50 ring-blue-100" },
];

const steps = [
  {
    number: "01",
    title: "Choose a network",
    description: "Browse available bundles for MTN, Telecel or AirtelTigo.",
    icon: Smartphone,
  },
  {
    number: "02",
    title: "Add the recipient",
    description: "Enter the phone number that should receive the data.",
    icon: CheckCircle2,
  },
  {
    number: "03",
    title: "Pay and follow your order",
    description: "Complete payment and check the order status from your account.",
    icon: WalletCards,
  },
];

const benefits = [
  {
    title: "One place for three networks",
    description: "Compare the available bundle options without switching between network apps.",
    icon: Smartphone,
  },
  {
    title: "Payment you can follow",
    description: "Payment verification and order updates help you understand what is happening with a purchase.",
    icon: LockKeyhole,
  },
  {
    title: "Your activity stays organised",
    description: "Return to your account to review wallet activity and previous data orders.",
    icon: Clock3,
  },
];

const faqs = [
  {
    question: "Can I send data to another phone number?",
    answer: "Yes. Enter the recipient's number during checkout. It does not have to be the phone number used for your account.",
  },
  {
    question: "Which networks can I buy data for?",
    answer: "You can browse bundles for MTN, Telecel and AirtelTigo, subject to the bundles currently available in the catalogue.",
  },
  {
    question: "How can I check my order?",
    answer: "Sign in and open Transactions to view the payment and order status for your purchases.",
  },
];

export default function LandingPage() {
  return (
    <main id="main-content" className="min-h-screen overflow-hidden bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex min-w-0 items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500" aria-label="CelluLite Bundle home">
            <Image src="/cellulite_logo_icon.svg" alt="" width={38} height={38} priority className="h-9 w-9 object-contain" />
            <span className="truncate text-base font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-lg">CelluLite <span className="text-sky-600 dark:text-cyan-400">Bundle</span></span>
          </Link>

          <nav className="flex items-center gap-1.5 sm:gap-3" aria-label="Main navigation">
            <Link href="#how-it-works" className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white sm:inline-flex">How it works</Link>
            <Link href="#networks" className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white sm:inline-flex">Networks</Link>
            <ThemeToggle />
            <Link href="/login" className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">Log in</Link>
            <Link href="/signup" className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-sky-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-sky-600/20 transition hover:bg-sky-700 sm:px-4">Get started <ArrowUpRight size={15} aria-hidden="true" /></Link>
          </nav>
        </div>
      </header>

      <section className="relative isolate">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(ellipse_at_15%_15%,rgba(14,165,233,0.13),transparent_45%),radial-gradient(ellipse_at_90%_35%,rgba(16,185,129,0.10),transparent_40%)] dark:bg-[radial-gradient(ellipse_at_15%_15%,rgba(14,165,233,0.16),transparent_45%),radial-gradient(ellipse_at_90%_35%,rgba(16,185,129,0.10),transparent_40%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 md:grid-cols-[1.04fr_0.96fr] md:gap-10 md:pb-24 md:pt-24 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3.5 py-1.5 text-xs font-bold tracking-wide text-sky-800 shadow-sm dark:border-sky-900 dark:bg-slate-900/80 dark:text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              DATA BUNDLES, MADE SIMPLE
            </div>
            <h1 className="mt-6 text-[2.65rem] font-extrabold leading-[1.08] tracking-[-0.045em] text-slate-950 dark:text-white sm:text-5xl lg:text-[3.7rem]">
              Your data. Your people. <span className="text-sky-600 dark:text-cyan-400">One easy place.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-8">
              Find data bundles across Ghana's major networks, send data to the number that needs it, and keep track of your orders from one account.
            </p>
            <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row">
              <Link href="/signup" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-600/20 transition hover:-translate-y-0.5 hover:bg-sky-700">
                Create your account <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link href="/buy-data" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white/80 px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-sky-800 dark:hover:bg-slate-900">
                Explore bundles
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-600" /> Clear order updates</span>
              <span className="inline-flex items-center gap-1.5"><LockKeyhole size={15} className="text-sky-600" /> Verified payments</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[510px]">
            <div aria-hidden="true" className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-sky-200/60 via-cyan-100/30 to-emerald-200/60 blur-2xl dark:from-sky-900/30 dark:via-cyan-900/10 dark:to-emerald-900/30" />
            <div className="relative rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.28)] dark:border-slate-700 dark:bg-slate-900 sm:p-6">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-cyan-300"><Smartphone size={18} /></div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">A simpler way to buy data</p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">A quick look at the process</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">3 easy steps</span>
              </div>

              <div id="networks" className="pt-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Choose your network</p>
                <div className="mt-3 grid grid-cols-3 gap-2.5">
                  {networks.map((network) => (
                    <div key={network.name} className={`flex min-w-0 flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 px-2 py-4 dark:border-slate-700 dark:bg-slate-800/70`}>
                      <span className={`flex h-12 w-12 items-center justify-center rounded-xl ring-1 ${network.tone}`}>
                        <Image src={network.logo} alt={network.name} width={40} height={40} className="h-9 w-9 object-contain" />
                      </span>
                      <span className="truncate text-xs font-bold text-slate-700 dark:text-slate-200">{network.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-white dark:bg-slate-800 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-300">Made for sharing</p>
                    <p className="mt-1 text-lg font-bold tracking-tight">Send data to any number</p>
                  </div>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-cyan-300"><ArrowUpRight size={22} /></div>
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                  <Smartphone size={16} className="shrink-0 text-slate-300" />
                  <span className="text-sm text-slate-300">Recipient's phone number</span>
                  <span className="ml-auto text-xs font-semibold text-emerald-300">Your choice</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                  <LockKeyhole size={17} className="text-sky-600 dark:text-cyan-400" />
                  <p className="mt-2 text-xs font-bold text-slate-800 dark:text-slate-100">Payment verification</p>
                  <p className="mt-1 text-[11px] leading-4 text-slate-500 dark:text-slate-400">Payment status checked before confirmation.</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                  <Clock3 size={17} className="text-emerald-600 dark:text-emerald-400" />
                  <p className="mt-2 text-xs font-bold text-slate-800 dark:text-slate-100">Order tracking</p>
                  <p className="mt-1 text-[11px] leading-4 text-slate-500 dark:text-slate-400">See updates from your account.</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-3 hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg dark:border-slate-700 dark:bg-slate-900 sm:flex">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"><CheckCircle2 size={17} /></span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Simple from start to finish</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/60" aria-labelledby="network-title">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-700 dark:text-cyan-400">Your network, your choice</p>
            <h2 id="network-title" className="mt-1 text-lg font-bold tracking-tight text-slate-900 dark:text-white">Browse bundles across Ghana's major networks</h2>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {networks.map((network) => (
              <div key={network.name} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                <Image src={network.logo} alt="" width={24} height={24} className="h-6 w-6 object-contain" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{network.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-700 dark:text-cyan-400">How it works</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Three steps. No guesswork.</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">From choosing a bundle to checking its status, the important details stay easy to find.</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <article key={step.number} className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg hover:shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-900">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold tracking-widest text-sky-600 dark:text-cyan-400">{step.number}</span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-cyan-300"><Icon size={20} /></span>
                </div>
                <h3 className="mt-6 text-lg font-bold text-slate-900 dark:text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{step.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-slate-50 py-16 dark:bg-slate-900/60 sm:py-20" aria-labelledby="benefits-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-start">
            <div className="max-w-md">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-700 dark:text-cyan-400">Built around what matters</p>
              <h2 id="benefits-title" className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Less friction. More clarity.</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">A straightforward experience for buying data, making payments and keeping up with your account.</p>
              <Link href="/signup" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-700">Get started <ArrowRight size={16} /></Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <article key={benefit.title} className={`rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 ${index === 0 ? "sm:col-span-2" : ""}`}>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-cyan-300"><Icon size={19} /></span>
                    <h3 className="mt-4 font-bold text-slate-900 dark:text-white">{benefit.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{benefit.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="faq-title">
        <div className="grid gap-8 md:grid-cols-[0.7fr_1.3fr]">
          <div>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-cyan-300"><CircleHelp size={21} /></span>
            <h2 id="faq-title" className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">Good to know.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">A few quick answers before you get started.</p>
            <Link href="/support" className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-sky-700 hover:text-sky-800 dark:text-cyan-400">Visit support <ArrowUpRight size={15} /></Link>
          </div>
          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-5 dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-bold text-slate-900 marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-white">
                  {faq.question}
                  <ChevronDown size={18} className="shrink-0 text-slate-500 transition group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="mt-3 max-w-2xl pr-7 text-sm leading-6 text-slate-600 dark:text-slate-300">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-700 via-sky-600 to-cyan-500 px-6 py-10 text-white shadow-xl shadow-sky-900/15 sm:px-10 sm:py-12">
          <div aria-hidden="true" className="absolute -right-12 -top-24 h-72 w-72 rounded-full border-[36px] border-white/10" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-100">Ready when you are</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Make your next data purchase simpler.</h2>
              <p className="mt-3 text-sm leading-6 text-sky-50 sm:text-base">Create an account and keep your bundles, payments and order history together.</p>
            </div>
            <Link href="/signup" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-extrabold text-sky-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-50">Create account <ArrowRight size={17} /></Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image src="/cellulite_logo_icon.svg" alt="" width={32} height={32} className="h-8 w-8 object-contain" />
              <span className="font-extrabold tracking-tight text-slate-900 dark:text-white">CelluLite Bundle</span>
            </Link>
            <FooterLinks />
          </div>
          <div className="mt-7 flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} CelluLite Bundle. All rights reserved.</p>
            <p>Simple data purchases for Ghana.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
