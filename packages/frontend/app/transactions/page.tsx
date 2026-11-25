"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ReceiptText, Search } from "lucide-react";
import { DashboardShell } from "@/app/components/dashboard-shell";
import TransactionItem from "@/app/components/transaction-item";
import { authHeaders, clearAuthSession, getAuthSession } from "@/app/lib/auth";

type Order = {
  orderId: string;
  network: string;
  bundleSize: string;
  validity: string;
  recipientPhone: string;
  amount: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
};

function getOrderLabel(order: Order) {
  if (order.orderStatus === "REFUNDED" || order.paymentStatus === "REFUNDED") return "Refunded";
  if (order.paymentStatus === "FAILED" || ["FAILED", "CANCELLED"].includes(order.orderStatus)) return "Failed";
  if (order.orderStatus === "COMPLETED") return "Successful";
  return "Processing";
}

export default function TransactionsPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Successful" | "Processing" | "Failed" | "Refunded">("All");

  useEffect(() => {
    if (!getAuthSession()?.token) {
      router.replace("/login?next=%2Ftransactions");
      return;
    }

    const loadOrders = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiUrl}/api/orders`, { headers: authHeaders() });
        if (response.status === 401) {
          clearAuthSession();
          router.replace("/login?next=%2Ftransactions");
          return;
        }
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load transactions");
        setOrders(data.orders || []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load transactions");
      } finally {
        setLoading(false);
      }
    };

    void loadOrders();
  }, [router]);

  const transactions = useMemo(() => orders.map((order) => ({
    id: order.orderId,
    recipient: order.recipientPhone,
    network: order.network,
    bundle: `${order.bundleSize} Data Bundle`,
    validity: order.validity,
    amount: `GH₵ ${Number(order.amount).toFixed(2)}`,
    datetime: new Intl.DateTimeFormat("en-GH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(order.createdAt)),
    status: getOrderLabel(order),
  })), [orders]);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesStatus = statusFilter === "All" || transaction.status === statusFilter;
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || [transaction.id, transaction.network, transaction.bundle, transaction.recipient, transaction.amount].some((value) => String(value || "").toLowerCase().includes(term));
    return matchesStatus && matchesSearch;
  });

  return (
    <DashboardShell active="/transactions">
      <main className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-sky-600">Account activity</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Transactions</h1>
            <p className="mt-2 text-sm text-slate-600">Track payments and data bundle orders made on your account.</p>
          </div>
          <Link href="/buy-data" className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700">
            Buy data <ArrowRight size={16} />
          </Link>
        </header>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-label="Transaction history">
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">Your activity</h2>
                <p className="mt-1 text-xs text-slate-500">{loading ? "Loading your orders..." : `${filteredTransactions.length} of ${transactions.length} transactions`}</p>
              </div>
              <label className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-sky-300 focus-within:ring-2 focus-within:ring-sky-100 sm:w-72">
                <Search size={17} className="shrink-0 text-slate-400" aria-hidden="true" />
                <span className="sr-only">Search transactions</span>
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search order, network or number" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" />
              </label>
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Filter transactions by status">
              {(["All", "Successful", "Processing", "Failed", "Refunded"] as const).map((status) => (
                <button key={status} type="button" onClick={() => setStatusFilter(status)} aria-pressed={statusFilter === status} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${statusFilter === status ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                  {status}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 sm:p-5">
          {loading ? (
            <p className="py-12 text-center text-sm text-slate-500" role="status">Loading transactions...</p>
          ) : error ? (
            <p className="py-12 text-center text-sm text-rose-700" role="alert">{error}</p>
          ) : filteredTransactions.length ? (
            <ul className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  href={`/transactions/${encodeURIComponent(transaction.id)}`}
                />
              ))}
            </ul>
          ) : transactions.length ? (
            <div className="py-12 text-center">
              <Search className="mx-auto text-slate-400" size={30} aria-hidden="true" />
              <h2 className="mt-3 font-semibold text-slate-900">No matching transactions</h2>
              <p className="mt-1 text-sm text-slate-500">Try another search term or status filter.</p>
              <button type="button" onClick={() => { setSearch(""); setStatusFilter("All"); }} className="mt-4 text-sm font-semibold text-sky-700 hover:text-sky-800">Clear filters</button>
            </div>
          ) : (
            <div className="py-12 text-center">
              <ReceiptText className="mx-auto text-slate-400" size={32} aria-hidden="true" />
              <h2 className="mt-3 font-semibold text-slate-900">No transactions yet</h2>
              <p className="mt-1 text-sm text-slate-500">Your data purchases will appear here.</p>
            </div>
          )}
          </div>
        </section>
      </main>
    </DashboardShell>
  );
}
