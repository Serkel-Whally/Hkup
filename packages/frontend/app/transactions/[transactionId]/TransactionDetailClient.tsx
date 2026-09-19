"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  Download,
  FileText,
  Share2,
  XCircle,
} from "lucide-react";

const networkLogos: Record<string, string> = {
  MTN: "/mtn.svg",
  Telecel: "/Telecel_Group.png",
  AirtelTigo: "/airtel.svg",
};

type TransactionDetailClientProps = {
  transaction: {
    id: string;
    network: string;
    bundle: string;
    recipient: string;
    amount: string;
    datetime: string;
    status: string;
    payment: string;
    reference: string;
  };
};

function getStatusMeta(status: string) {
  if (status === "Successful") {
    return {
      tone: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: <CheckCircle2 size={28} strokeWidth={2.2} />,
      title: "Successful",
      description: "Your data bundle has been sent successfully.",
      detail: "Your data bundle has been sent successfully.",
    };
  }

  if (status === "Failed") {
    return {
      tone: "bg-rose-100 text-rose-700 border-rose-200",
      icon: <XCircle size={28} strokeWidth={2.2} />,
      title: "Failed",
      description: "Your transaction could not be completed.",
      detail: "Your transaction could not be completed.",
    };
  }

  return {
    tone: "bg-sky-100 text-sky-700 border-sky-200",
    icon: <Clock3 size={28} strokeWidth={2.2} />,
    title: "Processing",
    description: "Your transaction is being processed.",
    detail: "Your bundle will be sent to the recipient once processing is complete.",
  };
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="max-w-[62%] break-words text-right font-semibold text-slate-900">{value}</span>
    </div>
  );
}

