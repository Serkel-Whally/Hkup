"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ReceiptText } from "lucide-react";
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
    network: order.network,
    bundle: `${order.bundleSize} Data Bundle`,
    validity: order.validity,
    amount: `GH₵ ${Number(order.amount).toFixed(2)}`,
    datetime: new Intl.DateTimeFormat("en-GH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(order.createdAt)),
    status: getOrderLabel(order),
  })), [orders]);

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

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6" aria-label="Transaction history">
          {loading ? (
            <p className="py-12 text-center text-sm text-slate-500" role="status">Loading transactions...</p>
          ) : error ? (
            <p className="py-12 text-center text-sm text-rose-700" role="alert">{error}</p>
          ) : transactions.length ? (
            <ul className="space-y-3">
              {transactions.map((transaction, index) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  href={`/transactions/${encodeURIComponent(orders[index].orderId)}`}
                />
              ))}
            </ul>
          ) : (
            <div className="py-12 text-center">
              <ReceiptText className="mx-auto text-slate-400" size={32} aria-hidden="true" />
              <h2 className="mt-3 font-semibold text-slate-900">No transactions yet</h2>
              <p className="mt-1 text-sm text-slate-500">Your data purchases will appear here.</p>
            </div>
          )}
        </section>
      </main>
    </DashboardShell>
  );
}
