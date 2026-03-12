import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_AMOUNTS = [100, 500, 1000, 3000];

// POST /api/diamond/topup/free — klaim diamond gratis (demo/hackathon)
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { amount } = await request.json();

    if (!ALLOWED_AMOUNTS.includes(amount)) {
      return NextResponse.json({ error: "Jumlah tidak valid" }, { status: 400 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("diamond_balance")
      .eq("id", user.id)
      .single();

    const newBalance = (profile?.diamond_balance ?? 0) + amount;

    await Promise.all([
      supabase.from("profiles").update({ diamond_balance: newBalance }).eq("id", user.id),
      supabase.from("diamond_transactions").insert({
        user_id: user.id,
        amount,
        type: "topup",
        description: `Klaim ${amount} diamond gratis`,
      }),
    ]);

    return NextResponse.json({ newBalance, amount });
  } catch (error) {
    console.error("Free topup error:", error);
    return NextResponse.json({ error: "Gagal klaim diamond" }, { status: 500 });
  }
}
