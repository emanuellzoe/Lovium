import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const DIAMOND_PACKAGES: Record<string, { diamonds: number; amountIdr: number; label: string }> = {
  starter: { diamonds: 100, amountIdr: 10000, label: "100 Diamond" },
  popular: { diamonds: 500, amountIdr: 45000, label: "500 Diamond" },
  pro: { diamonds: 1000, amountIdr: 80000, label: "1000 Diamond" },
  elite: { diamonds: 3000, amountIdr: 200000, label: "3000 Diamond" },
};

// POST /api/payment/create — buat invoice Mayar untuk top up diamond
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { packageKey } = await request.json();
    const pkg = DIAMOND_PACKAGES[packageKey];
    if (!pkg) return NextResponse.json({ error: "Paket tidak valid" }, { status: 400 });

    // Ambil profil user (username + email)
    const [profileRes] = await Promise.all([
      supabase.from("profiles").select("username").eq("id", user.id).single(),
    ]);

    const username = profileRes.data?.username ?? "Lovium User";
    const email = user.email ?? "";

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://lovium.vercel.app";

    // Buat invoice Mayar
    const mayarRes = await fetch("https://api.mayar.id/hl/v1/invoice/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MAYAR_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: username,
        email,
        mobile: "08000000000",
        description: `Top up ${pkg.label} - Lovium`,
        redirectUrl: `${baseUrl}/topup/success`,
        expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        items: [
          {
            quantity: 1,
            rate: pkg.amountIdr,
            description: `${pkg.label} Lovium Diamond`,
          },
        ],
      }),
    });

    if (!mayarRes.ok) {
      const err = await mayarRes.text();
      console.error("Mayar API error:", err);
      return NextResponse.json({ error: `Gagal membuat invoice: ${err}` }, { status: 500 });
    }

    const mayarData = await mayarRes.json();
    console.log("Mayar response:", JSON.stringify(mayarData));

    const invoiceId: string = mayarData?.data?.id;
    const paymentLink: string = mayarData?.data?.link;

    if (!invoiceId || !paymentLink) {
      return NextResponse.json(
        { error: `Response Mayar tidak valid: ${JSON.stringify(mayarData)}` },
        { status: 500 },
      );
    }

    // Simpan pending payment (non-blocking — skip jika tabel belum ada)
    try {
      const admin = createAdminClient();
      await admin.from("mayar_payments").insert({
        mayar_invoice_id: invoiceId,
        user_id: user.id,
        diamonds: pkg.diamonds,
        amount_idr: pkg.amountIdr,
        status: "pending",
      });
    } catch (dbErr) {
      console.error("mayar_payments insert error (non-fatal):", dbErr);
    }

    return NextResponse.json({ paymentLink, invoiceId });
  } catch (error) {
    console.error("Payment create error:", error);
    return NextResponse.json({ error: `Gagal membuat pembayaran: ${String(error)}` }, { status: 500 });
  }
}
