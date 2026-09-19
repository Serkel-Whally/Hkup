"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  CreditCard,
  LoaderCircle,
  ShieldCheck,
  Smartphone,
  Wallet,
} from "lucide-react";

const NETWORKS = [
  { id: "mtn", name: "MTN", logo: "/mtn.svg" },
  { id: "telecel", name: "Telecel", logo: "/Telecel_Group.png" },
  { id: "airtel", name: "AirtelTigo", logo: "/airtel.svg" },
];

const PAYMENT_METHODS = [
  {
    id: "mobile_money",
    label: "Mobile Money",
    description: "Instant wallet and MoMo checkout",
    icon: Smartphone,
  },
  {
    id: "card",
    label: "Debit / Credit Card",
    description: "Visa, Mastercard and more",
    icon: CreditCard,
  },
  {
    id: "wallet",
    label: "Wallet Balance",
    description: "Use your available wallet funds",
    icon: Wallet,
  },
] as const;

const getNetworkMeta = (networkId: string | null) =>
  NETWORKS.find((network) => network.id === networkId) ?? {
    id: "mtn",
    name: "MTN",
    logo: "/mtn.svg",
  };

export default function PaymentPage() {
  const router = useRouter();
  const [network, setNetwork] = useState<string | null>(null);
  const [bundleId, setBundleId] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [validity, setValidity] = useState<string | null>(null);
  const [price, setPrice] = useState<string | null>(null);
  const [recipient, setRecipient] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>("mobile_money");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    setNetwork(params.get("network"));
    setBundleId(params.get("bundle"));
    setSize(params.get("size") || "10GB");
    setValidity(params.get("validity") || "30 Days");
    setPrice(params.get("price") || "GH₵ 20.00");
    setRecipient(params.get("recipient"));
    setPromoCode(params.get("promoCode"));
  }, []);

  const networkMeta = useMemo(() => getNetworkMeta(network), [network]);
  const canSubmit = Boolean(bundleId && recipient && price);

  const handlePay = async () => {
    if (!canSubmit) {
      setError("Your purchase details are incomplete.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        bundleId,
        recipientPhone: recipient,
        paymentMethod: selectedMethod,
        idempotencyKey: `order-${Date.now()}`,
      };

      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(json?.error || "Unable to initialize payment.");
      }

      if (json?.status === "paid") {
        const order = json.order ?? {};
        const params = new URLSearchParams({
          network: network || "",
          bundle: size || "10GB",
          validity: validity || "30 Days",
          amount: price || "GH₵ 20.00",
          recipient: recipient || "",
          paymentMethod: selectedMethod,
          transactionId: order.id || "",
        });
        router.push(`/processing?${params.toString()}`);
        return;
      }

      if (json?.authorizationUrl) {
        window.location.href = json.authorizationUrl;
        return;
      }

      const params = new URLSearchParams({
        network: network || "",
        bundle: bundleId || "",
        size: size || "10GB",
        validity: validity || "30 Days",
        amount: price || "GH₵ 20.00",
        recipient: recipient || "",
        paymentMethod: selectedMethod,
      });
      router.push(`/processing?${params.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to continue to payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToCheckout = () => {
    const params = new URLSearchParams({
      network: network || "mtn",
      bundle: bundleId || "",
      size: size || "10GB",
      validity: validity || "30 Days",
      price: price || "GH₵ 20.00",
      ...(recipient ? { recipient } : {}),
      ...(promoCode ? { promoCode } : {}),
    });
    router.push(`/checkout?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-900/30 px-4 py-6 backdrop-blur-sm md:px-6">
      <div className="mx-auto max-w-xl rounded-[30px] border border-white/30 bg-white/85 shadow-[0_30px_80px_rgba(15,23,42,0.28)] backdrop-blur-xl">
        <div className="border-b border-slate-200 px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              aria-label="Back to checkout"
              onClick={handleBackToCheckout}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 transition hover:bg-slate-50"
            >
              <ArrowLeft size={20} strokeWidth={2.4} />
            </button>

            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Secure checkout</p>
              <h1 className="text-lg font-semibold text-slate-900">Select payment</h1>
            </div>

            <div className="h-11 w-11" aria-hidden="true" />
          </div>
        </div>

        <div className="space-y-5 p-4 md:p-5">
          <section className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-100">
                  <Image src={networkMeta.logo} alt={`${networkMeta.name} logo`} width={36} height={36} className="object-contain" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Selected bundle</p>
                  <p className="text-lg font-semibold text-slate-900">{size || "10GB"} • {networkMeta.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Total</p>
                <p className="text-xl font-bold text-sky-600">{price || "GH₵ 20.00"}</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} strokeWidth={2.1} />
                <span>Your data purchase is protected and encrypted.</span>
              </div>
            </div>
          </section>

          <section className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3">
              <h2 className="text-lg font-semibold text-slate-900">Choose payment method</h2>
              <p className="mt-1 text-sm text-slate-500">Complete your bundle purchase securely.</p>
            </div>

            <div className="space-y-3">
              {PAYMENT_METHODS.map(({ id, label, description, icon: Icon }) => {
                const active = selectedMethod === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedMethod(id)}
                    className={`flex w-full items-center gap-3 rounded-[18px] border p-3 text-left transition ${
                      active
                        ? "border-sky-200 bg-sky-50 shadow-[0_0_0_4px_rgba(14,165,233,0.08)]"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${active ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                      <Icon size={20} strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-slate-900">{label}</p>
                        {active ? <Check size={16} className="text-sky-600" /> : null}
                      </div>
                      <p className="mt-0.5 text-sm text-slate-500">{description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Recipient</span>
              <span className="font-semibold text-slate-900">{recipient || "Not provided"}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
              <span>Validity</span>
              <span className="font-semibold text-slate-900">{validity || "30 Days"}</span>
            </div>
            {promoCode ? (
              <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                <span>Promo code</span>
                <span className="font-semibold text-emerald-600">{promoCode}</span>
              </div>
            ) : null}
          </section>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="button"
            onClick={handlePay}
            disabled={isSubmitting || !canSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-[16px] bg-sky-600 px-4 py-3.5 text-base font-semibold text-white shadow-[0_16px_30px_rgba(14,165,233,0.28)] transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>Pay now</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
