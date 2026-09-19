import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("bundles")
    .select("id, network, size, validity, price, popular")
    .eq("active", true)
    .order("popular", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bundles: data ?? [] }, { headers: { "Cache-Control": "no-store" } });
}
