import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const GIFTS: Record<string, { cost: number; boost: number }> = {
  rose: { cost: 10, boost: 5 },
  chocolate: { cost: 25, boost: 15 },
  star: { cost: 50, boost: 20 },
  ring: { cost: 100, boost: 30 },
};

const LEVEL_ORDER = ["acquaintance", "friends", "crush", "dating", "committed"];
const LEVEL_THRESHOLD: Record<string, number> = {
  acquaintance: 25,
  friends: 50,
  crush: 75,
  dating: 100,
};

function getUpgradedLevel(progress: number, currentLevel: string): string {
  const threshold = LEVEL_THRESHOLD[currentLevel];
  if (threshold !== undefined && progress >= threshold) {
    const idx = LEVEL_ORDER.indexOf(currentLevel);
    if (idx < LEVEL_ORDER.length - 1) return LEVEL_ORDER[idx + 1];
  }
  return currentLevel;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { relationshipId, giftType } = await request.json();

    const gift = GIFTS[giftType];
    if (!gift) {
      return NextResponse.json({ error: "Gift tidak valid" }, { status: 400 });
    }

    // Get relationship and verify user is involved
    const { data: rel } = await supabase
      .from("relationships")
      .select("*, agent_a:agent_a_id(owner_id), agent_b:agent_b_id(owner_id)")
      .eq("id", relationshipId)
      .single();

    if (!rel) {
      return NextResponse.json({ error: "Relationship tidak ditemukan" }, { status: 404 });
    }

    const agentA = rel.agent_a as { owner_id: string };
    const agentB = rel.agent_b as { owner_id: string };
    const isInvolved = agentA.owner_id === user.id || agentB.owner_id === user.id;
    if (!isInvolved) {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
    }

    // Check diamond balance
    const { data: profile } = await supabase
      .from("profiles")
      .select("diamond_balance")
      .eq("id", user.id)
      .single();

    if (!profile || profile.diamond_balance < gift.cost) {
      return NextResponse.json({ error: "Diamond tidak cukup" }, { status: 400 });
    }

    // Calculate new progress and level
    const newProgress = Math.min(rel.progress + gift.boost, 100);
    const newLevel = getUpgradedLevel(newProgress, rel.level);
    const newBalance = profile.diamond_balance - gift.cost;

    // Execute all updates
    await Promise.all([
      // Deduct diamonds
      supabase
        .from("profiles")
        .update({ diamond_balance: newBalance })
        .eq("id", user.id),

      // Record transaction
      supabase.from("diamond_transactions").insert({
        user_id: user.id,
        amount: -gift.cost,
        type: "spend",
        description: `Kirim gift ${giftType} ke relationship`,
      }),

      // Insert gift record
      supabase.from("gifts").insert({
        relationship_id: relationshipId,
        sender_id: user.id,
        gift_type: giftType,
        diamond_cost: gift.cost,
        progress_boost: gift.boost,
      }),

      // Update relationship
      supabase
        .from("relationships")
        .update({ progress: newProgress, level: newLevel })
        .eq("id", relationshipId),
    ]);

    return NextResponse.json({ newProgress, newLevel, newBalance });
  } catch (error) {
    console.error("Gift error:", error);
    return NextResponse.json({ error: "Gagal kirim gift" }, { status: 500 });
  }
}
