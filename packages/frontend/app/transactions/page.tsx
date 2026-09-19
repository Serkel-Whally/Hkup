"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { DashboardShell } from "@/app/components/dashboard-shell";
import TransactionItem from "@/app/components/transaction-item";

type Filter = "All" | "Successful" | "Processing" | "Failed";

type Order = {
  id: string;
  reference: string;
  network: string;
  bundleSize: string;
  validity: string;
  recipientPhone: string;
  amount: string;
  paymentStatus: string;
  deliveryStatus: string;
  createdAt: string;
};

const FILTER_OPTIONS: Filter[] = ["All", "Successful", "Processing", "Failed"];

function displayStatus(order: Order) {
  const paymentStatus = String(order.paymentStatus ?? "").toUpperCase();
  const deliveryStatus = String(order.deliveryStatus ?? "").toUpperCase();

  if (paymentStatus === "FAILED" || deliveryStatus === "FAILED") return "Failed";
  if (paymentStatus === "PAID" && deliveryStatus === "DELIVERED") return "Successful";
  return "Processing";
}

function displayAmount(amount: string) {
  const normalized = amount.trim();
  return normalized.startsWith("GH₵") ? normalized : `GH₵ ${normalized}`;
}

function displayDate(createdAt: string) {
  return new Intl.DateTimeFormat("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(createdAt));
}

export default function TransactionsPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState<Filter>("All");

  useEffect(() => {
    const loadOrders = () => {
      if (!session?.user) {
        setError("Please sign in to view your transactions.");
        setOrders([]);
        setLoading(false);
        return;
      }

      setError("");
      setOrders([]);
      setLoading(false);
    };

    loadOrders();
  }, [session]);

  const filteredOrders = useMemo(() => {
    if (activeFilter === "All") return orders;
    return orders.filter((order) => displayStatus(order) === activeFilter);
  }, [activeFilter, orders]);

  return (
    <DashboardShell active="/transactions">
      <div className="mx-auto w-full max-w-3xl pb-16 md:pb-20">
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTER_OPTIONS.map((option) => {
            const active = activeFilter === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setActiveFilter(option)}
                className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-sky-50 text-sky-700 ring-1 ring-sky-100"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                aria-pressed={active}
              >
                {option}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="rounded-[20px] border border-slate-100 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
            Loading transactions...
          </div>
        ) : error ? (
          <div className="rounded-[20px] border border-rose-100 bg-rose-50 p-6 text-center text-sm text-rose-700">
            {error}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[24px] border border-slate-100 bg-white px-6 py-8 text-center shadow-sm">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 text-sky-600">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-8 w-8" aria-hidden="true">
                <path d="M7 3.5h7l4 4V18a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 3.5V8h4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 12h8M8 15h6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900">No transactions yet</h2>
            <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
              Your data purchases will appear here once you make a transaction.
            </p>
          </div>
        ) : (
          <ul className="space-y-3" role="list">
            {filteredOrders.map((order) => (
              <TransactionItem
                key={order.id}
                href={`/transactions/${order.id}`}
                transaction={{
                  id: order.id,
                  network: order.network,
                  bundle: `${order.bundleSize} Data Bundle`,
                  amount: displayAmount(order.amount),
                  datetime: displayDate(order.createdAt),
                  status: displayStatus(order),
                  validity: order.validity,
                }}
              />
            ))}
          </ul>
        )}

        {filteredOrders.length > 0 && (
          <div className="mt-8 pb-8 text-center">
            <p className="text-base font-medium text-slate-900">That&apos;s all for now!</p>
            <p className="mt-1 text-sm text-slate-500">Your recent transactions are shown above.</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
