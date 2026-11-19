import Link from "next/link";
import { InfoPage } from "../components/info-page";

export default function AboutPage() {
  return (
    <InfoPage title="About Cellulite Bundle">
      <p>Cellulite Bundle is a mobile-data bundle storefront for customers in Ghana. It brings offers for MTN, Telecel, and AirtelTigo together so customers can compare available bundles and place an order for themselves or another recipient.</p>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">How it works</h2>
        <ol className="list-decimal space-y-2 pl-6">
          <li>Browse the currently listed bundles and choose a network, size, and validity period.</li>
          <li>Enter the recipient's mobile number and confirm that it matches the selected network.</li>
          <li>Review the order total and complete the payment options shown at checkout.</li>
          <li>Use your order reference and account transaction history to check the order status.</li>
        </ol>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Accounts and orders</h2>
        <p>You can browse bundles without an account. Creating an account lets you sign in and view orders associated with that account. The recipient's number may differ from the phone number on the account.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Availability</h2>
        <p>Bundle availability, price, validity, payment options, and fulfilment depend on the offers and integrations enabled at the time of purchase. Always review the final order details before paying. An order-status update is not, by itself, a guarantee of delivery by a particular time.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Our aim</h2>
        <p>Our aim is to make it straightforward to choose a data bundle, pay for an order, and keep the important order details in one place. For practical help, see the <Link href="/support" className="font-semibold text-sky-700 hover:underline">Support page</Link>.</p>
      </section>
    </InfoPage>
  );
}
