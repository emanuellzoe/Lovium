"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Agent } from "@/types/agent";

interface RelationshipWithAgents {
  id: string;
  agent_a_id: string;
  agent_b_id: string;
  level: string;
  progress: number;
  status: string;
  agent_a: Agent;
  agent_b: Agent;
}

interface Props {
  relationships: RelationshipWithAgents[];
  initialBalance: number;
}

const GIFTS = [
  { type: "rose", emoji: "🌹", name: "Mawar", cost: 10, boost: 5 },
  { type: "chocolate", emoji: "🍫", name: "Cokelat", cost: 25, boost: 15 },
  { type: "star", emoji: "⭐", name: "Bintang", cost: 50, boost: 20 },
  { type: "ring", emoji: "💍", name: "Cincin", cost: 100, boost: 30 },
];

const LEVEL_LABELS: Record<string, string> = {
  acquaintance: "Kenalan",
  friends: "Teman",
  crush: "Naksir",
  dating: "Pacaran",
  committed: "Serius",
};

const LEVEL_COLORS: Record<string, string> = {
  acquaintance: "text-muted",
  friends: "text-blue-400",
  crush: "text-pink-400",
  dating: "text-crimson-bright",
  committed: "text-gold",
};

const LEVEL_NEXT_AT: Record<string, number> = {
  acquaintance: 25,
  friends: 50,
  crush: 75,
  dating: 100,
};

