import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/app/lib/supabase/admin";
import { createSupabaseServerClient } from "@/app/lib/supabase/server";
import { EXPECTED_CURRENCY, PAYSTACK_BASE_URL, getPaystackSecret } from "@/app/lib/paystack";

async function verifyPaystackReference(reference: string, userId: string) {
  const admin = createSupabaseAdminClient();
  const { data: order, error } = await admin
    .from("orders")
    .select("*")
    .eq("provider_reference", reference)
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !order) {
    return { order: null, error: "Order not found for this reference." } as const;
  }

  const paystackSecret = getPaystackSecret();
  if (!paystackSecret) {
    return { order, error: "Paystack secret is not configured." } as const;
  }

  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${paystackSecret}`,
      "Content-Type": "application/json",
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload?.data?.status !== "success") {
    return { order, error: payload?.message || "Payment verification failed." } as const;
  }

  const providerAmount = Number(payload?.data?.amount ?? 0) / 100;
  const providerCurrency = String(payload?.data?.currency ?? "").toUpperCase();
  const expectedAmount = Number(order.amount ?? 0);

  if (providerCurrency !== EXPECTED_CURRENCY || providerAmount !== expectedAmount) {
    return { order, error: "Payment amount or currency does not match the authorized order." } as const;
  }

  if (order.payment_status === "paid") {
    return { order: { ...order, payment_status: "paid" }, error: null } as const;
  }

  const { error: updateError } = await admin
    .from("orders")
    .update({ payment_status: "paid", updated_at: new Date().toISOString() })
    .eq("id", order.id)
    .eq("user_id", userId);

  if (updateError) {
    return { order, error: "Unable to update the verified payment state." } as const;
  }

  return {
    order: { ...order, payment_status: "paid" },
    error: null,
  } as const;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const reference = url.searchParams.get("reference") || url.searchParams.get("trxref");

    if (!reference) {
      return NextResponse.json({ error: "A Paystack reference is required." }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const result = await verifyPaystackReference(reference, user.id);
    if (result.error) {
      return NextResponse.json({ verified: false, error: result.error, order: result.order }, { status: 400 });
    }

    return NextResponse.json({ verified: true, order: result.order }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to verify payment." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const reference = String(body?.reference ?? "").trim();

    if (!reference) {
      return NextResponse.json({ error: "A Paystack reference is required." }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const result = await verifyPaystackReference(reference, user.id);
    if (result.error) {
      return NextResponse.json({ verified: false, error: result.error, order: result.order }, { status: 400 });
    }

    return NextResponse.json({ verified: true, order: result.order }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to verify payment." },
      { status: 500 }
    );
  }
}