export default function TransactionDetailClient({ transaction }: TransactionDetailClientProps) {
  const [copyMessage, setCopyMessage] = useState("");
  const statusMeta = getStatusMeta(transaction.status);

  async function copyText(value: string, message: string) {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(value);
      }
      setCopyMessage(message);
      window.setTimeout(() => setCopyMessage(""), 1800);
    } catch {
      setCopyMessage("Copy unavailable on this device.");
      window.setTimeout(() => setCopyMessage(""), 1800);
    }
  }

  const shareTransaction = async () => {
    const shareText = `CelluLite Data transaction ${transaction.reference}: ${transaction.bundle} for ${transaction.amount}.`;
    if (navigator.share) {
      await navigator.share({
        title: "CelluLite Data Transaction",
        text: shareText,
      });
      return;
    }
    await copyText(shareText, "Transaction information copied.");
  };

  const downloadReceipt = () => {
    const receipt = [
      "CelluLite Data Receipt",
      "",
      `Transaction ID: ${transaction.reference}`,
      `Bundle: ${transaction.bundle}`,
      `Network: ${transaction.network}`,
      `Recipient: ${transaction.recipient}`,
      `Amount: ${transaction.amount}`,
      `Status: ${transaction.status}`,
      `Date: ${transaction.datetime}`,
    ].join("\n");

    const blob = new Blob([receipt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `receipt-${transaction.reference}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const datePart = transaction.datetime.split(" ").slice(0, 3).join(" ") || transaction.datetime;
  const timePart = transaction.datetime.split(" ").slice(3).join(" ") || transaction.datetime;

  return (
    <div className="mx-auto w-full max-w-xl pb-24">
      <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white px-3 py-3 shadow-sm">
        <Link href="/transactions" aria-label="Back to transactions" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 transition hover:bg-slate-50">
          <ArrowLeft size={20} strokeWidth={2.4} />
        </Link>

        <h1 className="text-lg font-semibold text-slate-900">Transaction Details</h1>

        <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900">
          <Bell size={18} strokeWidth={2.1} />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-sky-600 text-[9px] font-bold text-white">
            3
          </span>
        </div>
      </div>

      <section className="rounded-[22px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.03)] sm:p-5">
        <div className="flex flex-col items-center text-center">
          <div className={`mb-3 flex h-16 w-16 items-center justify-center rounded-full border ${statusMeta.tone}`} aria-hidden="true">
            {statusMeta.icon}
          </div>
          <h2 className="text-2xl font-bold tracking-[-0.03em] text-slate-900">{statusMeta.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{statusMeta.description}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{statusMeta.detail}</p>
        </div>
      </section>

      <section className="mt-5 rounded-[22px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.03)] sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-100">
            <Image
              src={networkLogos[transaction.network] || "/mtn.svg"}
              alt={`${transaction.network} logo`}
              width={42}
              height={42}
              className="h-10 w-10 object-contain"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">{transaction.network}</p>
            <h3 className="mt-1 text-xl font-semibold text-slate-900">{transaction.bundle}</h3>
            <p className="mt-1 text-sm text-slate-500">{transaction.recipient}</p>
          </div>

          <div className="min-w-0 text-right">
            <p className="text-2xl font-bold tracking-[-0.04em] text-sky-600">{transaction.amount}</p>
            <p className="mt-1 text-[11px] text-slate-500">{transaction.datetime}</p>
          </div>
        </div>
      </section>

      <section id="transaction-info" className="mt-5 rounded-[22px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.03)] sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">Transaction information</h3>
          <button
            type="button"
            aria-label="Copy transaction reference"
            onClick={() => copyText(transaction.reference, "Transaction ID copied")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600"
          >
            <Copy size={16} strokeWidth={2.1} />
          </button>
        </div>

        <div className="mt-4 rounded-2xl bg-slate-50/70 p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-3 text-sm first:pt-0">
            <span className="text-slate-500">Transaction ID</span>
            <span className="max-w-[60%] break-all text-right font-semibold text-slate-900">{transaction.reference}</span>
          </div>

          <DetailRow label="Bundle" value={transaction.bundle} />
          <DetailRow label="Network" value={transaction.network} />
          <DetailRow label="Recipient" value={transaction.recipient} />
          <DetailRow label="Amount" value={transaction.amount} />
          <DetailRow label="Date" value={datePart} />
          <DetailRow label="Time" value={timePart} />
          <DetailRow label="Status" value={transaction.status} />
        </div>
      </section>

      <section className="mt-5 rounded-[22px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.03)] sm:p-5">
        <h3 className="text-lg font-semibold text-slate-900">Actions</h3>

        <div className="mt-3 space-y-2">
          <ActionRow
            title="View Details"
            subtitle="View transaction information"
            icon={<FileText size={18} strokeWidth={2.1} />}
            onClick={() => document.getElementById("transaction-info")?.scrollIntoView({ behavior: "smooth", block: "start" })}
          />
          <ActionRow
            title="Download Receipt"
            subtitle="Save a receipt for this transaction"
            icon={<Download size={18} strokeWidth={2.1} />}
            onClick={downloadReceipt}
          />
          <ActionRow
            title="Share Transaction"
            subtitle="Share transaction information"
            icon={<Share2 size={18} strokeWidth={2.1} />}
            onClick={shareTransaction}
          />
          <ActionRow
            title="Copy Transaction ID"
            subtitle="Copy the transaction reference"
            icon={<Copy size={18} strokeWidth={2.1} />}
            onClick={() => copyText(transaction.reference, "Transaction ID copied")}
          />
        </div>
      </section>

      {copyMessage ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-24 z-40 mx-auto w-[calc(100%-2rem)] max-w-sm rounded-full border border-sky-100 bg-slate-900 px-4 py-2 text-center text-sm font-medium text-white shadow-lg">
          {copyMessage}
        </div>
      ) : null}
    </div>
  );
}

function ActionRow({ title, subtitle, icon, onClick }: { title: string; subtitle: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-left transition hover:border-sky-200 hover:bg-sky-50"
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sky-600 shadow-sm">{icon}</span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-slate-900">{title}</span>
          <span className="mt-0.5 block text-xs text-slate-500">{subtitle}</span>
        </span>
      </span>
      <ChevronRight size={18} className="shrink-0 text-slate-400" />
    </button>
  );
}
