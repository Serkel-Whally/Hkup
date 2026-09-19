"use client";

import Link from "next/link";
import { ArrowDownLeft, ArrowRight, ArrowUpRight, CreditCard, WalletCards } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { DashboardShell } from "@/app/components/dashboard-shell";
import WalletCard from "@/app/components/wallet-card";
import TransactionItem from "@/app/components/transaction-item";

type WalletOrder = { id: string; network: string; bundleSize: string; recipientPhone: string; amount: string; createdAt: string; deliveryStatus: string };

function formatStatus(status: string) {
	const normalized = String(status ?? "").toUpperCase();
	if (normalized === "DELIVERED") return "Successful";
	if (normalized === "FAILED") return "Failed";
	return "Processing";
}

function formatDate(value: string) {
	return new Intl.DateTimeFormat("en-GH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function WalletPage() {
	const { data: session } = useSession();
	const [balance, setBalance] = useState("GH₵0.00");
	const [spentThisMonth, setSpentThisMonth] = useState("GH₵0.00");
	const [walletActivity, setWalletActivity] = useState<WalletOrder[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const loadWallet = () => {
			if (!session?.user) {
				setError("Please sign in to view your wallet.");
				setBalance("GH₵0.00");
				setSpentThisMonth("GH₵0.00");
				setWalletActivity([]);
				setLoading(false);
				return;
			}

			setError("");
			setBalance("GH₵0.00");
			setSpentThisMonth("GH₵0.00");
			setWalletActivity([]);
			setLoading(false);
		};

		loadWallet();
	}, [session]);
	return (
		<DashboardShell active="/wallet">
				<div className="mx-auto w-full max-w-5xl space-y-6">
					<header>
						<p className="text-sm font-medium text-sky-600">Account balance</p>
						<h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">Wallet</h1>
						<p className="mt-2 text-sm text-slate-500">Manage your balance and review wallet activity.</p>
					</header>

					{error ? <p className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700" role="alert">{error}</p> : null}
					<WalletCard amount={loading ? "Loading..." : balance} />

					<section className="grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label="Wallet actions">
						<Link href="/buy-data" className="flex min-h-16 items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-[0_6px_18px_rgba(15,23,42,0.03)] transition hover:border-sky-200 hover:bg-sky-50/30">
							<span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-600"><ArrowUpRight size={19} /></span>
							<span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-900">Spend from wallet</span><span className="mt-1 block text-xs text-slate-500">Buy a data bundle</span></span>
							<ArrowRight size={17} className="text-slate-400" />
						</Link>
						<Link href="/transactions" className="flex min-h-16 items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-[0_6px_18px_rgba(15,23,42,0.03)] transition hover:border-sky-200 hover:bg-sky-50/30">
							<span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><ArrowDownLeft size={19} /></span>
							<span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-900">View wallet activity</span><span className="mt-1 block text-xs text-slate-500">See all transactions</span></span>
							<ArrowRight size={17} className="text-slate-400" />
						</Link>
					</section>

					<section className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Wallet summary">
						<SummaryCard icon={<WalletCards size={18} />} label="Available balance" value={loading ? "Loading..." : balance} />
						<SummaryCard icon={<ArrowUpRight size={18} />} label="This month spent" value={loading ? "Loading..." : spentThisMonth} tone="blue" />
						<SummaryCard icon={<CreditCard size={18} />} label="Payment method" value="Available at checkout" tone="green" />
					</section>

					<section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.03)] md:p-6">
						<div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
							<div>
								<h2 className="text-lg font-semibold text-slate-900">Recent wallet activity</h2>
								<p className="mt-1 text-xs text-slate-500">Your latest wallet-related purchases</p>
							</div>
							<Link href="/transactions" className="text-sm font-medium text-sky-600 hover:text-sky-700">View all</Link>
						</div>
						<ul className="divide-y divide-slate-100" role="list">
							{walletActivity.map((order) => <TransactionItem key={order.id} transaction={{ id: order.id, network: order.network, bundle: `${order.bundleSize} Data Bundle`, recipient: order.recipientPhone, amount: order.amount.startsWith("GH₵") ? order.amount : `GH₵ ${order.amount}`, datetime: formatDate(order.createdAt), status: formatStatus(order.deliveryStatus) }} />)}
							{!loading && walletActivity.length === 0 ? <li className="py-8 text-center text-sm text-slate-500">No paid wallet activity yet.</li> : null}
						</ul>
					</section>
				</div>
			</DashboardShell>
		);
}

function SummaryCard({ icon, label, value, tone = "slate" }: { icon: React.ReactNode; label: string; value: string; tone?: "slate" | "blue" | "green" }) {
	const tones = { slate: "bg-slate-50 text-slate-600", blue: "bg-sky-50 text-sky-600", green: "bg-emerald-50 text-emerald-600" };
	return (
		<div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-[0_6px_18px_rgba(15,23,42,0.02)]">
			<div className={`flex h-10 w-10 items-center justify-center rounded-full ${tones[tone]}`}>{icon}</div>
			<div className="min-w-0"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 truncate text-base font-semibold text-slate-900">{value}</p></div>
		</div>
	);
}
