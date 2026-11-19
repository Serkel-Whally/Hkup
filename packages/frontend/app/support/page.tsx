import Link from "next/link";
import { InfoPage } from "../components/info-page";

export default function SupportPage() {
  return (
    <InfoPage title="Support">
      <p>Need help with Cellulite Bundle? You can sign in to review your account and transactions, or browse available data bundles.</p>
      <div className="flex flex-wrap gap-3">
        <Link href="/login" className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 hover:border-sky-400">Sign in</Link>
        <Link href="/buy-data" className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 hover:border-sky-400">Browse bundles</Link>
      </div>
      <p>Direct support contact details are not configured yet. They will be published here when available.</p>
    </InfoPage>
  );
}
