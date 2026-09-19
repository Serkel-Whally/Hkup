"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Bell,
  CalendarRange,
  Check,
  ChevronRight,
  Clock3,
  Info,
  List,
  LoaderCircle,
  MessageCircleMore,
  Phone,
  Receipt,
  WalletCards,
} from "lucide-react";

const NETWORKS = [
  { id: "mtn", name: "MTN", logo: "/mtn.svg" },
  { id: "telecel", name: "Telecel", logo: "/Telecel_Group.png" },
  { id: "airtel", name: "AirtelTigo", logo: "/airtel.svg" },
];

const formatMaskedRecipient = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "024 XXX XXXX";

  if (digits.length <= 4) return digits.padEnd(4, "X");
  if (digits.length <= 7) return `${digits.slice(0, 3)} XXX ${digits.slice(3, 7).padEnd(4, "X")}`;
  return `${digits.slice(0, 3)} XXX ${digits.slice(3, 7)}`;
};

const getNetworkMeta = (networkName: string | null) =>
  NETWORKS.find((network) => network.name.toLowerCase() === String(networkName ?? "").toLowerCase()) ??
  { id: "mtn", name: "MTN", logo: "/mtn.svg" };

export default function ProcessingPage() {
  const router = useRouter();
  const [network, setNetwork] = useState<string | null>(null);
  const [bundle, setBundle] = useState<string | null>(null);
  const [validity, setValidity] = useState<string | null>(null);
  const [recipient, setRecipient] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [transactionDate, setTransactionDate] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    setNetwork(params.get("network"));
    setBundle(params.get("bundle"));
    setValidity(params.get("validity"));
    setRecipient(params.get("recipient"));
    setAmount(params.get("amount"));
    setTransactionId(params.get("transactionId"));
    setPaymentMethod(params.get("paymentMethod"));

    const now = new Date();
    setTransactionDate(
      now.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, []);

  useEffect(() => {
    if (!paymentMethod) return;

    // This page is informational only. Payment success is server-authoritative and must be
    // confirmed by the trusted payment verification flow, not by a browser-timed redirect.
  }, [paymentMethod]);

  const networkMeta = useMemo(() => getNetworkMeta(network), [network]);
  const displayRecipient = recipient ? formatMaskedRecipient(recipient) : "024 XXX XXXX";

  if (!paymentMethod) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-sky-600" />
          <h2 className="mt-4 text-xl font-semibold text-slate-900">Preparing payment</h2>
          <p className="mt-2 text-sm text-slate-500">We are validating your checkout details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-md items-center justify-between px-4 sm:px-5">
          <button
            type="button"
            aria-label="Go back"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-900 transition hover:bg-slate-100"
          >
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>

          <h1 className="text-[24px] font-bold tracking-[-0.02em] text-slate-900">Processing</h1>

          <div className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-900">
            <Bell size={22} strokeWidth={2.1} />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-sky-600 text-[10px] font-bold text-white">
              3
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-5 sm:px-5">
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-sky-100 bg-sky-50 text-sky-600 shadow-[0_10px_20px_rgba(14,165,233,0.12)]">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-sky-200 border-t-sky-600 animate-spin">
                <Clock3 size={20} className="absolute text-sky-600" strokeWidth={2.1} />
              </div>
            </div>

            <h2 className="text-[24px] font-bold tracking-[-0.03em] text-slate-900 sm:text-[26px]">
              Your purchase is being processed
            </h2>
            <p className="mt-3 max-w-xs text-[15px] leading-6 text-slate-500">
              We&apos;re sending your data bundle. This usually takes a few seconds, please wait...
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-[16px] border border-sky-100 bg-sky-50/80 p-4">
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sky-600">
              <Info size={18} strokeWidth={2.1} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-slate-900">Don&apos;t close this page</p>
              <p className="mt-1 text-[14px] leading-5 text-slate-600">
                Once completed, you will get a success notification.
              </p>
            </div>
          </div>

          <div className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-[0_8px_18px_rgba(15,23,42,0.03)]">
            <div className="flex flex-col items-center justify-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-[13px] font-semibold text-sky-700">
                <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-sky-600" />
                Processing
              </div>
              <p className="mt-2 text-center text-[14px] text-slate-500">Transaction in progress</p>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-[14px] font-medium text-slate-500">
                  <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-slate-50 ring-1 ring-slate-100">
                    <Image src={networkMeta.logo} alt={`${networkMeta.name} logo`} width={18} height={18} className="object-contain" />
                  </div>
                  Network
                </div>
                <span className="text-[15px] font-semibold text-slate-900">{networkMeta.name}</span>
              </div>

              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-[14px] font-medium text-slate-500">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                    <List size={16} strokeWidth={2.1} />
                  </div>
                  Bundle
                </div>
                <span className="text-[15px] font-semibold text-slate-900">{bundle || "10GB"}</span>
              </div>

              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-[14px] font-medium text-slate-500">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                    <CalendarRange size={16} strokeWidth={2.1} />
                  </div>
                  Validity
                </div>
                <span className="text-[15px] font-semibold text-slate-900">{validity || "30 Days"}</span>
              </div>

              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-[14px] font-medium text-slate-500">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                    <Phone size={16} strokeWidth={2.1} />
                  </div>
                  Recipient Number
                </div>
                <span className="text-[15px] font-semibold text-slate-900">{displayRecipient}</span>
              </div>

              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-[14px] font-medium text-slate-500">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                    <WalletCards size={16} strokeWidth={2.1} />
                  </div>
                  Amount Paid
                </div>
                <span className="text-[15px] font-semibold text-slate-900">{amount || "GH₵ 20.00"}</span>
              </div>

              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-[14px] font-medium text-slate-500">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                    <Clock3 size={16} strokeWidth={2.1} />
                  </div>
                  Date &amp; Time
                </div>
                <span className="text-[15px] font-semibold text-slate-900">{transactionDate || "24 May 2025, 10:24 AM"}</span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[14px] font-medium text-slate-500">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                    <Receipt size={16} strokeWidth={2.1} />
                  </div>
                  Transaction ID
                </div>
                <span className="text-[15px] font-semibold text-slate-900">{transactionId || "TXN-20250524-102457"}</span>
              </div>
            </div>
          </div>

          <div className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-[0_8px_18px_rgba(15,23,42,0.03)]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-600 text-white">
                  <Check size={12} strokeWidth={3} />
                </span>
                <span className="text-[13px] font-medium text-slate-700">Payment received</span>
              </div>
              <span className="text-[12px] font-semibold text-sky-600">Completed</span>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <div className="h-0.5 flex-1 bg-sky-600" />
              <div className="flex items-center gap-2 text-[13px] font-medium text-slate-700">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-sky-600 bg-sky-50 text-sky-600">
                  <LoaderCircle size={12} className="animate-spin" strokeWidth={2.5} />
                </span>
                Sending data bundle
              </div>
              <div className="h-0.5 flex-1 bg-slate-200" />
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-2 text-slate-500">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-slate-300" />
                </span>
                <span className="text-[13px] font-medium">Bundle delivered</span>
              </div>
              <span className="text-[12px] font-semibold text-slate-400">Pending</span>
            </div>
          </div>

          <div className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-[0_8px_18px_rgba(15,23,42,0.03)]">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                <MessageCircleMore size={18} strokeWidth={2.1} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-semibold text-slate-900">Need help?</p>
                <p className="mt-1 text-[14px] leading-5 text-slate-600">
                  If your bundle isn&apos;t delivered within a few minutes, contact our support.
                </p>
                <Link href="/support" className="mt-3 inline-flex items-center gap-1 text-[14px] font-semibold text-sky-600">
                  Contact Support
                  <ChevronRight size={16} strokeWidth={2.2} />
                </Link>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-[16px] border border-sky-600 bg-white px-4 py-3 text-[15px] font-semibold text-sky-600 shadow-[0_8px_18px_rgba(14,165,233,0.08)] transition hover:bg-sky-50"
          >
            <List size={18} strokeWidth={2.1} />
            View Transactions
          </button>
        </div>
      </main>
    </div>
  );
}
