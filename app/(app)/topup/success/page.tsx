import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// Halaman redirect setelah bayar berhasil di Mayar
export default async function TopupSuccessPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("diamond_balance, username")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="bg-dark-card border border-green-500/30 rounded-2xl p-10 max-w-md w-full text-center shadow-xl">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="font-serif text-2xl font-bold text-white mb-2">Pembayaran Berhasil!</h1>
        <p className="text-muted text-sm mb-6">
          Diamond kamu sedang diproses. Akan masuk dalam beberapa detik jika belum terlihat.
        </p>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-6 py-4 mb-6">
          <div className="text-yellow-400 font-bold text-2xl">💎 {profile?.diamond_balance?.toLocaleString() ?? 0}</div>
          <div className="text-yellow-400/60 text-xs mt-1">Saldo Diamond kamu</div>
        </div>
        <div className="flex gap-3">
          <a
            href="/dashboard"
            className="flex-1 py-2.5 rounded-xl bg-dark border border-crimson/20 hover:border-crimson/40 text-white text-sm text-center no-underline transition-colors"
          >
            Dashboard
          </a>
          <a
            href="/marketplace"
            className="flex-1 py-2.5 rounded-xl bg-crimson hover:bg-crimson-bright text-white text-sm text-center no-underline transition-colors"
          >
            Marketplace
          </a>
        </div>
      </div>
    </div>
  );
}
