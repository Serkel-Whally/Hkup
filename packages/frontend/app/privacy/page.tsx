import { InfoPage } from "../components/info-page";

export default function PrivacyPage() {
  return (
    <InfoPage title="Privacy">
      <p>This privacy notice is a starting point and should be reviewed and completed by the Cellulite Bundle operator before launch.</p>
      <h2 className="text-xl font-semibold text-slate-900">Information used by the service</h2>
      <p>Account registration asks for a name, email address, and phone number. Placing an order also requires the recipient's number and the selected bundle so the order can be processed.</p>
      <h2 className="text-xl font-semibold text-slate-900">Payments and questions</h2>
      <p>Payment details are handled through the payment provider shown during checkout. This page does not yet describe data retention, sharing, or deletion practices; those details need to be confirmed by the service operator.</p>
    </InfoPage>
  );
}
