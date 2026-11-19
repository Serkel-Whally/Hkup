import { InfoPage } from "../components/info-page";

export default function TermsPage() {
  return (
    <InfoPage title="Terms and conditions">
      <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200"><strong>Draft for operator review:</strong> these terms explain the current intended ordering flow but are not a substitute for legal advice. The operator must complete the highlighted policy gaps, confirm applicable Ghanaian requirements, and approve a final version before accepting customer orders.</p>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Using the service</h2>
        <p>Cellulite Bundle provides a storefront for viewing listed mobile-data bundles and submitting purchase orders. By using the service, you agree to provide accurate information, use the service lawfully, and follow the final terms published by the operator. The operator must add any age or eligibility restrictions that apply.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Bundle information and order checks</h2>
        <p>Before paying, check the selected network, bundle size, validity, recipient phone number, and total shown at checkout. Confirm that the recipient number is eligible for the selected network and bundle. The operator should correct material listing errors and confirm the bundle and price before payment is accepted.</p>
        <p>Listings and availability may change. The final price and bundle details shown during checkout are the ones to review for that order. Network coverage, service quality, and bundle restrictions are controlled by the relevant mobile network operator.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Payment and order status</h2>
        <p>Checkout displays the payment methods available for the order. The application integrates Paystack for payment initialization and verification. An order may remain pending while payment is being confirmed; do not assume an order is paid until the order status confirms it.</p>
        <p>Keep the order reference and payment confirmation. If you see a charge but the order remains pending, check the status and contact the operator using its verified support channel before attempting another payment.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Delivery, cancellations, and refunds</h2>
        <p>Delivery timing, fulfilment failure handling, cancellation eligibility, refund method, and refund timeframes have not been defined in the current service policy. The operator must publish clear rules for these matters before taking payments. Nothing on this page should be read as waiving rights that cannot be excluded under applicable law.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Accounts and security</h2>
        <p>You are responsible for keeping your sign-in credentials private and for activity performed through your account. Notify the operator promptly if you believe your account has been accessed without permission. The operator must publish a process for securing, suspending, or closing accounts.</p>
        <p>Never share passwords, one-time passcodes, mobile-money PINs, or card security codes with anyone claiming to represent the service.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Availability and changes</h2>
        <p>The service and its integrations may be unavailable or changed from time to time. The operator should provide notice for material changes where required and preserve any rights and obligations that already apply to submitted orders.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Complaints and legal details</h2>
        <p>The operator has not provided a complaint-handling process, official contact details, governing law, or dispute-resolution procedure. These details must be confirmed and added before these draft terms are used as a binding customer agreement.</p>
      </section>
    </InfoPage>
  );
}
