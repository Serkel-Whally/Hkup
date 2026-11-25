"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { DashboardShell } from "@/app/components/dashboard-shell";
import { authHeaders, clearAuthSession, getAuthSession } from "@/app/lib/auth";

type Order = {
  orderId: string;
  network: string;
  bundleId: string;
  bundleSize: string;
  validity: string;
  recipientPhone: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentProvider: string;
  paymentStatus: string;
  orderStatus: string;
  failureReason?: string | null;
  createdAt: string;
  paidAt?: string | null;
  completedAt?: string | null;
};

function formatDate(value?: string | null) {
  if (!value) return "Not yet";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not available"
    : new Intl.DateTimeFormat("en-GH", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function formatStatus(value?: string | null) {
  if (!value) return "Not available";
  return value.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function TransactionDetailsPage() {
  const params = useParams<{ orderId: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getAuthSession()?.token) {
      router.replace(`/login?next=${encodeURIComponent(`/transactions/${params.orderId}`)}`);
      return;
    }

    const loadOrder = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(
          `${apiUrl}/api/orders/${encodeURIComponent(params.orderId)}`,
          { headers: authHeaders() }
        );
        if (response.status === 401) {
          clearAuthSession();
          router.replace(`/login?next=${encodeURIComponent(`/transactions/${params.orderId}`)}`);
          return;
        }
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load order details");
        setOrder(data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load order details");
      } finally {
        setLoading(false);
      }
    };

    void loadOrder();
  }, [params.orderId, router]);

  const isComplete = order?.orderStatus === "COMPLETED";
  const isFailed = ["FAILED", "CANCELLED"].includes(order?.orderStatus || "");

  return (
    <DashboardShell active="/transactions">
      <main className="mx-auto max-w-3xl space-y-5">
        <Link href="/transactions" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-sky-700">
          <ArrowLeft size={16} /> Back to transactions
        </Link>

        {loading ? (
          <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500" role="status">Loading order details...</p>
        ) : error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-sm text-rose-700" role="alert">{error}</p>
        ) : order ? (
          <>
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Order reference</p>
                  <h1 className="mt-1 break-all text-xl font-bold tracking-tight text-slate-900">{order.orderId}</h1>
                </div>
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${isComplete ? "bg-emerald-50 text-emerald-700" : isFailed ? "bg-rose-50 text-rose-700" : "bg-sky-50 text-sky-700"}`}>
                  {isComplete ? <CheckCircle2 size={16} /> : isFailed ? <XCircle size={16} /> : <Clock3 size={16} />}
                  {formatStatus(order.orderStatus)}
                </span>
              </div>

              <dl className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
                <Detail label="Bundle" value={`${order.network} ${order.bundleSize}`} />
                <Detail label="Validity" value={order.validity || "Not available"} />
                <Detail label="Recipient number" value={order.recipientPhone || "Not available"} />
                <Detail label="Amount" value={`${order.currency || "GHS"} ${Number(order.amount).toFixed(2)}`} />
                <Detail label="Payment status" value={formatStatus(order.paymentStatus)} />
                <Detail label="Payment method" value={order.paymentMethod || "Not available"} />
                <Detail label="Placed" value={formatDate(order.createdAt)} />
                <Detail label="Paid" value={formatDate(order.paidAt)} />
                {order.completedAt ? <Detail label="Completed" value={formatDate(order.completedAt)} /> : null}
              </dl>

              {order.failureReason ? (
                <p className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                  {order.failureReason}
                </p>
              ) : null}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="font-semibold text-slate-900">Order progress</h2>
              <ol className="mt-4 space-y-4">
                <ProgressItem label="Order created" detail={formatDate(order.createdAt)} complete />
                <ProgressItem
                  label="Payment"
                  detail={order.paymentStatus === "PAID" ? formatDate(order.paidAt) : formatStatus(order.paymentStatus)}
                  complete={order.paymentStatus === "PAID"}
                  failed={order.paymentStatus === "FAILED"}
                />
                <ProgressItem
                  label="Data delivery"
                  detail={isComplete ? formatDate(order.completedAt) : order.paymentStatus === "FAILED" ? "Not started — payment unsuccessful" : order.paymentStatus !== "PAID" ? "Waiting for payment" : isFailed ? formatStatus(order.orderStatus) : "Payment confirmed · awaiting data delivery"}
                  complete={isComplete}
                  failed={isFailed && order.paymentStatus === "PAID"}
                />
              </ol>
            </section>
          </>
        ) : null}
      </main>
    </DashboardShell>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 break-words text-sm font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

function ProgressItem({
  label,
  detail,
  complete,
  failed = false,
}: {
  label: string;
  detail: string;
  complete: boolean;
  failed?: boolean;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${failed ? "bg-rose-100 text-rose-700" : complete ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
        {failed ? <XCircle size={15} /> : complete ? <CheckCircle2 size={15} /> : <Clock3 size={15} />}
      </span>
      <span>
        <span className="block text-sm font-semibold text-slate-900">{label}</span>
        <span className="mt-0.5 block text-xs text-slate-500">{detail}</span>
      </span>
    </li>
  );
}
