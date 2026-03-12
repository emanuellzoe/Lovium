"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import AppHeader from "@/components/AppHeader";
import type { Profile } from "@/types/user";
import type { Agent } from "@/types/agent";

interface ListingAgent extends Agent {
  owner: { id: string; username: string };
}

interface Listing {
  id: string;
  agent_id: string;
  seller_id: string;
  price_diamond: number;
  status: string;
  created_at: string;
  agent: ListingAgent;
  seller: { id: string; username: string };
}

const RARITY_STYLE: Record<string, string> = {
  legendary: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  epic: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  rare: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  common: "bg-white/5 text-gray-400 border border-white/10",
};

export default function MarketplacePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [myAgents, setMyAgents] = useState<Agent[]>([]);
  const [tab, setTab] = useState<"browse" | "sell" | "my">("browse");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Sell modal state
  const [sellAgent, setSellAgent] = useState<Agent | null>(null);
  const [sellPrice, setSellPrice] = useState("");

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }
    setUserId(user.id);

    const [profileRes, listingsRes, agentsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      fetch("/api/marketplace").then((r) => r.json()),
      supabase.from("agents").select("*").eq("owner_id", user.id).eq("is_for_sale", false).order("created_at", { ascending: false }),
    ]);

    setProfile(profileRes.data);
    setListings(listingsRes.listings ?? []);
    setMyAgents(agentsRes.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleBuy(listingId: string, price: number) {
    if (!confirm(`Beli agent ini seharga ${price} 💎?`)) return;
    setActionLoading(listingId);
    setError(""); setSuccess("");
    const res = await fetch("/api/marketplace/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setActionLoading(null); return; }
    setSuccess("Agent berhasil dibeli!");
    setProfile((p) => p ? { ...p, diamond_balance: data.newBalance } : p);
    await load();
    setActionLoading(null);
  }

  async function handleDelist(listingId: string) {
    if (!confirm("Batalkan listing ini?")) return;
    setActionLoading(listingId);
    setError(""); setSuccess("");
    const res = await fetch("/api/marketplace/delist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setActionLoading(null); return; }
    setSuccess("Listing berhasil dibatalkan.");
    await load();
    setActionLoading(null);
  }

  async function handleSell() {
    if (!sellAgent || !sellPrice) return;
    const price = parseInt(sellPrice);
    if (isNaN(price) || price < 1) { setError("Harga tidak valid"); return; }
    setActionLoading("sell");
    setError(""); setSuccess("");
    const res = await fetch("/api/marketplace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId: sellAgent.id, priceDiamond: price }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setActionLoading(null); return; }
    setSuccess(`${sellAgent.name} berhasil didaftarkan di marketplace!`);
    setSellAgent(null); setSellPrice("");
    await load();
    setActionLoading(null);
  }

  const myListings = listings.filter((l) => l.seller_id === userId);
  const otherListings = listings.filter((l) => l.seller_id !== userId);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-muted text-sm">Memuat marketplace...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <AppHeader profile={profile} />

      <main className="section-inner py-10 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-white mb-1">Marketplace</h1>
            <p className="text-muted text-sm">Beli & jual agent AI dengan Diamond</p>
          </div>
          <a href="/topup" className="text-xs bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-3 py-1.5 rounded-lg hover:bg-yellow-500/20 transition-colors no-underline">
            💎 Top Up
          </a>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { key: "browse", label: `Semua (${otherListings.length})` },
            { key: "sell", label: "Jual Agentku" },
            { key: "my", label: `Listingku (${myListings.length})` },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                tab === t.key
                  ? "bg-crimson/10 border border-crimson text-white"
                  : "bg-dark-card border border-crimson/10 text-muted hover:border-crimson/30"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Alert */}
        {error && (
          <div className="bg-crimson/10 border border-crimson/30 rounded-lg px-4 py-3 mb-6 text-sm text-crimson-bright">{error}</div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3 mb-6 text-sm text-green-400">{success}</div>
        )}

        {/* Tab: Browse */}
        {tab === "browse" && (
          <>
            {otherListings.length === 0 ? (
              <div className="text-center py-20 text-muted text-sm">Belum ada listing aktif dari pengguna lain.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherListings.map((listing) => (
                  <AgentCard
                    key={listing.id}
                    listing={listing}
                    isMine={false}
                    loading={actionLoading === listing.id}
                    onBuy={() => handleBuy(listing.id, listing.price_diamond)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Tab: Sell */}
        {tab === "sell" && (
          <>
            {myAgents.length === 0 ? (
              <div className="text-center py-20 text-muted text-sm">
                Tidak ada agent yang bisa dijual.{" "}
                <a href="/create-agent" className="text-crimson-bright hover:underline no-underline">Buat agent baru?</a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myAgents.map((agent) => (
                  <div key={agent.id} className="bg-dark-card border border-crimson/20 rounded-xl p-5">
                    <AgentInfo agent={agent} />
                    {sellAgent?.id === agent.id ? (
                      <div className="mt-4 space-y-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="Harga dalam Diamond"
                          value={sellPrice}
                          onChange={(e) => setSellPrice(e.target.value)}
                          className="w-full bg-dark border border-crimson/20 rounded-lg px-3 py-2 text-white text-sm focus:border-crimson/50 focus:outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleSell}
                            disabled={actionLoading === "sell"}
                            className="flex-1 py-2 rounded-lg bg-crimson/20 hover:bg-crimson/30 text-white text-xs font-medium border border-crimson/30 transition-colors disabled:opacity-50"
                          >
                            {actionLoading === "sell" ? "Mendaftar..." : "Konfirmasi Jual"}
                          </button>
                          <button
                            onClick={() => { setSellAgent(null); setSellPrice(""); }}
                            className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted text-xs border border-white/10 transition-colors"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setSellAgent(agent); setSellPrice(""); setError(""); }}
                        className="mt-4 w-full py-2 rounded-lg bg-dark border border-crimson/20 hover:border-crimson/40 text-crimson-bright text-xs font-medium transition-colors"
                      >
                        Jual Agent Ini
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Tab: My Listings */}
        {tab === "my" && (
          <>
            {myListings.length === 0 ? (
              <div className="text-center py-20 text-muted text-sm">Kamu belum punya listing aktif.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myListings.map((listing) => (
                  <AgentCard
                    key={listing.id}
                    listing={listing}
                    isMine={true}
                    loading={actionLoading === listing.id}
                    onDelist={() => handleDelist(listing.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function AgentInfo({ agent }: { agent: Agent }) {
  return (
    <>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-crimson/30 to-crimson-deep/30 flex items-center justify-center text-2xl">
          {agent.avatar_emoji}
        </div>
        <div>
          <h3 className="text-white font-semibold">{agent.name}</h3>
          <span className="text-xs text-muted">Gen {agent.generation}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {(agent.traits as string[]).slice(0, 3).map((trait) => (
          <span key={trait} className="text-xs px-2 py-0.5 rounded-full bg-crimson/10 text-crimson-bright border border-crimson/20">
            {trait}
          </span>
        ))}
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full ${RARITY_STYLE[agent.rarity] ?? RARITY_STYLE.common}`}>
        {agent.rarity}
      </span>
    </>
  );
}

function AgentCard({
  listing,
  isMine,
  loading,
  onBuy,
  onDelist,
}: {
  listing: Listing;
  isMine: boolean;
  loading: boolean;
  onBuy?: () => void;
  onDelist?: () => void;
}) {
  return (
    <div className="bg-dark-card border border-crimson/20 rounded-xl p-5">
      <AgentInfo agent={listing.agent} />
      <div className="mt-3 pt-3 border-t border-crimson/10 flex items-center justify-between">
        <div>
          <div className="text-gold font-semibold text-sm">💎 {listing.price_diamond.toLocaleString()}</div>
          <div className="text-xs text-muted mt-0.5">@{listing.seller.username}</div>
        </div>
        {isMine ? (
          <button
            onClick={onDelist}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted border border-white/10 transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "Batalkan"}
          </button>
        ) : (
          <button
            onClick={onBuy}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-lg bg-crimson/20 hover:bg-crimson/30 text-white border border-crimson/30 transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "Beli"}
          </button>
        )}
      </div>
    </div>
  );
}
