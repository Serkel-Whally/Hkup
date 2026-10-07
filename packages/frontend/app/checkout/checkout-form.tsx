"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { PaymentModal } from "./payment-modal";

const NETWORKS = [
  { id: "mtn", name: "MTN", logo: "/mtn.svg" },
  { id: "telecel", name: "Telecel", logo: "/Telecel_Group.png" },
  { id: "airtel", name: "AirtelTigo", logo: "/airtel.svg" },
];

const getNetworkMeta = (networkId: string | null) =>
  NETWORKS.find((network) => network.id === networkId) ?? { id: "", name: "N/A", logo: "/mtn.svg" };

const isValidPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return /^0?[2-9]\d{8}$/.test(digits) || /^\+?233[2-9]\d{8}$/.test(digits);
};

type CheckoutDetails = {
  network: string;
  bundleId: string;
  size: string;
  validity: string;
  price: string;
  guest?: boolean;
};

type CheckoutPageProps = {
  modal?: boolean;
  details?: CheckoutDetails;
  onClose?: () => void;
};

export function CheckoutPage({ modal = false, details, onClose }: CheckoutPageProps) {
  const router = useRouter();
  const [network, setNetwork] = useState<string | null>(details?.network ?? null);
  const [bundleId, setBundleId] = useState<string | null>(details?.bundleId ?? null);
  const [size, setSize] = useState<string | null>(details?.size ?? null);
  const [validity, setValidity] = useState<string | null>(details?.validity ?? null);
  const [price, setPrice] = useState<string | null>(details?.price ?? null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [touched, setTouched] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const close = useMemo(() => onClose ?? (() => router.back()), [onClose, router]);

  useEffect(() => {
    if (details || typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    setNetwork(params.get("network"));
    setBundleId(params.get("bundle"));
    setSize(params.get("size"));
    setValidity(params.get("validity"));
    setPrice(params.get("price"));
  }, [details]);

  useEffect(() => {
    if (!modal) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [modal, close]);

  const networkMeta = useMemo(() => getNetworkMeta(network), [network]);
  const phoneError = touched && !isValidPhoneNumber(phoneNumber) ? "Enter a valid mobile number." : "";
  const canSubmit = isValidPhoneNumber(phoneNumber);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    setSubmitError("");

    if (!canSubmit) return;

    try {
      setShowPaymentModal(true);
    } catch (error) {
      setSubmitError("Failed to open payment. Please try again.");
    }
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
  };

  return (
    <>
      <div role={modal ? "dialog" : undefined} aria-modal={modal ? true : undefined} aria-label={modal ? "Complete your purchase" : undefined} onClick={modal ? close : undefined} className={modal ? "fixed inset-0 z-40 flex items-end bg-black/40 sm:items-center sm:justify-center" : "w-full"}>
        <div onClick={modal ? (event) => event.stopPropagation() : undefined} className={modal ? "absolute inset-x-0 bottom-0 top-8 flex flex-col overflow-hidden rounded-t-[28px] bg-slate-50 text-slate-900 sm:relative sm:top-auto sm:rounded-[20px]" : "w-full"}>
          <header className={modal ? "shrink-0 border-b border-slate-100 bg-white px-4 pt-2" : "sticky top-0 z-20 border-b border-slate-100 bg-white/95 backdrop-blur-sm"}>
            {modal ? <div className="mx-auto mb-1 h-1 w-10 rounded-full bg-slate-200" aria-hidden="true" /> : null}
            <div className="mx-auto flex h-14 max-w-md items-center justify-between sm:px-1">
              <button type="button" onClick={close} aria-label={modal ? "Close checkout" : "Go back"} className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:bg-slate-50">
                <ArrowLeft size={24} strokeWidth={2.5} />
              </button>
              {!modal ? <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-slate-900">Checkout</h1> : <div className="text-center"><p className="text-[17px] font-bold tracking-[-0.02em] text-slate-900">Checkout</p></div>}
              {!modal ? <div className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-900"><Bell size={22} strokeWidth={2.1} /><span className="absolute -right-1 -top-0.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-blue-600"></span></div> : <div className="w-11" />}
            </div>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md space-y-5 px-4 pb-[calc(env(safe-area-inset-bottom)+6.75rem)] pt-5 sm:px-5">
              {modal ? <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2.5 text-[13px] font-medium text-emerald-800"><ShieldCheck size={17} strokeWidth={2.5} /><span>Secure checkout</span></div> : null}

              <section>
                <div className="mb-3 flex items-center justify-between"><h2 className="text-[17px] font-semibold tracking-[-0.02em] text-slate-900">Your bundle</h2><span className="text-xs font-medium text-slate-500">Bundle details</span></div>
                <div className="flex w-full items-center gap-3 rounded-[20px] border border-slate-200 bg-white p-3.5 shadow-sm">
                  <div className="flex h-[54px] w-[54px] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-100"><Image src={networkMeta.logo} alt={`${networkMeta.name} logo`} width={40} height={40} className="object-contain" /></div>
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[25px] font-bold leading-none tracking-[-0.04em] text-slate-900">{size ?? "Data"}</p>
                      <p className="mt-1 text-[13px] text-slate-500">{networkMeta.name} • {validity ?? "Validity"}</p>
                    </div>
                    <p className="shrink-0 text-[18px] font-bold text-slate-900">{price ?? "GH₵ 0.00"}</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="mb-1 text-[17px] font-semibold tracking-[-0.02em] text-slate-900">Where should we send it?</h2>
                <p className="mb-3 text-[13px] text-slate-500">Enter the Ghana number that will receive this bundle.</p>
                <div className={`rounded-[16px] border bg-white px-3 shadow-sm ${phoneError ? "border-red-300" : "border-slate-200"}`}>
                  <div className="flex h-[60px] items-center gap-3">
                    <Phone size={18} className="text-slate-500" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(event) => setPhoneNumber(event.target.value)}
                      onBlur={() => setTouched(true)}
                      placeholder="024 000 0000"
                      aria-invalid={Boolean(phoneError)}
                      aria-describedby={phoneError ? "recipient-phone-help" : undefined}
                      className="w-full border-0 bg-transparent text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>
                {phoneError ? <p id="recipient-phone-help" className="mt-2 text-sm text-red-600" role="alert">{phoneError}</p> : null}
              </section>

              <section>
                <div className="mb-3"><h2 className="text-[17px] font-semibold tracking-[-0.02em] text-slate-900">Promo code</h2><p className="mt-1 text-[13px] text-slate-500">Have a discount code?</p></div>
                <div className="flex gap-2">
                  <input
                    value={promoCode}
                    onChange={(event) => {
                      setPromoCode(event.target.value.toUpperCase());
                      setPromoApplied(false);
                    }}
                    placeholder="Enter promo code"
                    className="flex-1 rounded-[14px] border border-slate-200 bg-white px-3 py-3 text-[15px] text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!promoCode.trim()) return;
                      setPromoApplied(true);
                    }}
                    className="rounded-[14px] bg-slate-900 px-4 py-3 text-[13px] font-semibold text-white hover:bg-slate-800"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied ? <p className="mt-2 text-sm font-semibold text-emerald-600" role="status">Promo code applied to this order.</p> : null}
              </section>

              <section>
                <h2 className="mb-3 text-[17px] font-semibold tracking-[-0.02em] text-slate-900">Order summary</h2>
                <div className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3 text-[15px]">
                      <span className="text-slate-600">Bundle</span>
                      <span className="font-medium text-slate-900">{size ?? "Data"}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-[15px]">
                      <span className="text-slate-600">Network</span>
                      <span className="font-medium text-slate-900">{networkMeta.name}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-[15px]">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-medium text-slate-900">{price ?? "GH₵ 0.00"}</span>
                    </div>
                    {promoApplied ? (
                      <div className="flex items-center justify-between gap-3 text-[15px]">
                        <span className="text-slate-600">Promo</span>
                        <span className="font-medium text-emerald-600">-GH₵ 0.00</span>
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-2 text-[15px]">
                      <span className="font-semibold text-slate-900">Total</span>
                      <span className="font-bold text-slate-900">{price ?? "GH₵ 0.00"}</span>
                    </div>
                  </div>
                </div>
              </section>

              {submitError ? <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{submitError}</p> : null}

              <div className={modal ? "fixed inset-x-0 bottom-0 z-10 border-t border-slate-200 bg-white/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 backdrop-blur-md sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none" : "px-0"}>
                <button type="submit" disabled={!canSubmit} className={`flex w-full items-center justify-center gap-2 rounded-[16px] px-5 py-4 text-[16px] font-semibold transition-all ${canSubmit ? "bg-sky-600 text-white hover:bg-sky-700" : "cursor-not-allowed bg-slate-200 text-slate-500"}`}>
                  <span>Continue to pay</span>
                  <ArrowRight size={18} strokeWidth={2.2} />
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          network={network}
          bundleId={bundleId}
          size={size}
          validity={validity}
          price={price}
          recipient={phoneNumber}
          promoCode={promoApplied ? promoCode : undefined}
          onClose={handleClosePaymentModal}
        />
      )}
    </>
  );
}
