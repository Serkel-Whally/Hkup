"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, PackageSearch, Search, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { DashboardShell } from "@/app/components/dashboard-shell";
import { supabase } from "@/app/lib/supabase/client";

type Order = {
  reference: string;
  network: string;
  bundleSize: string;
  recipientPhone: string;
  paymentStatus: string;
  deliveryStatus: string;
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!searchedOrder || !searchedOrder.reference) return;

    const client = supabase;
    if (!client) return;

    const intervalId = window.setInterval(async () => {
      const { data: { user }, error: userError } = await client.auth.getUser();
      if (userError || !user) return;

      const { data: trackedOrder, error } = await client
        .from("orders")
        .select("reference, network, bundle_size, recipient_phone, payment_status, delivery_status")
        .eq("user_id", user.id)
        .eq("reference", searchedOrder.reference)
        .maybeSingle();

      if (!error && trackedOrder) {
        setSearchedOrder({
          reference: trackedOrder.reference,
          network: trackedOrder.network,
          bundleSize: trackedOrder.bundle_size,
          recipientPhone: trackedOrder.recipient_phone,
          paymentStatus: trackedOrder.payment_status,
          deliveryStatus: trackedOrder.delivery_status,
        });
      }
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [searchedOrder]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const reference = orderId.trim();
    if (!reference) return;
    setLoading(true);
    setError("");
    setSearchedOrder(null);

    try {
      const client = supabase;
      if (!client) throw new Error("Supabase is not configured.");

      const { data: { user }, error: userError } = await client.auth.getUser();
      if (userError || !user) throw new Error("Please sign in to track your order.");

      const { data: trackedOrder, error } = await client
        .from("orders")
        .select("reference, network, bundle_size, recipient_phone, payment_status, delivery_status")
        .eq("user_id", user.id)
        .eq("reference", reference)
        .maybeSingle();

      if (error) throw error;
      if (!trackedOrder) throw new Error("Unable to find that order.");

      setSearchedOrder({
        reference: trackedOrder.reference,
        network: trackedOrder.network,
        bundleSize: trackedOrder.bundle_size,
        recipientPhone: trackedOrder.recipient_phone,
        paymentStatus: trackedOrder.payment_status,
        deliveryStatus: trackedOrder.delivery_status,
      });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to find that order.");
    } finally {
      setLoading(false);
    }
  }

  const paymentConfirmed = String(searchedOrder?.paymentStatus ?? "").toUpperCase() === "PAID";
  const delivered = String(searchedOrder?.deliveryStatus ?? "").toUpperCase() === "DELIVERED";
  const failed = String(searchedOrder?.paymentStatus ?? "").toUpperCase() === "FAILED" || String(searchedOrder?.deliveryStatus ?? "").toUpperCase() === "FAILED";
  const orderStages = [
    { label: "Payment confirmed", detail: paymentConfirmed ? "Your payment has been received" : "Payment is awaiting confirmation", icon: CheckCircle2, complete: paymentConfirmed },
    { label: "Bundle processing", detail: failed ? "This order could not be completed" : "Your bundle is being prepared", icon: Clock3, complete: paymentConfirmed && !failed },
    { label: "Bundle delivered", detail: delivered ? "Data was sent to the recipient" : "Data will be sent to the recipient", icon: Truck, complete: delivered },
  ];

  return (
    <DashboardShell active="/transactions">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <header>
          <p className="text-sm font-medium text-sky-600">Order updates</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">Track Order</h1>
          <p className="mt-2 text-sm text-slate-500">Follow the progress of your data bundle delivery.</p>
        </header>

        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)] md:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600"><PackageSearch size={20} /></span>
            <div><h2 className="text-lg font-semibold text-slate-900">Find your order</h2><p className="mt-1 text-sm text-slate-500">Enter the transaction ID from your confirmation.</p></div>
          </div>
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="order-id" className="sr-only">Transaction ID</label>
            <input id="order-id" value={orderId} onChange={(event) => setOrderId(event.target.value)} required maxLength={100} aria-invalid={Boolean(error && !searchedOrder)} aria-describedby="order-id-error" placeholder="e.g. TXN-20250815-102457" className="min-h-11 min-w-0 flex-1 rounded-lg border border-slate-200 px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
            <button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-sky-600 px-5 text-sm font-semibold text-white transition hover:bg-sky-500"><Search size={16} /> Track Order</button>
          </form>
          {error && !searchedOrder ? <p id="order-id-error" className="mt-2 text-sm text-rose-600" role="alert">{error}</p> : null}
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)] md:p-6" aria-live="polite">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
            <div><p className="text-xs font-medium uppercase tracking-wide text-slate-400">Current order</p><h2 className="mt-1 break-all text-lg font-semibold text-slate-900">{searchedOrder?.reference || "Enter a transaction ID"}</h2></div>
            {searchedOrder && <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${failed ? "bg-rose-50 text-rose-700" : delivered ? "bg-emerald-50 text-emerald-700" : "bg-sky-50 text-sky-700"}`}><span className={`h-2 w-2 rounded-full ${failed ? "bg-rose-600" : delivered ? "bg-emerald-600" : "animate-pulse bg-sky-600"}`} />{failed ? "Failed" : delivered ? "Delivered" : "Processing"}</span>}
          </div>
          {loading ? <p className="py-8 text-center text-sm text-slate-500">Looking up order...</p> : error ? <p className="py-8 text-center text-sm text-rose-600">{error}</p> : searchedOrder ? <div className="mt-6 space-y-5">
            {orderStages.map(({ label, detail, icon: Icon, complete }, index) => (
              <div key={label} className="flex gap-3">
                <div className="flex flex-col items-center"><span className={`flex h-9 w-9 items-center justify-center rounded-full ${complete ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}><Icon size={18} /></span>{index < orderStages.length - 1 && <span className={`mt-1 h-8 w-px ${complete ? "bg-emerald-200" : "bg-slate-200"}`} />}</div>
                <div className="pt-1"><p className={`text-sm font-semibold ${complete ? "text-slate-900" : "text-slate-500"}`}>{label}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div>
              </div>
            ))}
          </div> : null}
          {searchedOrder && <div className="mt-6 grid gap-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-3"><Detail label="Network" value={searchedOrder.network} /><Detail label="Bundle" value={searchedOrder.bundleSize} /><Detail label="Recipient" value={searchedOrder.recipientPhone} /></div>}
        </section>

        <div className="flex justify-center"><Link href="/transactions" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-sky-200 bg-white px-4 text-sm font-semibold text-sky-600 transition hover:bg-sky-50">View Transactions <ArrowRight size={16} /></Link></div>
      </div>
    </DashboardShell>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs text-slate-500">{label}</p><p className="mt-1 font-semibold text-slate-900">{value}</p></div>;
}
