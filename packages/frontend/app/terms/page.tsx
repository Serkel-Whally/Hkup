import { InfoPage } from "../components/info-page";

export default function TermsPage() {
  return (
    <InfoPage title="Terms and conditions">
      <p>These terms are a draft and must be reviewed by the Cellulite Bundle operator before the service is launched.</p>
      <h2 className="text-xl font-semibold text-slate-900">Orders</h2>
      <p>Before submitting an order, check that the selected network, bundle, and recipient phone number are correct. Orders are subject to payment confirmation and the availability of the selected bundle.</p>
      <h2 className="text-xl font-semibold text-slate-900">Service information</h2>
      <p>Final terms for payments, cancellations, refunds, delivery timing, and customer responsibilities have not yet been provided and should be added before accepting customer orders.</p>
    </InfoPage>
  );
}
