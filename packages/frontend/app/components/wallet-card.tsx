"use client"
import { Plus, ArrowRight } from "lucide-react";

export default function WalletCard({ amount = 'GH₵ 0.00', onFund }: any) {
  return (
    <section className="w-full">
      <div className="wallet-card-shell">
        <div className="wallet-card-content">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="text-sm opacity-90">Wallet Balance</div>
              <div className="text-2xl md:text-3xl font-semibold mt-1">{amount}</div>
              <div className="text-xs md:text-sm opacity-90 mt-1">Available Balance</div>
            </div>
            <div className="ml-auto md:ml-0">
              <button onClick={onFund} aria-label="Fund wallet" className="inline-flex items-center gap-2 bg-white text-sky-700 px-4 py-2 rounded-lg shadow-sm focus-visible:ring-2 focus-visible:ring-sky-300">
                <Plus aria-hidden /> <span>Fund Wallet</span> <ArrowRight size={16} aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
