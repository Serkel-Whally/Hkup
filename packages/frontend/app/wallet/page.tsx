"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownToLine, LoaderCircle, WalletCards } from "lucide-react";
import { DashboardShell } from "@/app/components/dashboard-shell";
import { authHeaders, clearAuthSession, getAuthSession } from "@/app/lib/auth";

type WalletEntry = {
  reference: string;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
};

export default function WalletPage() {
  const router = useRouter();
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<WalletEntry[]>([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [funding, setFunding] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadWallet = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/wallets`, { headers: authHeaders() });
      if (response.status === 401) {
        clearAuthSession();
        router.replace("/login?next=%2Fwallet");
        return;
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load wallet");
      setBalance(Number(data.balance));
      setTransactions(data.transactions || []);
      setError("");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load wallet");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!getAuthSession()?.token) {
      router.replace("/login?next=%2Fwallet");
      return;
    }
    void loadWallet();
  }, [loadWallet, router]);

  useEffect(() => {
    const reference = new URLSearchParams(window.location.search).get("reference");
    if (!reference || !getAuthSession()?.token) return;

    const verifyFunding = async () => {
      setNotice("");
      setError("");
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiUrl}/api/wallets/fund/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({ reference }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to verify wallet funding");
        setNotice("Wallet funding completed successfully.");
        await loadWallet();
      } catch (verifyError) {
        setError(verifyError instanceof Error ? verifyError.message : "Unable to verify wallet funding");
        await loadWallet();
      } finally {
        window.history.replaceState({}, "", "/wallet");
      }
    };

    void verifyFunding();
  }, [loadWallet]);

  const handleFunding = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFunding(true);
    setError("");
    setNotice("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/wallets/fund/initialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          amount: Number(amount),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to start wallet funding");
      if (!data.authorizationUrl) throw new Error("Payment provider did not return a checkout link");
      window.location.assign(data.authorizationUrl);
    } catch (fundingError) {
      setError(fundingError instanceof Error ? fundingError.message : "Unable to start wallet funding");
      setFunding(false);
    }
  };

  return (
    <DashboardShell active="/wallet">
      <main className="mx-auto max-w-5xl space-y-6">
        <header>
          <p className="text-sm font-semibold text-sky-600">Your account</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Wallet</h1>
          <p className="mt-2 text-sm text-slate-600">View your available balance and securely add funds.</p>
        </header>

        {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">{error}</p> : null}
        {notice ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">{notice}</p> : null}

        <section className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-2xl bg-gradient-to-br from-sky-700 to-cyan-500 p-6 text-white shadow-sm sm:p-8">
            <div className="flex items-center gap-2 text-sm text-white/85"><WalletCards size={18} /> Available balance</div>
            <p className="mt-4 text-3xl font-bold tracking-tight">
              {loading ? "Loading..." : balance === null ? "Unavailable" : `GH₵ ${balance.toFixed(2)}`}
            </p>
            <p className="mt-2 text-sm text-white/80">Only verified wallet funding is included in this balance.</p>
          </div>

          <form onSubmit={handleFunding} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <h2 className="font-semibold text-slate-900">Fund wallet</h2>
              <p className="mt-1 text-sm text-slate-500">Choose an amount and complete payment with Paystack.</p>
            </div>
            <div>
              <label htmlFor="funding-amount" className="block text-sm font-medium text-slate-700">Amount (GHS)</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {[20, 50, 100, 200].map((preset) => (
                  <button key={preset} type="button" onClick={() => setAmount(String(preset))} aria-pressed={amount === String(preset)} className={`rounded-lg border px-3 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${amount === String(preset) ? "border-sky-500 bg-sky-50 text-sky-700" : "border-slate-200 bg-white text-slate-600 hover:border-sky-300"}`}>
                    GH₵ {preset}
                  </button>
                ))}
              </div>
            </div>
            <input
              id="funding-amount"
              type="number"
              min="0.01"
              step="0.01"
              inputMode="decimal"
              required
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              placeholder="e.g. 50.00"
              aria-describedby="funding-hint"
            />
            <p id="funding-hint" className="text-xs leading-5 text-slate-500">Enter the amount you want to add. Your balance updates after payment verification.</p>
            <button
              type="submit"
              disabled={funding || !amount || Number(amount) <= 0}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {funding ? <LoaderCircle size={17} className="animate-spin" /> : <ArrowDownToLine size={17} />}
              {funding ? "Starting payment..." : "Continue to payment"}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-4">
            <h2 className="font-semibold text-slate-900">Wallet activity</h2>
            <p className="mt-1 text-sm text-slate-500">Recent funding activity and its verification status.</p>
          </div>
          {loading ? (
            <p className="py-8 text-center text-sm text-slate-500" role="status">Loading wallet activity...</p>
          ) : transactions.length ? (
            <ul className="divide-y divide-slate-100">
              {transactions.map((transaction) => (
                <li key={transaction.reference} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-1 last:pb-1">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">Wallet funding</p>
                    <p className="mt-1 text-xs text-slate-500">{transaction.reference} · {new Intl.DateTimeFormat("en-GH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(transaction.createdAt))}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">GH₵ {Number(transaction.amount).toFixed(2)}</p>
                    <p className={`mt-1 text-xs font-semibold ${transaction.status === "COMPLETED" ? "text-emerald-700" : transaction.status === "FAILED" ? "text-rose-700" : "text-amber-700"}`}>
                      {transaction.status}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-8 text-center text-sm text-slate-500">No wallet activity yet.</p>
          )}
        </section>
      </main>
    </DashboardShell>
  );
}
