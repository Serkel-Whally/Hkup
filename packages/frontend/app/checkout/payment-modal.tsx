"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Lock,
  Loader,
  CreditCard,
  Smartphone,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

const NETWORKS = [
  { id: "mtn", name: "MTN", logo: "/mtn.svg" },
  { id: "telecel", name: "Telecel", logo: "/Telecel_Group.png" },
  { id: "airtel", name: "AirtelTigo", logo: "/airtel.svg" },
];

const getNetworkMeta = (networkId: string | null) =>
  NETWORKS.find((network) => network.id === networkId) ?? { id: "", name: "N/A", logo: "/mtn.svg" };

const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

type PaymentModalProps = {
  network: string | null;
  bundleId: string | null;
  size: string | null;
  validity: string | null;
  price: string | null;
  recipient: string;
  promoCode?: string;
  onClose?: () => void;
};

export function PaymentModal({
  network,
  bundleId,
  size,
  validity,
  price,
  recipient,
  promoCode,
  onClose,
}: PaymentModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "mobile">("card");
  const [touched, setTouched] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const networkMeta = useMemo(() => getNetworkMeta(network), [network]);

  // Extract amount from price string (e.g., "GH₵ 50.00" -> 50)
  const getAmount = (): number => {
    if (!price) return 0;
    const match = price.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  const amount = getAmount();

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => {
      console.log("Paystack script loaded successfully");
      setPaystackLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load Paystack script");
      toast.error("Failed to load payment system. Please refresh and try again.");
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const emailError = touched && !validateEmail(email) ? "Please enter a valid email address" : "";
  const canSubmit = validateEmail(email) && amount > 0;

  const handlePayment = async () => {
    try {
      setTouched(true);

      if (!paystackLoaded) {
        toast.error("Payment system is still loading. Please try again.");
        return;
      }

      if (!validateEmail(email)) {
        toast.error("Please enter a valid email address");
        return;
      }

      if (!PAYSTACK_PUBLIC_KEY) {
        console.error("Paystack public key not found");
        toast.error("Payment configuration error. Please contact support.");
        return;
      }

      setLoading(true);
      setSubmitError("");

      console.log("Initiating Paystack payment", {
        amount,
        email,
        paymentMethod,
      });

      // Generate a unique reference
      const reference = `HKUP-${network}-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

      // Convert to pesewas (multiply by 100)
      const amountInPesewas = Math.round(amount * 100);

      // Initialize Paystack payment
      const handler = (window as any).PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: email,
        amount: amountInPesewas,
        currency: "GHS",
        ref: reference,
        channels:
          paymentMethod === "mobile"
            ? ["mobile_money"]
            : ["card"],
        label: "Pay for Data Bundle",
        metadata: {
          network: network,
          bundle_id: bundleId,
          size: size,
          recipient: recipient,
          promo_code: promoCode || null,
          custom_fields: [
            {
              display_name: "Network",
              variable_name: "network",
              value: network,
            },
            {
              display_name: "Bundle Size",
              variable_name: "bundle_size",
              value: size,
            },
            {
              display_name: "Recipient",
              variable_name: "recipient",
              value: recipient,
            },
          ],
        },
        callback: function (response: any) {
          console.log("Payment successful! Reference:", response.reference);
          toast.success("Payment successful! Processing your order...");

          // Store payment details and redirect to success page
          const paymentData = {
            reference: response.reference,
            email: email,
            amount: amount,
            network: network,
            bundleId: bundleId,
            size: size,
            recipient: recipient,
            promoCode: promoCode || null,
            timestamp: Date.now(),
          };

          localStorage.setItem("lastPaymentData", JSON.stringify(paymentData));

          // Redirect to order confirmation page
          router.push(`/order-confirmation?ref=${response.reference}`);
          setLoading(false);
        },
        onClose: function () {
          setLoading(false);
          toast("Payment window closed. Your order was not completed.");
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error("Payment error:", error);
      const errorMessage = error instanceof Error ? error.message : "Payment failed. Please try again.";
      setSubmitError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const close = useMemo(() => onClose ?? (() => router.back()), [onClose, router]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Complete your payment"
      onClick={close}
      className="fixed inset-0 z-50 flex items-end overflow-hidden bg-black/40 sm:items-center sm:justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-md"
      >
        {/* Modal Card */}
        <div className="flex max-h-[90vh] flex-col overflow-hidden rounded-t-[28px] bg-white sm:rounded-[20px]">
          {/* Header */}
          <header className="shrink-0 border-b border-slate-100 bg-white px-4 pt-2 sm:px-6 sm:pt-4">
            <div className="mx-auto mb-1 flex h-1 w-10 rounded-full bg-slate-200 sm:hidden" aria-hidden="true" />
            <div className="flex h-14 items-center justify-between">
              <button
                type="button"
                onClick={close}
                aria-label="Go back"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft size={24} strokeWidth={2.5} className="text-slate-900" />
              </button>
              <h1 className="text-[18px] sm:text-[20px] font-semibold tracking-[-0.02em] text-slate-900">
                Complete Payment
              </h1>
              <div className="w-11" />
            </div>
          </header>

          {/* Main Content */}
          <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="mx-auto w-full max-w-md space-y-5 px-4 py-5 sm:px-6">
              {/* Order Summary Card */}
              <section className="rounded-[18px] border border-slate-200 bg-slate-50 p-4 shadow-sm">
                <h2 className="mb-4 text-[15px] font-semibold tracking-[-0.02em] text-slate-900">
                  Order Summary
                </h2>

                {/* Network & Bundle */}
                <div className="mb-4 flex items-center gap-3 rounded-[16px] bg-white p-3 border border-slate-100">
                  <div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
                    <Image
                      src={networkMeta.logo}
                      alt={networkMeta.name}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-slate-500">Network</p>
                    <p className="text-[15px] font-semibold text-slate-900">
                      {networkMeta.name}
                    </p>
                  </div>
                </div>

                {/* Bundle Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-[12px] bg-white p-3 border border-slate-100">
                    <p className="text-[12px] text-slate-500 mb-1">Size</p>
                    <p className="text-[15px] font-semibold text-slate-900">{size}</p>
                  </div>
                  <div className="rounded-[12px] bg-white p-3 border border-slate-100">
                    <p className="text-[12px] text-slate-500 mb-1">Validity</p>
                    <p className="text-[13px] font-semibold text-slate-900 line-clamp-1">
                      {validity}
                    </p>
                  </div>
                </div>

                {/* Recipient & Price */}
                <div className="space-y-3">
                  <div className="rounded-[12px] bg-white p-3 border border-slate-100">
                    <p className="text-[12px] text-slate-500 mb-1">Recipient</p>
                    <p className="text-[15px] font-semibold text-slate-900 font-mono">{recipient}</p>
                  </div>
                  <div className="flex items-center justify-between rounded-[12px] bg-white p-3 border border-slate-100">
                    <span className="text-[13px] text-slate-600">Total Amount</span>
                    <span className="text-[18px] font-bold text-slate-900">{price}</span>
                  </div>
                </div>
              </section>

              {/* Email Input */}
              <section>
                <label htmlFor="email" className="mb-2 block text-[15px] font-semibold tracking-[-0.02em] text-slate-900">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched(true)}
                  placeholder="you@example.com"
                  aria-describedby={emailError ? "email-error" : undefined}
                  className={`w-full rounded-[14px] border px-4 py-3 text-[15px] placeholder-slate-400 outline-none transition-all ${
                    emailError
                      ? "border-red-300 bg-red-50 text-red-900 focus:ring-2 focus:ring-red-200"
                      : "border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                  }`}
                />
                {emailError && (
                  <p
                    id="email-error"
                    className="mt-2 text-[13px] text-red-600"
                    role="alert"
                  >
                    {emailError}
                  </p>
                )}
                <p className="mt-2 text-[12px] text-slate-500">
                  Your receipt and order details will be sent to this email.
                </p>
              </section>

              {/* Payment Method Selection */}
              <section>
                <h3 className="mb-3 text-[15px] font-semibold tracking-[-0.02em] text-slate-900">
                  Payment Method
                </h3>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`w-full rounded-[14px] border-2 p-4 text-left transition-all ${
                      paymentMethod === "card"
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                          paymentMethod === "card"
                            ? "border-blue-500 bg-blue-500"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {paymentMethod === "card" && (
                          <CheckCircle size={20} className="text-white" strokeWidth={3} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 flex items-center gap-2">
                          <CreditCard size={18} />
                          Card Payment
                        </p>
                        <p className="text-[13px] text-slate-500">
                          Pay with debit or credit card
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("mobile")}
                    className={`w-full rounded-[14px] border-2 p-4 text-left transition-all ${
                      paymentMethod === "mobile"
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                          paymentMethod === "mobile"
                            ? "border-blue-500 bg-blue-500"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {paymentMethod === "mobile" && (
                          <CheckCircle size={20} className="text-white" strokeWidth={3} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 flex items-center gap-2">
                          <Smartphone size={18} />
                          Mobile Money
                        </p>
                        <p className="text-[13px] text-slate-500">
                          Pay using MTN MoMo or Telecel Cash
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </section>

              {/* Security Info */}
              <div className="flex items-center gap-2 rounded-[12px] bg-emerald-50 px-3 py-2.5 border border-emerald-100">
                <Lock size={16} className="text-emerald-600 shrink-0" />
                <p className="text-[12px] text-emerald-700">
                  Your payment information is secure and encrypted with SSL
                </p>
              </div>

              {/* Error Message */}
              {submitError && (
                <div className="rounded-[12px] border border-red-200 bg-red-50 px-3 py-2.5">
                  <p className="text-[13px] text-red-700" role="alert">
                    {submitError}
                  </p>
                </div>
              )}
            </div>
          </main>

          {/* Footer Buttons - Fixed */}
          <div className="shrink-0 border-t border-slate-100 bg-white px-4 py-3 sm:px-6 sm:py-4">
            <button
              type="button"
              onClick={handlePayment}
              disabled={loading || !paystackLoaded || !canSubmit}
              className={`w-full rounded-[12px] px-6 py-3 font-semibold text-[15px] transition-all flex items-center justify-center gap-2 ${
                loading || !paystackLoaded || !canSubmit
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
              }`}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Processing...
                </>
              ) : !paystackLoaded ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Pay {price}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
