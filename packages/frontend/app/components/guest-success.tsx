"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Copy, Headset, PackageSearch, ShieldCheck } from "lucide-react";
import { useState } from "react";

type GuestSuccessProps = {
  network: string | null;
  bundle: string | null;
  validity: string | null;
  recipient: string | null;
  amount: string | null;
  transactionId: string | null;
  paymentMethod: string | null;
};

export default function GuestSuccess({ network, bundle, validity, recipient, amount, transactionId, paymentMethod }: GuestSuccessProps) {
  const [copied, setCopied] = useState(false);
  const reference = transactionId || "Pending";

  const copyReference = async () => {
    if (!transactionId) return;
    await navigator.clipboard.writeText(transactionId);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6">
      <div className="mx-auto w-full max-w-lg">
        <div className="text-center"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><CheckCircle2 size={42} /></div><p className="mt-6 text-sm font-semibold text-emerald-600">Guest order confirmed</p><h1 className="mt-2 text-3xl font-bold tracking-[-0.04em]">Payment received</h1><p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">Your bundle is being prepared. You do not need an account to receive it.</p></div>
        <section className="mt-7 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)] sm:p-7"><div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4"><div><p className="text-xs text-slate-500">Guest order reference</p><p className="mt-1 break-all font-bold text-slate-900">{reference}</p></div><button type="button" onClick={copyReference} disabled={!transactionId} aria-label="Copy order reference" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600 disabled:opacity-40">{copied ? <CheckCircle2 size={17} /> : <Copy size={17} />}</button></div><div className="mt-5 grid grid-cols-2 gap-4 text-sm"><Detail label="Bundle" value={bundle || "10GB"} /><Detail label="Network" value={network || "MTN"} /><Detail label="Recipient" value={recipient || "Not provided"} /><Detail label="Amount" value={amount || "GH₵ 20.00"} /><Detail label="Payment" value={paymentMethod || "Mobile Money"} /><Detail label="Validity" value={validity || "30 Days"} /></div></section>
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm text-slate-600"><ShieldCheck className="mt-0.5 shrink-0 text-sky-600" size={18} /><p>Keep your order reference. You can use it to check delivery progress without creating an account.</p></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2"><Link href={`/track-order?guest=1&transactionId=${encodeURIComponent(reference)}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 text-sm font-bold text-white shadow-sm">Track my order <PackageSearch size={17} /></Link><Link href="/support?guest=1" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700"><Headset size={17} /> Guest support</Link></div><Link href="/" className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-sky-600">Buy another bundle <ArrowRight size={16} /></Link>
      </div>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs text-slate-500">{label}</p><p className="mt-1 break-words font-semibold text-slate-900">{value}</p></div>;
}
