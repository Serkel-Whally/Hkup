import Link from "next/link";
import { InfoPage } from "../components/info-page";

export default function SupportPage() {
  return (
    <InfoPage title="Support">
      <p>Use this guide to prepare the details needed to resolve a bundle, order, or payment question. Support contact details have not been configured yet, so please do not send account or payment credentials through unofficial channels.</p>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Check an existing order</h2>
        <ol className="list-decimal space-y-2 pl-6">
          <li>Sign in with the email address used for the purchase.</li>
          <li>Open your transactions and locate the order using its reference.</li>
          <li>Check the payment and order statuses before trying the payment again.</li>
        </ol>
        <div className="flex flex-wrap gap-3">
          <Link href="/login" className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 hover:border-sky-400">Sign in</Link>
          <Link href="/transactions" className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 hover:border-sky-400">View transactions</Link>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Before you place an order</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Confirm the mobile network and bundle size.</li>
          <li>Check the recipient's phone number carefully, including its network.</li>
          <li>Review the amount and payment method shown at checkout.</li>
          <li>Keep the order reference and payment confirmation for your records.</li>
        </ul>
        <Link href="/buy-data" className="inline-flex rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 hover:border-sky-400">Browse bundles</Link>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Payment or delivery issue</h2>
        <p>If a payment is pending, check its status before submitting another payment to avoid a duplicate charge. If the payment provider confirms a charge but the order does not update, save the order reference, payment date, amount, and provider confirmation so the operator can investigate.</p>
        <p>Never share your password, one-time passcode, mobile-money PIN, full card number, or card security code with anyone claiming to provide support.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Contact availability</h2>
        <p>A support email address, phone number, and response-time commitment have not been supplied for this service. The operator should publish verified contact details here before launch.</p>
      </section>
    </InfoPage>
  );
}
