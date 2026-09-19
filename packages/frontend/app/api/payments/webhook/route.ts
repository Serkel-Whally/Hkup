import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/app/lib/supabase/admin";
import { EXPECTED_CURRENCY, getPaystackWebhookSecret, verifyPaystackSignature } from "@/app/lib/paystack";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature");
    const secret = getPaystackWebhookSecret() || process.env.PAYSTACK_SECRET_KEY?.trim();

    if (!secret) {
      return NextResponse.json({ error: "Paystack webhook secret is not configured." }, { status: 500 });
    }

    if (!verifyPaystackSignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: "Invalid Paystack signature." }, { status: 401 });
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Malformed webhook payload." }, { status: 400 });
    }

    const event = payload?.event;
    const reference = payload?.data?.reference;
    const eventId = payload?.data?.id ? String(payload.data.id) : null;

    if (!event || !reference || !eventId) {
      return NextResponse.json({ error: "Missing webhook event details." }, { status: 400 });
    }

    if (event !== "charge.success") {
      return NextResponse.json({ received: true, ignored: true }, { status: 200 });
    }

    const admin = createSupabaseAdminClient();

    const { data: existingEvent, error: eventLookupError } = await admin
      .from("payment_events")
      .select("id")
      .eq("event_id", eventId)
      .maybeSingle();

    if (eventLookupError) {
      return NextResponse.json({ error: "Unable to check webhook event idempotency." }, { status: 500 });
    }

    if (existingEvent) {
      return NextResponse.json({ received: true, status: "already_processed" }, { status: 200 });
    }

    const { data: order, error } = await admin
      .from("orders")
      .select("*")
      .eq("provider_reference", reference)
      .maybeSingle();

    if (error || !order) {
      return NextResponse.json({ received: true, ignored: true }, { status: 200 });
    }

    if (order.payment_status === "paid") {
      await admin.from("payment_events").insert({
        order_id: order.id,
        provider_reference: reference,
        event_id: eventId,
        event_type: event,
        payload,
      });
      return NextResponse.json({ received: true, status: "already_processed" }, { status: 200 });
    }

    const providerAmount = Number((payload?.data?.amount ?? 0) / 100);
    const providerCurrency = String(payload?.data?.currency ?? "").toUpperCase();

    if (providerCurrency !== EXPECTED_CURRENCY || providerAmount !== Number(order.amount ?? 0)) {
      const { error: eventInsertError } = await admin.from("payment_events").insert({
        order_id: order.id,
        provider_reference: reference,
        event_id: eventId,
        event_type: event,
        payload,
      });

      if (eventInsertError) {
        return NextResponse.json({ received: true, status: "rejected_mismatch" }, { status: 200 });
      }

      return NextResponse.json({ received: true, status: "rejected_mismatch" }, { status: 200 });
    }

    const { error: updateError } = await admin
      .from("orders")
      .update({ payment_status: "paid", updated_at: new Date().toISOString() })
      .eq("id", order.id);

    if (updateError) {
      return NextResponse.json({ error: "Unable to update order state." }, { status: 500 });
    }

    const { error: eventInsertError } = await admin.from("payment_events").insert({
      order_id: order.id,
      provider_reference: reference,
      event_id: eventId,
      event_type: event,
      payload,
    });

    if (eventInsertError) {
      return NextResponse.json({ received: true, status: "processed_without_event_record" }, { status: 200 });
    }

    return NextResponse.json({ received: true, status: "processed" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to process webhook." },
      { status: 500 }
    );
  }
}
