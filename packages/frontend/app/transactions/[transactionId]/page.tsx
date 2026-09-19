import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarRange, CheckCircle2, Clock3, CreditCard, List, Phone, Receipt, Truck, XCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/app/components/dashboard-shell";
import { getCurrentCustomerOrderById } from "@/app/lib/supabase/customer";

export default async function TransactionDetailPage({ params }: { params: Promise<{ transactionId: string }> }) {
  const routeParams = await params;
  const order = await getCurrentCustomerOrderById(routeParams.transactionId);
  if (!order) notFound();

  const transaction = {
    id: order.id,
    network: order.network,
    bundle: `${order.bundle_size} Data Bundle`,
    recipient: order.recipient_phone,
    amount: `GH₵ ${Number(order.amount ?? 0).toFixed(2)}`,
    datetime: new Intl.DateTimeFormat("en-GH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(order.created_at)),
    status: order.payment_status === "failed" || order.delivery_status === "failed" ? "Failed" : order.payment_status === "paid" && order.delivery_status === "delivered" ? "Successful" : "Processing",
    payment: order.payment_method,
    reference: order.reference,
  };
  const successful = transaction.status === "Successful";
  const processing = transaction.status === "Processing";

  return <DashboardShell active="/transactions"><div className="mx-auto w-full max-w-3xl space-y-6"><Link href="/transactions" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-sky-600"><ArrowLeft size={17} /> Back to transactions</Link><header><p className="text-sm font-medium text-sky-600">Transaction details</p><h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">{transaction.bundle}</h1><p className="mt-2 break-all text-sm text-slate-500">Transaction ID: TXN-20250815-1024{transaction.id}</p></header><section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-7"><div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5"><div><p className="text-xs uppercase tracking-wide text-slate-400">Amount paid</p><p className="mt-1 text-3xl font-bold text-sky-600">{transaction.amount}</p></div><span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${successful ? "bg-emerald-50 text-emerald-700" : processing ? "bg-sky-50 text-sky-700" : "bg-red-50 text-red-700"}`}>{successful ? <CheckCircle2 size={15} /> : processing ? <Clock3 size={15} /> : <XCircle size={15} />}{transaction.status}</span></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><Detail icon={<List />} label="Bundle" value={transaction.bundle} /><Detail icon={<Receipt />} label="Network" value={transaction.network} /><Detail icon={<Phone />} label="Recipient" value={transaction.recipient} /><Detail icon={<CalendarRange />} label="Date and time" value={transaction.datetime} /><Detail icon={<CreditCard />} label="Payment method" value={transaction.payment} /><Detail icon={<Truck />} label="Delivery status" value={successful ? "Delivered" : processing ? "Being processed" : "Unsuccessful"} /></div></section><div className="grid gap-3 sm:grid-cols-2"><Link href="/transactions" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-sky-200 bg-white text-sm font-bold text-sky-600">All transactions <ArrowRight size={17} /></Link><Link href="/track-order" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-sky-600 text-sm font-bold text-white">Track order <Truck size={17} /></Link></div></div></DashboardShell>;
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="flex min-w-0 items-center gap-3 rounded-xl bg-slate-50 p-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sky-600 shadow-sm">{icon}</span><div className="min-w-0"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 break-words text-sm font-semibold text-slate-900">{value}</p></div></div>; }