import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// POST /api/marketplace/buy — beli agent dari marketplace
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { listingId } = await request.json();
    if (!listingId) return NextResponse.json({ error: "listingId diperlukan" }, { status: 400 });

    const admin = createAdminClient();

    // Ambil detail listing
    const { data: listing } = await supabase
      .from("marketplace")
      .select("*, agent:agent_id(id, name)")
      .eq("id", listingId)
      .eq("status", "active")
      .single();

    if (!listing) return NextResponse.json({ error: "Listing tidak ditemukan atau sudah terjual" }, { status: 404 });
    if (listing.seller_id === user.id) return NextResponse.json({ error: "Tidak bisa membeli agent sendiri" }, { status: 400 });

    const price = listing.price_diamond as number;
    const agentId = (listing.agent as { id: string }).id;
    const sellerId = listing.seller_id as string;

    // Cek saldo buyer + seller secara paralel
    const [buyerRes, sellerRes] = await Promise.all([
      supabase.from("profiles").select("diamond_balance").eq("id", user.id).single(),
      admin.from("profiles").select("diamond_balance").eq("id", sellerId).single(),
    ]);

    if (!buyerRes.data || buyerRes.data.diamond_balance < price) {
      return NextResponse.json({ error: "Diamond tidak cukup" }, { status: 400 });
    }

    const newBuyerBalance = buyerRes.data.diamond_balance - price;
    const newSellerBalance = (sellerRes.data?.diamond_balance ?? 0) + price;

    // Eksekusi semua update secara paralel
    await Promise.all([
      // Transfer kepemilikan agent ke buyer (perlu admin untuk bypass RLS)
      admin.from("agents").update({ owner_id: user.id, is_for_sale: false }).eq("id", agentId),

      // Update listing → sold
      admin.from("marketplace").update({
        status: "sold",
        buyer_id: user.id,
        sold_at: new Date().toISOString(),
      }).eq("id", listingId),

      // Kurangi diamond buyer
      admin.from("profiles").update({ diamond_balance: newBuyerBalance }).eq("id", user.id),

      // Tambah diamond seller
      admin.from("profiles").update({ diamond_balance: newSellerBalance }).eq("id", sellerId),

      // Catat transaksi buyer
      admin.from("diamond_transactions").insert({
        user_id: user.id,
        amount: -price,
        type: "spend",
        description: `Beli agent dari marketplace`,
      }),

      // Catat transaksi seller
      admin.from("diamond_transactions").insert({
        user_id: sellerId,
        amount: price,
        type: "earn",
        description: `Agent terjual di marketplace`,
      }),
    ]);

    return NextResponse.json({ success: true, newBalance: newBuyerBalance });
  } catch (error) {
    console.error("Marketplace buy error:", error);
    return NextResponse.json({ error: "Gagal membeli agent" }, { status: 500 });
  }
}
