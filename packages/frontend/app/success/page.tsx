"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { addStoredNotification } from "@/app/lib/notifications";
import {
  ArrowRight,
  CalendarRange,
  Check,
  Clock3,
  List,
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

export default function SuccessPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "success" | "pending" | "failed" | "unknown">("checking");
  const [message, setMessage] = useState("Checking payment status...");
  const [reference, setReference] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const foundReference = params.get("reference");
    setReference(foundReference);

    if (!foundReference) {
      setStatus("unknown");
      setMessage("No verified payment reference was found. Payment success cannot be confirmed from the browser alone.");
      return;
    }

    fetch(`/api/payments/verify?reference=${encodeURIComponent(foundReference)}`)
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));

        if (!response.ok || !payload?.verified) {
          setStatus("failed");
          setMessage(payload?.error || "Payment is not yet verified or could not be confirmed by the server.");
          return;
        }

        setStatus("success");
        setMessage("Payment has been verified successfully by the server.");

        addStoredNotification({
          title: "Purchase successful",
          message: "Congratulations! Your purchase was completed successfully.",
          kind: "system",
          tone: "green",
          dedupeKey: `purchase-success:${foundReference}`,
        });
      })
      .catch(() => {
        setStatus("unknown");
        setMessage("Payment status could not be verified at this time.");
      });
  }, []);

  if (status === "checking") {
    return (
      <div className="min-h-screen w-full overflow-x-hidden bg-white text-slate-900">
        <main className="mx-auto w-full max-w-[560px] px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-8 sm:px-5">
          <div className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-[0_8px_22px_rgba(15,23,42,0.03)]">
            <p className="text-[20px] font-semibold text-slate-900">Checking payment status...</p>
            <p className="mt-2 text-[14px] leading-6 text-slate-600">This page does not declare success without server-side verification.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-slate-900">
      <main className="mx-auto w-full max-w-[560px] px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-8 sm:px-5">
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className={`mb-5 flex h-[120px] w-[120px] items-center justify-center rounded-full border-4 ${status === "success" ? "border-emerald-100 bg-emerald-50" : "border-slate-200 bg-slate-50"} shadow-[0_10px_28px_rgba(15,23,42,0.03)]`}>
              <div className={`flex h-16 w-16 items-center justify-center rounded-full ${status === "success" ? "bg-emerald-500 text-white ring-8 ring-emerald-100" : "bg-slate-200 text-slate-600"}`}>
                <Check size={38} strokeWidth={3} />
              </div>
            </div>

            <h2 className="text-[28px] font-bold tracking-[-0.04em] text-slate-900">
              {status === "success" ? "Payment verified" : status === "failed" ? "Payment not confirmed" : "Payment status pending"}
            </h2>

            <p className="mt-3 max-w-[330px] text-[15px] leading-6 text-slate-600">
              {message}
            </p>

            {reference ? (
              <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1.5 text-[13px] font-semibold text-sky-700">
                Reference: {reference}
              </span>
            ) : null}
          </div>

          <div className="space-y-3 pt-1">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="flex w-full items-center justify-center gap-2 rounded-[16px] bg-sky-600 px-4 py-3 text-[15px] font-semibold text-white shadow-[0_14px_30px_rgba(14,165,233,0.22)] transition hover:bg-sky-500"
            >
              Go to Dashboard
              <ArrowRight size={18} strokeWidth={2.3} />
            </button>

            <button
              type="button"
              onClick={() => router.push("/transactions")}
              className="flex w-full items-center justify-center rounded-[16px] border border-sky-600 bg-white px-4 py-3 text-[15px] font-semibold text-sky-600 transition hover:bg-sky-50"
            >
              View Transactions
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
