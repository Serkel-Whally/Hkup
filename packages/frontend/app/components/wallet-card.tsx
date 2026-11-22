"use client";

import { Plus, ArrowRight } from "lucide-react";

type WalletCardProps = {
  amount?: string;
  onFund?: () => void;
};

export default function WalletCard({
  amount = "GH₵ 0.00",
  onFund,
}: WalletCardProps) {
  return (
    <section className="w-full" aria-label="Wallet overview">
      <div className="wallet-card-shell">
        <div className="wallet-card-content">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium opacity-90">
                Available balance
              </p>

              <p
                className="text-3xl font-bold tracking-tight sm:text-4xl"
                aria-label={`Wallet balance ${amount}`}
              >
                {amount}
              </p>

              <p className="text-xs opacity-85">
                Ready to spend
              </p>
            </div>

            <button
              type="button"
              onClick={onFund}
              className="
                inline-flex w-full items-center justify-center gap-2
                rounded-xl bg-white px-5 py-3
                font-semibold text-sky-700 shadow-sm
                transition-colors hover:bg-sky-50
                active:scale-[0.98]
                focus-visible:outline focus-visible:outline-2
                focus-visible:outline-offset-4 focus-visible:outline-white
                sm:w-auto
              "
            >
              <Plus size={18} aria-hidden="true" />
              <span>Fund Wallet</span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
