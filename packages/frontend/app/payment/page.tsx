"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PaymentModal } from "../checkout/payment-modal";

function PaymentPageContent() {
  const searchParams = useSearchParams();

  const network = searchParams.get("network");
  const bundleId = searchParams.get("bundle");
  const size = searchParams.get("size");
  const validity = searchParams.get("validity");
  const price = searchParams.get("price");
  const recipient = searchParams.get("recipient");
  const promoCode = searchParams.get("promoCode");

  return (
    <PaymentModal
      network={network}
      bundleId={bundleId}
      size={size}
      validity={validity}
      price={price}
      recipient={recipient || ""}
      promoCode={promoCode || undefined}
      onClose={() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          window.history.back();
          return;
        }
        window.location.href = "/checkout";
      }}
    />
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <PaymentPageContent />
    </Suspense>
  );
}
