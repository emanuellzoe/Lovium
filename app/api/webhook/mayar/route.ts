import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// POST /api/webhook/mayar — terima notifikasi pembayaran dari Mayar
export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const event = payload["event.received"] as string;
    const invoiceId = payload?.data?.id as string;

    // Hanya proses event payment.received
    if (event !== "payment.received") {
      return NextResponse.json({ received: true });
    }

    if (!invoiceId) {
      return NextResponse.json({ error: "Invoice ID tidak ditemukan" }, { status: 400 });
    }

    const admin = createAdminClient();

    // Cari pending payment berdasarkan invoice ID
    const { data: payment } = await admin
      .from("mayar_payments")
      .select("*")
      .eq("mayar_invoice_id", invoiceId)
      .eq("status", "pending")
      .single();

    if (!payment) {
      // Sudah diproses atau tidak ditemukan
      return NextResponse.json({ received: true });
    }

    // Ambil saldo user saat ini
    const { data: profile } = await admin
      .from("profiles")
      .select("diamond_balance")
      .eq("id", payment.user_id)
      .single();

    const currentBalance = profile?.diamond_balance ?? 0;
    const newBalance = currentBalance + payment.diamonds;

    // Kredit diamond + update status pembayaran secara paralel
    await Promise.all([
      admin.from("profiles").update({ diamond_balance: newBalance }).eq("id", payment.user_id),

      admin.from("diamond_transactions").insert({
        user_id: payment.user_id,
        amount: payment.diamonds,
        type: "topup",
        description: `Top up via Mayar — ${payment.diamonds} diamond`,
      }),

      admin.from("mayar_payments").update({
        status: "paid",
        paid_at: new Date().toISOString(),
      }).eq("id", payment.id),
    ]);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook Mayar error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
