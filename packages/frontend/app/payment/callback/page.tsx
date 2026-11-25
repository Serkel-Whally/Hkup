"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authHeaders, getAuthSession } from "@/app/lib/auth";

function PaymentCallbackContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState("Confirming your payment securely…");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const reference = params.get("reference") || params.get("trxref");
    if (!reference) {
      setMessage("We couldn't find your payment reference. Check your transactions before trying again.");
      setFailed(true);
      return;
    }
    if (!getAuthSession()?.token) {
      router.replace(`/login?next=${encodeURIComponent(`/payment/callback?reference=${reference}`)}`);
      return;
    }

    let cancelled = false;
    const verify = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiUrl}/api/payments/paystack/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({ reference }),
        });
        const result = await response.json();
        if (!response.ok || result.order?.paymentStatus !== "PAID") {
          throw new Error(result.error || "Payment is not confirmed yet. Please contact support if you were charged.");
        }
        if (!cancelled) router.replace(`/transactions/${encodeURIComponent(reference)}`);
      } catch (error) {
        if (cancelled) return;
        setMessage(error instanceof Error ? error.message : "We couldn't verify this payment.");
        setFailed(true);
      }
    };
    void verify();
    return () => { cancelled = true; };
  }, [params, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm">
        <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${failed ? "bg-rose-50 text-rose-600" : "bg-sky-50 text-sky-600"}`} aria-hidden="true">
          {failed ? "!" : "…"}
        </div>
        <h1 className="text-lg font-semibold text-slate-900">{failed ? "Payment verification needs attention" : "Verifying payment"}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600" role={failed ? "alert" : "status"}>{message}</p>
        {failed ? <button type="button" onClick={() => router.push("/transactions")} className="mt-5 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white">View my transactions</button> : null}
      </section>
    </main>
  );
}

export default function PaymentCallbackPage() {
  return <Suspense fallback={<main className="flex min-h-screen items-center justify-center text-sm text-slate-500">Loading payment status…</main>}><PaymentCallbackContent /></Suspense>;
}
