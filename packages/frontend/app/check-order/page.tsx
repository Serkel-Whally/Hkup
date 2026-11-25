"use client";

import Image from "next/image";
import { Suspense } from "react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, ClipboardCheck, LockKeyhole, Search, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "../components/theme-toggle";
import { authHeaders, clearAuthSession, getAuthSession } from "../lib/auth";

function CheckOrderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setReference(searchParams.get("reference") || "");
  }, [searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const orderReference = reference.trim().toUpperCase();
    if (!orderReference) {
      setError("Enter your order reference to continue.");
      return;
    }
    if (orderReference.length > 100) {
      setError("That order reference looks too long. Check it and try again.");
      return;
    }

    if (!getAuthSession()?.token) {
      router.push(`/login?next=${encodeURIComponent(`/check-order?reference=${orderReference}`)}`);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/orders/${encodeURIComponent(orderReference)}`, {
        headers: authHeaders(),
        cache: "no-store",
      });
      if (response.status === 401) {
        clearAuthSession();
        router.replace(`/login?next=${encodeURIComponent(`/check-order?reference=${orderReference}`)}`);
        return;
      }
      if (response.status === 404) {
        throw new Error("We couldn't find that order in this account. Check the reference or sign in with the account used to place the order.");
      }
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "We couldn't check this order right now. Please try again.");
      router.push(`/transactions/${encodeURIComponent(data.orderId || orderReference)}`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "We couldn't check this order right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <header className="border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
        <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
            <Image src="/cellulite_logo_icon.svg" alt="" width={32} height={32} />
            <span className="text-sm font-extrabold tracking-tight text-slate-950 dark:text-white">CelluLite <span className="text-sky-600 dark:text-cyan-400">Bundle</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/support" className="hidden text-sm font-semibold text-slate-600 hover:text-sky-700 dark:text-slate-300 sm:inline">Help centre</Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto grid min-h-[calc(100vh-68px)] max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(320px,0.82fr)] lg:px-8">
        <section className="max-w-xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-sky-700 dark:text-slate-400 dark:hover:text-cyan-400">
            <ArrowLeft size={16} /> Back to home
          </Link>
          <div className="mt-9 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-cyan-300">
            <ClipboardCheck size={23} />
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.17em] text-sky-700 dark:text-cyan-400">Order tracking</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-4xl">Check your order</h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-slate-600 dark:text-slate-300">
            Enter the reference from your order confirmation to open its latest payment and delivery updates.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_-35px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <label htmlFor="order-reference" className="block text-sm font-semibold text-slate-800 dark:text-slate-100">Order reference</label>
            <div className="mt-2 flex min-h-14 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 transition focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:focus-within:ring-sky-950">
              <Search size={18} className="shrink-0 text-slate-400" aria-hidden="true" />
              <input id="order-reference" name="reference" autoComplete="off" autoCapitalize="characters" spellCheck={false} value={reference} onChange={(event) => { setReference(event.target.value); setError(""); }} placeholder="e.g. HKUP-…" maxLength={100} required className="min-w-0 flex-1 bg-transparent text-sm font-semibold tracking-wide text-slate-900 outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 dark:text-white" />
            </div>
            {error ? <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm leading-5 text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-300" role="alert">{error}</p> : null}
            <button type="submit" disabled={loading || !reference.trim()} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 text-sm font-bold text-white shadow-lg shadow-sky-600/15 transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55 dark:focus-visible:ring-offset-slate-900">
              {loading ? "Checking order…" : "Find my order"} {!loading ? <ArrowRight size={17} /> : null}
            </button>
            <div className="mt-4 flex items-start gap-2.5 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <LockKeyhole size={15} className="mt-0.5 shrink-0 text-sky-600 dark:text-cyan-400" />
              <span>For your privacy, order details are only available after signing in to the account that placed the order.</span>
            </div>
          </form>

          <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
            Don’t have your reference? <Link href="/login?next=%2Ftransactions" className="font-semibold text-sky-700 hover:underline dark:text-cyan-400">Sign in to view your transactions</Link>.
          </p>
        </section>

        <aside className="relative hidden md:block">
          <div className="absolute -inset-8 rounded-[40px] bg-gradient-to-br from-sky-200/70 via-cyan-100/50 to-emerald-100/60 blur-2xl dark:from-sky-900/30 dark:via-cyan-900/20 dark:to-emerald-900/20" />
          <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-sky-800 via-sky-700 to-cyan-600 p-8 text-white shadow-xl shadow-sky-950/15">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10"><ShieldCheck size={24} /></div>
            <h2 className="mt-8 text-2xl font-bold tracking-tight">A clear view of every step.</h2>
            <p className="mt-3 text-sm leading-6 text-sky-50">Your order details show whether payment is pending, confirmed, or whether data delivery has been completed.</p>
            <div className="mt-8 space-y-3">
              {[
                ["01", "Order created", "Your purchase reference is recorded."],
                ["02", "Payment confirmed", "The payment status is updated."],
                ["03", "Data delivery", "The order status reflects fulfilment."],
              ].map(([number, title, detail]) => (
                <div key={number} className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/10 p-3.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/15 text-xs font-bold">{number}</span>
                  <span><span className="block text-sm font-bold">{title}</span><span className="mt-1 block text-xs leading-5 text-sky-100">{detail}</span></span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default function CheckOrderPage() {
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-medium text-slate-500 dark:bg-slate-950 dark:text-slate-400">Loading order lookup…</main>}>
      <CheckOrderContent />
    </Suspense>
  );
}