export default function RelationshipsUI({ relationships, initialBalance }: Props) {
  const [balance, setBalance] = useState(initialBalance);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [rels, setRels] = useState(relationships);
  const [loading, setLoading] = useState<string | null>(null);
  const [topping, setTopping] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const router = useRouter();

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleTopup = async () => {
    setTopping(true);
    try {
      const res = await fetch("/api/diamond/topup", { method: "POST" });
      const data = await res.json();
      if (data.newBalance !== undefined) {
        setBalance(data.newBalance);
        showToast(`+${data.amount} 💎 Diamond diterima!`);
        router.refresh();
      }
    } finally {
      setTopping(false);
    }
  };

  const handleGift = async (relationshipId: string, giftType: string) => {
    setLoading(giftType + relationshipId);
    try {
      const res = await fetch("/api/gift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ relationshipId, giftType }),
      });
      const data = await res.json();

      if (data.error) {
        showToast(data.error === "Diamond tidak cukup" ? "💎 Diamond tidak cukup!" : data.error);
        return;
      }

      setBalance(data.newBalance);
      setRels((prev) =>
        prev.map((r) =>
          r.id === relationshipId
            ? { ...r, progress: data.newProgress, level: data.newLevel }
            : r,
        ),
      );

      const gift = GIFTS.find((g) => g.type === giftType);
      const levelUp = data.newLevel !== rels.find((r) => r.id === relationshipId)?.level;
      if (levelUp) {
        showToast(`✨ Level naik! ${LEVEL_LABELS[data.newLevel]}`);
      } else {
        showToast(`${gift?.emoji} Gift terkirim! +${gift?.boost} progress`);
      }
      setExpanded(null);
      router.refresh();
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="section-inner py-10">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-dark-card border border-crimson/30 text-white text-sm px-4 py-2 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white mb-1">Hubungan</h1>
          <p className="text-muted text-sm">Kelola hubungan agent dan kirim hadiah</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-dark-card border border-gold/20 rounded-xl px-4 py-2 flex items-center gap-2">
            <span className="text-gold text-lg">💎</span>
            <span className="text-gold font-semibold">{balance}</span>
          </div>
          <button
            onClick={handleTopup}
            disabled={topping}
            className="bg-gold/10 hover:bg-gold/20 border border-gold/30 text-gold text-sm px-4 py-2 rounded-xl transition-colors disabled:opacity-40"
          >
            {topping ? "..." : "+ Gratis 100"}
          </button>
        </div>
      </div>

      {/* No relationships */}
      {rels.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">💔</div>
          <p className="text-white font-semibold mb-2">Belum ada hubungan</p>
          <p className="text-muted text-sm mb-6">
            Pergi ke Discover dan like agent orang lain untuk memulai
          </p>
          <a
            href="/discover"
            className="inline-block bg-crimson hover:bg-crimson-bright text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors no-underline"
          >
            Discover Agent
          </a>
        </div>
      )}

      {/* Relationship Cards */}
      <div className="space-y-4">
        {rels.map((rel) => {
          const nextAt = LEVEL_NEXT_AT[rel.level];
          const isMax = rel.level === "committed";
          const isOpen = expanded === rel.id;

          return (
            <div
              key={rel.id}
              className="bg-dark-card border border-crimson/20 rounded-xl overflow-hidden"
            >
              <div className="p-5">
                {/* Agents Row */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-crimson/30 to-crimson-deep/30 flex items-center justify-center text-xl">
                      {rel.agent_a.avatar_emoji}
                    </div>
                    <span className="text-white text-sm font-medium">{rel.agent_a.name}</span>
                  </div>

                  <div className="flex-1 text-center text-crimson-glow text-lg">❤️</div>

                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium">{rel.agent_b.name}</span>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-crimson/30 to-crimson-deep/30 flex items-center justify-center text-xl">
                      {rel.agent_b.avatar_emoji}
                    </div>
                  </div>
                </div>

                {/* Level + Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs font-medium ${LEVEL_COLORS[rel.level]}`}>
                      {LEVEL_LABELS[rel.level] ?? rel.level}
                    </span>
                    <span className="text-xs text-muted">
                      {isMax ? "MAX" : `${rel.progress}/${nextAt}`}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-crimson to-crimson-glow rounded-full transition-all duration-500"
                      style={{
                        width: isMax ? "100%" : `${(rel.progress / (nextAt ?? 100)) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  <a
                    href={`/date/${rel.id}`}
                    className="flex-1 text-center text-xs py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/20 hover:border-pink-500/40 transition-colors no-underline"
                  >
                    🎭 Kencan
                  </a>
                  <a
                    href={`/chat/${rel.agent_a_id}`}
                    className="flex-1 text-center text-xs py-1.5 rounded-lg bg-crimson/10 hover:bg-crimson/20 text-crimson-bright border border-crimson/20 hover:border-crimson/40 transition-colors no-underline"
                  >
                    💬 Chat
                  </a>
                  {!isMax && (
                    <button
                      onClick={() => setExpanded(isOpen ? null : rel.id)}
                      className="flex-1 text-xs py-1.5 rounded-lg bg-gold/10 hover:bg-gold/20 text-gold border border-gold/20 hover:border-gold/40 transition-colors"
                    >
                      🎁 Gift
                    </button>
                  )}
                  {isMax && (
                    <a
                      href="/couple"
                      className="flex-1 text-center text-xs py-1.5 rounded-lg bg-gold/20 hover:bg-gold/30 text-gold border border-gold/40 transition-colors no-underline"
                    >
                      💍 Lamar
                    </a>
                  )}
                </div>
              </div>

              {/* Gift Picker */}
              {isOpen && (
                <div className="border-t border-crimson/20 p-4 bg-dark/40">
                  <p className="text-xs text-muted mb-3">Pilih hadiah · Saldo: {balance} 💎</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {GIFTS.map((g) => {
                      const canAfford = balance >= g.cost;
                      const isLoading = loading === g.type + rel.id;
                      return (
                        <button
                          key={g.type}
                          onClick={() => handleGift(rel.id, g.type)}
                          disabled={!canAfford || !!loading}
                          className={`p-3 rounded-xl border text-center transition-colors ${
                            canAfford
                              ? "bg-dark-card border-crimson/20 hover:border-crimson/50 hover:bg-crimson/10"
                              : "bg-white/5 border-white/10 opacity-40 cursor-not-allowed"
                          }`}
                        >
                          <div className="text-2xl mb-1">{isLoading ? "⏳" : g.emoji}</div>
                          <div className="text-white text-xs font-medium">{g.name}</div>
                          <div className="text-gold text-xs">{g.cost} 💎</div>
                          <div className="text-crimson-bright text-xs">+{g.boost} prog</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
