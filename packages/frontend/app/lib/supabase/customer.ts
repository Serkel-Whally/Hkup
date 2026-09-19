import { createSupabaseServerClient } from "@/app/lib/supabase/server";

export async function getCurrentAuthUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user;
}

export async function getCurrentCustomerProfile() {
  const user = await getCurrentAuthUser();
  if (!user) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

export async function getActiveBundles() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("bundles")
    .select("id, network, size, validity, price, popular")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getCurrentCustomerWallet() {
  const user = await getCurrentAuthUser();
  if (!user) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getCurrentCustomerWalletLedger() {
  const user = await getCurrentAuthUser();
  if (!user) return [];

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("wallet_ledger")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getCurrentCustomerOrders() {
  const user = await getCurrentAuthUser();
  if (!user) return [];

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getCurrentCustomerOrderById(orderId: string) {
  const user = await getCurrentAuthUser();
  if (!user) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getCurrentCustomerOrderByReference(reference: string) {
  const user = await getCurrentAuthUser();
  if (!user || !reference) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("reference", reference)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createCustomerPurchase({
  bundleId,
  recipientPhone,
  paymentMethod,
  idempotencyKey,
}: {
  bundleId: string;
  recipientPhone: string;
  paymentMethod: string;
  idempotencyKey: string;
}) {
  const user = await getCurrentAuthUser();
  if (!user) throw new Error("Authentication required.");

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("purchase_bundle", {
    p_bundle_id: bundleId,
    p_recipient_phone: recipientPhone,
    p_payment_method: paymentMethod,
    p_idempotency_key: idempotencyKey,
  });

  if (error) throw error;
  return data;
}
