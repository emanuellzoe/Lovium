import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Give free diamonds for testing / daily bonus
export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("diamond_balance")
      .eq("id", user.id)
      .single();

    const currentBalance = profile?.diamond_balance ?? 0;
    const topupAmount = 100;
    const newBalance = currentBalance + topupAmount;

    await Promise.all([
      supabase
        .from("profiles")
        .update({ diamond_balance: newBalance })
        .eq("id", user.id),

      supabase.from("diamond_transactions").insert({
        user_id: user.id,
        amount: topupAmount,
        type: "topup",
        description: "Top up diamond gratis",
      }),
    ]);

    return NextResponse.json({ newBalance, amount: topupAmount });
  } catch (error) {
    console.error("Topup error:", error);
    return NextResponse.json({ error: "Gagal top up" }, { status: 500 });
  }
}
