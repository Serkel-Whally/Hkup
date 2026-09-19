import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const bundleId = String(body?.bundleId || "").trim();
    const recipientPhone = String(body?.recipientPhone || "").trim();
    const paymentMethod = String(body?.paymentMethod || "").trim();
    const idempotencyKey = String(body?.idempotencyKey || "").trim();

    if (!bundleId || !recipientPhone || !paymentMethod || !idempotencyKey) {
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

    const { data: bundle, error: bundleError } = await supabase
      .from("bundles")
      .select("id, network, size, validity, price, active")
      .eq("id", bundleId)
      .maybeSingle();

    if (bundleError || !bundle) {
      return NextResponse.json({ error: "Bundle not found." }, { status: 404 });
    }

    if (!bundle.active) {
      return NextResponse.json({ error: "Bundle is not available." }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("purchase_bundle", {
      p_bundle_id: bundle.id,
      p_recipient_phone: recipientPhone,
      p_payment_method: paymentMethod,
      p_idempotency_key: idempotencyKey,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ order: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create order." },
      { status: 500 }
    );
  }
}
