import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/app/lib/supabase/admin";
import { createSupabaseServerClient } from "@/app/lib/supabase/server";
import { EXPECTED_CURRENCY, PAYSTACK_BASE_URL, getPaystackSecret, normalizePaystackAmount } from "@/app/lib/paystack";
import { headers } from "next/headers";

async function getOrderWithAuth(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>, userId: string, bundleId: string, recipientPhone: string, idempotencyKey: string) {
  const { data: bundle, error: bundleError } = await supabase
    .from("bundles")
    .select("id, network, size, validity, price, active")
    .eq("id", bundleId)
    .maybeSingle();

  if (bundleError || !bundle) {
    throw new Error("Bundle not found.");
  }

  if (!bundle.active) {
    throw new Error("Bundle is not available.");
  }

  const { data, error } = await supabase.rpc("purchase_bundle", {
    p_bundle_id: bundle.id,
    p_recipient_phone: recipientPhone,
    p_payment_method: "payment_gateway",
    p_idempotency_key: idempotencyKey,
  });

  if (error) {
    throw new Error(error.message);
  }

  const order = Array.isArray(data) ? data[0] : data;
  if (!order || order.user_id !== userId) {
    throw new Error("Order could not be created for the authenticated user.");
  }

  return { bundle, order };
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const bundleId = String(body?.bundleId ?? "").trim();
    const recipientPhone = String(body?.recipientPhone ?? "").trim();
    const paymentMethod = String(body?.paymentMethod ?? "payment_gateway").trim();
    const idempotencyKey = String(body?.idempotencyKey ?? "").trim();

    if (!bundleId || !recipientPhone || !idempotencyKey) {
      return NextResponse.json({ error: "Missing required purchase fields." }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    if (paymentMethod === "wallet") {
      const { data, error } = await supabase.rpc("purchase_bundle", {
        p_bundle_id: bundleId,
        p_recipient_phone: recipientPhone,
        p_payment_method: "wallet",
        p_idempotency_key: idempotencyKey,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ status: "paid", order: Array.isArray(data) ? data[0] : data }, { status: 200 });
    }

    const { bundle, order } = await getOrderWithAuth(
      supabase,
      user.id,
      bundleId,
      recipientPhone,
      idempotencyKey
    );

    const paystackSecret = getPaystackSecret();
    if (!paystackSecret) {
      return NextResponse.json({ error: "Paystack secret is not configured." }, { status: 500 });
    }

    const reference = `CELL-${Date.now()}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
    const amountInKobo = normalizePaystackAmount(Number(bundle.price));
    const email = user.email || "customer@example.com";
    const headerStore = await headers();
    const host = headerStore.get("host") ?? "localhost:3000";
    const forwardedProto = headerStore.get("x-forwarded-proto") ?? "http";
    const callbackUrl = `${forwardedProto}://${host}/success?reference=${encodeURIComponent(reference)}`;

    const paystackResponse = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: String(amountInKobo),
        currency: EXPECTED_CURRENCY,
        reference,
        callback_url: callbackUrl,
        metadata: {
          order_id: order.id,
          user_id: user.id,
          bundle_id: bundle.id,
          recipient_phone: recipientPhone,
          payment_method: "payment_gateway",
          idempotency_key: idempotencyKey,
        },
      }),
    });

    const paystackPayload = await paystackResponse.json().catch(() => ({}));

    if (!paystackResponse.ok || !paystackPayload?.data?.authorization_url) {
      return NextResponse.json(
        { error: paystackPayload?.message || "Unable to initialize Paystack checkout." },
        { status: 502 }
      );
    }

    const admin = createSupabaseAdminClient();
    const { error: updateError } = await admin
      .from("orders")
      .update({ provider_reference: reference })
      .eq("id", order.id)
      .eq("user_id", user.id);

    if (updateError) {
      return NextResponse.json({ error: "Unable to link the Paystack reference to the order." }, { status: 500 });
    }

    return NextResponse.json(
      {
        status: "pending",
        authorizationUrl: paystackPayload.data.authorization_url,
        reference,
        order: { ...order, provider_reference: reference },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to initialize payment." },
      { status: 500 }
    );
  }
}
