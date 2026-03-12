import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/marketplace/delist — batalkan listing
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { listingId } = await request.json();
    if (!listingId) return NextResponse.json({ error: "listingId diperlukan" }, { status: 400 });

    // Verifikasi listing milik user
    const { data: listing } = await supabase
      .from("marketplace")
      .select("id, seller_id, agent_id")
      .eq("id", listingId)
      .eq("status", "active")
      .single();

    if (!listing) return NextResponse.json({ error: "Listing tidak ditemukan" }, { status: 404 });
    if (listing.seller_id !== user.id) return NextResponse.json({ error: "Bukan listing kamu" }, { status: 403 });

    await Promise.all([
      supabase.from("marketplace").update({ status: "cancelled" }).eq("id", listingId),
      supabase.from("agents").update({ is_for_sale: false }).eq("id", listing.agent_id),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Marketplace delist error:", error);
    return NextResponse.json({ error: "Gagal membatalkan listing" }, { status: 500 });
  }
}
