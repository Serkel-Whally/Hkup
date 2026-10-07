"use client";

import { useSearchParams } from "next/navigation";
import { PaymentModal } from "./payment-modal";
import { Suspense } from "react";

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
      onClose={() => window.history.back()}
    />
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <PaymentPageContent />
    </Suspense>
  );
}
