"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock3, Headset, Search, Truck } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/app/lib/supabase/client";

type GuestOrder = {
  reference: string;
  network: string;
  bundleSize: string;
  recipientPhone: string;
  paymentStatus: string;
  deliveryStatus: string;
  guest?: boolean;
};

export default function GuestTrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<GuestOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const reference = orderId.trim();
    if (!reference) return;
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      if (!supabase) throw new Error("Supabase is not configured.");

      const { data: trackedOrder, error } = await supabase
        .from("orders")
        .select("reference, network, bundle_size, recipient_phone, payment_status, delivery_status")
        .eq("reference", reference)
        .maybeSingle();

      if (error) throw error;
      if (!trackedOrder) throw new Error("Order not found.");
      if (trackedOrder.reference !== reference) throw new Error("That order belongs to a registered account.");

      setOrder({
        reference: trackedOrder.reference,
        network: trackedOrder.network,
        bundleSize: trackedOrder.bundle_size,
        recipientPhone: trackedOrder.recipient_phone,
        paymentStatus: trackedOrder.payment_status,
        deliveryStatus: trackedOrder.delivery_status,
        guest: true,
      });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to find that order.");
    } finally {
      setLoading(false);
    }
  }

  const failed = order?.paymentStatus === "FAILED" || order?.deliveryStatus === "FAILED";
  const paid = order?.paymentStatus === "PAID";
  const delivered = order?.deliveryStatus === "DELIVERED";
  const stages = [
    ["Payment confirmed", paid ? "Your payment was received" : "Payment is awaiting confirmation", CheckCircle2, paid],
    ["Bundle processing", failed ? "This order could not be completed" : "We are preparing your data bundle", Clock3, paid && !failed],
    ["Bundle delivery", delivered ? "The bundle was sent to the recipient" : "The bundle will be sent to the recipient", Truck, delivered],
  ] as const;

  return <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 sm:py-10"><div className="mx-auto w-full max-w-lg"><Link href="/" className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm"><ArrowLeft size={20} /></Link><header className="mt-8"><p className="text-sm font-semibold text-sky-600">Guest order tracking</p><h1 className="mt-2 text-3xl font-bold tracking-[-0.04em]">Follow your bundle</h1><p className="mt-3 text-sm leading-6 text-slate-500">Use the order reference from your payment confirmation. No account is required.</p></header><form onSubmit={submit} className="mt-6 flex gap-2"><label htmlFor="guest-order-id" className="sr-only">Guest order reference</label><input id="guest-order-id" value={orderId} onChange={(event) => setOrderId(event.target.value)} placeholder="TXN-20250815-102457" className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" /><button type="submit" disabled={loading} className="flex min-h-12 shrink-0 items-center gap-2 rounded-xl bg-sky-600 px-4 text-sm font-bold text-white disabled:opacity-60"><Search size={16} /> {loading ? "Searching" : "Track"}</button></form><section className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-7"><div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4"><div><p className="text-xs text-slate-500">Order reference</p><h2 className="mt-1 break-all font-bold">{order?.reference || "Your order reference"}</h2></div>{order && <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${failed ? "bg-rose-50 text-rose-700" : delivered ? "bg-emerald-50 text-emerald-700" : "bg-sky-50 text-sky-700"}`}>{failed ? "Failed" : delivered ? "Delivered" : "Processing"}</span>}</div>{error ? <p className="py-8 text-center text-sm text-rose-600" role="alert">{error}</p> : order ? <><div className="mt-6 space-y-5">{stages.map(([label, detail, Icon, complete], index) => <div key={label} className="flex gap-3"><div className="flex flex-col items-center"><span className={`flex h-9 w-9 items-center justify-center rounded-full ${complete ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}><Icon size={18} /></span>{index < stages.length - 1 && <span className={`mt-1 h-8 w-px ${complete ? "bg-emerald-200" : "bg-slate-200"}`} />}</div><div className="pt-1"><p className={`text-sm font-semibold ${complete ? "text-slate-900" : "text-slate-500"}`}>{label}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div></div>)}</div><div className="mt-6 grid gap-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-3"><Detail label="Network" value={order.network} /><Detail label="Bundle" value={order.bundleSize} /><Detail label="Recipient" value={order.recipientPhone} /></div></> : <p className="py-8 text-center text-sm text-slate-500">Enter your order reference to see its status.</p>}</section><div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500"><Headset size={15} className="text-sky-600" /><span>Need help? Contact support</span></div></div></main>;
}

function Detail({ label, value }: { label: string; value: string }) { return <div><p className="text-xs text-slate-500">{label}</p><p className="mt-1 font-semibold">{value}</p></div>; }
