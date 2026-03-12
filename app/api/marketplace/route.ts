import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/marketplace — daftar semua listing aktif
export async function GET() {
  try {
    const supabase = await createClient();

    const { data: listings, error } = await supabase
      .from("marketplace")
      .select(
        `
        *,
        agent:agent_id (
          id, name, traits, avatar_emoji, rarity, generation, status,
          owner:owner_id ( id, username )
        ),
        seller:seller_id ( id, username )
      `,
      )
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ listings });
  } catch (error) {
    console.error("Marketplace GET error:", error);
    return NextResponse.json({ error: "Gagal memuat marketplace" }, { status: 500 });
  }
}

// POST /api/marketplace — jual agent
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { agentId, priceDiamond } = await request.json();

    if (!agentId || !priceDiamond || priceDiamond < 1) {
      return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
    }

    // Verifikasi agent milik user dan belum dijual
    const { data: agent } = await supabase
      .from("agents")
      .select("id, owner_id, is_for_sale, name")
      .eq("id", agentId)
      .single();

    if (!agent) return NextResponse.json({ error: "Agent tidak ditemukan" }, { status: 404 });
    if (agent.owner_id !== user.id) return NextResponse.json({ error: "Bukan agent kamu" }, { status: 403 });
    if (agent.is_for_sale) return NextResponse.json({ error: "Agent sudah terdaftar di marketplace" }, { status: 400 });

    // Cek tidak ada listing aktif yang sama
    const { data: existing } = await supabase
      .from("marketplace")
      .select("id")
      .eq("agent_id", agentId)
      .eq("status", "active")
      .single();

    if (existing) return NextResponse.json({ error: "Agent sudah ada di marketplace" }, { status: 400 });

    // Buat listing + tandai agent is_for_sale
    const [listingResult] = await Promise.all([
      supabase.from("marketplace").insert({
        agent_id: agentId,
        seller_id: user.id,
        price_diamond: priceDiamond,
        status: "active",
      }).select().single(),
      supabase.from("agents").update({ is_for_sale: true }).eq("id", agentId),
    ]);

    if (listingResult.error) throw listingResult.error;

    return NextResponse.json({ listing: listingResult.data });
  } catch (error) {
    console.error("Marketplace POST error:", error);
    return NextResponse.json({ error: "Gagal mendaftarkan agent" }, { status: 500 });
  }
}
