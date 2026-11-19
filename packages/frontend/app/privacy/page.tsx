import { InfoPage } from "../components/info-page";

export default function PrivacyPage() {
  return (
    <InfoPage title="Privacy">
      <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200"><strong>Operator review required:</strong> this notice describes the information the current application is designed to process. The operator must confirm its actual hosting, retention, sharing, and contact practices and obtain appropriate legal review before relying on or publishing this notice as a final policy.</p>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Information collected</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Account details:</strong> name, email address, phone number, and a password hash when you create an account. The application stores a hash rather than the submitted password.</li>
          <li><strong>Order details:</strong> order reference, selected network and bundle, recipient phone number, amount and currency, payment method/provider, order and payment statuses, and related timestamps. Orders may be created without being linked to an account.</li>
          <li><strong>Payment information:</strong> checkout requests an email address and sends payment details needed to initialize and verify a transaction. The payment provider processes the payment. Do not enter payment information except in the provider's checkout flow.</li>
          <li><strong>Technical and support information:</strong> information you provide when asking for help and technical records generated while operating the service may be processed. The operator must confirm the specific logs and analytics in use.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">How information is used</h2>
        <p>The application uses account information to create and authenticate accounts; order information to create, identify, and display orders; and payment references and status information to verify payments and update order records. Information may also be used to investigate errors, respond to support requests, protect the service, and meet legal obligations that apply to the operator.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Service providers and sharing</h2>
        <p>Payment transactions are integrated with Paystack. Information required to initiate or verify a payment is sent to the payment provider, which handles that information under its own terms and privacy notice. A recipient phone number and bundle details are necessary to process an order; the operator must confirm which network or fulfilment partners receive them and document those arrangements before launch.</p>
        <p>The service should not disclose personal information for unrelated purposes. The operator must document any additional providers, hosting locations, international transfers, and disclosures required by law.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Storage and security</h2>
        <p>Account records and order records are stored by the backend service. The browser also stores an authentication token for signed-in sessions and a theme preference. No specific retention period, backup schedule, or complete security program has been established in this notice; the operator must define and publish those practices and protect access to production systems.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Your choices and requests</h2>
        <p>You may choose not to create an account, although some account features will then be unavailable. To request access to, correction of, or deletion of personal information, use the verified contact details published by the operator. Those contact details and a formal request process are not configured yet and must be added before launch.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Children and changes</h2>
        <p>The service is not specifically designed for children. The operator must set and publish an age policy appropriate to the service and applicable law. If this notice changes, the operator should publish the updated version and its effective date here.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Privacy contact</h2>
        <p>A privacy contact, governing jurisdiction, and response timeframe have not been provided. The operator must add verified details and confirm the applicable legal requirements before this notice is treated as final.</p>
      </section>
    </InfoPage>
  );
}
