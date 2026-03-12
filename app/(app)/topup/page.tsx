"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import AppHeader from "@/components/AppHeader";
import type { Profile } from "@/types/user";

const PACKAGES = [
  {
    key: "free100",
    diamonds: 100,
    emoji: "💎",
    label: "Starter Pack",
    desc: "Untuk mulai jalan-jalan",
    useMayar: false,
  },
  {
    key: "free500",
    diamonds: 500,
    emoji: "💎💎",
    label: "Lover Pack",
    desc: "Untuk kirim banyak gift",
    useMayar: false,
  },
  {
    key: "free1000",
    diamonds: 1000,
    emoji: "💎💎💎",
    label: "Romeo Pack",
    desc: "Untuk nikah & spawn",
    useMayar: false,
  },
  {
    key: "elite",
    diamonds: 3000,
    emoji: "👑",
    label: "Godlike Pack",
    desc: "Sultan mode on",
    useMayar: true,
  },
];

export default function TopupPage() {
  const [profile, setProfile] = useState<{ diamond_balance: number; username?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionKey, setActionKey] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { window.location.href = "/login"; return; }
      supabase.from("profiles").select("*").eq("id", user.id).single()
        .then(({ data }) => { setProfile(data); setLoading(false); });
    });
  }, []);

  async function handleFree(amount: number, key: string) {
    setActionKey(key); setError(""); setSuccess("");
    const res = await fetch("/api/diamond/topup/free", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Gagal klaim"); setActionKey(null); return; }
    setProfile((p) => p ? { ...p, diamond_balance: data.newBalance } : p);
    setSuccess(`+${amount} 💎 berhasil diklaim!`);
    setActionKey(null);
  }

  async function handleMayar(key: string) {
    setActionKey(key); setError(""); setSuccess("");
    const res = await fetch("/api/payment/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ packageKey: key }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Gagal membuat pembayaran"); setActionKey(null); return; }
    window.location.href = data.paymentLink;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-muted text-sm">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <AppHeader profile={profile} />

      <main className="section-inner py-12 max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl font-bold text-white mb-2">Top Up Diamond</h1>
          <p className="text-muted text-sm">Pilih paket Diamond favoritmu</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2">
            <span className="text-yellow-400 font-semibold">💎 {profile?.diamond_balance?.toLocaleString() ?? 0}</span>
            <span className="text-yellow-400/60 text-xs">Diamond saat ini</span>
          </div>
        </div>

        {error && (
          <div className="bg-crimson/10 border border-crimson/30 rounded-lg px-4 py-3 mb-4 text-sm text-crimson-bright text-center">{error}</div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3 mb-4 text-sm text-green-400 text-center font-semibold">{success}</div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-8">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.key}
              className={`relative bg-dark-card rounded-xl p-5 border transition-all ${
                pkg.useMayar
                  ? "border-yellow-500/40 shadow-lg shadow-yellow-500/5"
                  : "border-crimson/20 hover:border-crimson/40"
              }`}
            >
              {pkg.useMayar && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-600 to-yellow-400 text-black text-xs font-bold px-3 py-0.5 rounded-full whitespace-nowrap">
                  👑 PREMIUM
                </div>
              )}

              <div className="text-3xl mb-2">{pkg.emoji}</div>
              <div className="text-white font-bold text-base mb-0.5">{pkg.label}</div>
              <div className="text-yellow-400 font-semibold text-sm mb-1">
                💎 {pkg.diamonds.toLocaleString()} Diamond
              </div>
              <div className="text-muted text-xs mb-3">{pkg.desc}</div>

              {pkg.useMayar ? (
                <>
                  <div className="text-white font-bold text-xl mb-1">Rp 200.000</div>
                  {/* Mayar badge */}
                  <div className="flex items-center gap-1.5 mb-4">
                    <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                    </div>
                    <span className="text-xs text-blue-400">Powered by Mayar.id</span>
                  </div>
                  <button
                    onClick={() => handleMayar(pkg.key)}
                    disabled={actionKey !== null}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-yellow-600 to-yellow-400 hover:from-yellow-500 hover:to-yellow-300 text-black transition-all disabled:opacity-50"
                  >
                    {actionKey === pkg.key ? "Membuka Mayar..." : "Bayar via Mayar"}
                  </button>
                </>
              ) : (
                <>
                  <div className="text-green-400 font-bold text-xl mb-4">GRATIS</div>
                  <button
                    onClick={() => handleFree(pkg.diamonds, pkg.key)}
                    disabled={actionKey !== null}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold bg-crimson/20 hover:bg-crimson/30 text-white border border-crimson/30 transition-all disabled:opacity-50"
                  >
                    {actionKey === pkg.key ? "Mengklaim..." : "Klaim Sekarang"}
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="bg-dark-card border border-crimson/10 rounded-xl p-5">
          <h3 className="text-white font-semibold text-sm mb-3">Cara Bayar Godlike Pack</h3>
          <ol className="space-y-2 text-sm text-muted list-decimal list-inside">
            <li>Klik <strong className="text-white">Bayar via Mayar</strong></li>
            <li>Kamu diarahkan ke halaman checkout Mayar.id</li>
            <li>Pilih metode bayar — QRIS, transfer bank, atau e-wallet</li>
            <li>Diamond otomatis masuk setelah pembayaran dikonfirmasi</li>
          </ol>
          <div className="mt-4 pt-4 border-t border-crimson/10 flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400">M</div>
            <span className="text-xs text-muted">Pembayaran diproses aman oleh <span className="text-white font-medium">Mayar.id</span></span>
          </div>
        </div>
      </main>
    </div>
  );
}
