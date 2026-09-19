"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Clock3, XCircle } from "lucide-react";

const networkLogos: Record<string, string> = {
  MTN: "/mtn.svg",
  Telecel: "/Telecel_Group.png",
  AirtelTigo: "/airtel.svg",
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; icon: React.ReactNode }> = {
    Successful: { color: "bg-emerald-50 text-emerald-700", icon: <CheckCircle size={13} /> },
    Processing: { color: "bg-sky-50 text-sky-700", icon: <Clock3 size={13} /> },
    Failed: { color: "bg-rose-50 text-rose-700", icon: <XCircle size={13} /> },
  };

  const config = map[status] || { color: "bg-slate-100 text-slate-700", icon: <Clock3 size={13} /> };

  return (
    <span
      role="status"
      aria-label={`Transaction ${status}`}
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-semibold ${config.color}`}
    >
      <span aria-hidden="true">{config.icon}</span>
      <span>{status}</span>
    </span>
  );
}

export default function TransactionItem({ transaction, href }: { transaction: any; href?: string }) {
  const amount = transaction.amount ?? "GH₵ 0.00";
  const validity = transaction.validity ?? "30 Days";

  const card = (
    <div className="flex items-start gap-3 rounded-[20px] border border-slate-200 bg-white p-3.5 shadow-[0_10px_24px_rgba(15,23,42,0.03)] transition hover:border-sky-200 hover:bg-sky-50/30 sm:p-4">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-100">
        <Image
          src={networkLogos[transaction.network] || "/mtn.svg"}
          alt={`${transaction.network} logo`}
          width={42}
          height={42}
          className="h-9 w-9 object-contain"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[15px] font-semibold leading-5 text-slate-900">{transaction.bundle}</p>
            <p className="mt-1 text-[13px] text-slate-500">{transaction.network} • {validity}</p>
            <p className="mt-1 text-[12px] text-slate-400">{transaction.datetime}</p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-[15px] font-semibold text-slate-900">{amount}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-end">
          <StatusBadge status={transaction.status} />
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <li role="listitem" className="w-full">
        <Link
          href={href}
          aria-label={`View details for ${transaction.bundle}`}
          className="block rounded-[20px] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          {card}
        </Link>
      </li>
    );
  }

  return <li role="listitem" className="w-full">{card}</li>;
}
