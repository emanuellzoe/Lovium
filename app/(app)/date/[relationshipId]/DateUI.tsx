"use client";

import { useState } from "react";
import type { Agent } from "@/types/agent";

interface Relationship {
  id: string;
  level: string;
  progress: number;
  status: string;
  agent_a: Agent;
  agent_b: Agent;
  agent_a_id: string;
  agent_b_id: string;
}

interface Props {
  relationship: Relationship;
  userId: string;
  initialDiamonds: number;
}

interface Scene {
  speakerEmoji: string;
  speakerName: string;
  listenerEmoji: string;
  listenerName: string;
  dialogA: string;
  dialogB: string;
  emotion: string;
  affinityDelta: number;
  hint: string;
}

const CHOICES = [
  { key: "joke",       emoji: "😄", label: "Buat Lelucon",       risk: "sedang" },
  { key: "feelings",   emoji: "💝", label: "Ungkapkan Perasaan", risk: "tinggi" },
  { key: "story",      emoji: "✨", label: "Cerita Seru",         risk: "rendah" },
  { key: "question",   emoji: "❓", label: "Tanya Personal",      risk: "rendah" },
  { key: "compliment", emoji: "🌹", label: "Puji",                risk: "sedang" },
  { key: "tease",      emoji: "😏", label: "Goda Sedikit",        risk: "tinggi" },
];

const GIFTS = [
  { type: "rose",      emoji: "🌹", name: "Mawar",   cost: 10,  boost: 5  },
  { type: "chocolate", emoji: "🍫", name: "Cokelat", cost: 25,  boost: 15 },
  { type: "star",      emoji: "⭐", name: "Bintang", cost: 50,  boost: 20 },
  { type: "ring",      emoji: "💍", name: "Cincin",  cost: 100, boost: 30 },
];

const EMOTION_CONFIG: Record<string, { emoji: string; color: string; label: string }> = {
  delighted: { emoji: "🥰", color: "text-pink-400",   label: "Sangat suka!" },
  happy:     { emoji: "😊", color: "text-green-400",  label: "Senang!"      },
  neutral:   { emoji: "😐", color: "text-muted",      label: "Biasa aja"    },
  annoyed:   { emoji: "😒", color: "text-yellow-400", label: "Kurang suka..." },
  upset:     { emoji: "😤", color: "text-crimson-bright", label: "Tidak suka!" },
};

const LEVEL_LABELS: Record<string, string> = {
  acquaintance: "Kenalan", friends: "Teman", crush: "Naksir",
  dating: "Pacaran", committed: "Serius",
};
const LEVEL_THRESHOLD: Record<string, number> = {
  acquaintance: 25, friends: 50, crush: 75, dating: 100,
};

const RISK_COLORS: Record<string, string> = {
  rendah: "text-green-400/60",
  sedang: "text-yellow-400/60",
  tinggi: "text-crimson-bright/60",
};

export default function DateUI({ relationship, userId, initialDiamonds }: Props) {
  const [rel, setRel] = useState(relationship);
  const [diamonds, setDiamonds] = useState(initialDiamonds);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(false);
  const [giftLoading, setGiftLoading] = useState<string | null>(null);
  const [showGifts, setShowGifts] = useState(false);
  const [toast, setToast] = useState<{ text: string; type: "good" | "bad" | "info" } | null>(null);
  const [levelUp, setLevelUp] = useState<string | null>(null);

  const myAgent = rel.agent_a.owner_id === userId ? rel.agent_a : rel.agent_b;
  const partnerAgent = rel.agent_a.owner_id === userId ? rel.agent_b : rel.agent_a;

  const isMax = rel.level === "committed";
  const nextAt = LEVEL_THRESHOLD[rel.level] ?? 100;
  const progressPct = isMax ? 100 : Math.min((rel.progress / nextAt) * 100, 100);

  function showToast(text: string, type: "good" | "bad" | "info" = "info") {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleChoice(choiceKey: string) {
    if (loading) return;
    setLoading(true);
    setShowGifts(false);

    const res = await fetch("/api/date", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ relationshipId: rel.id, choiceKey }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) { showToast(data.error ?? "Gagal", "bad"); return; }

    const scene: Scene = {
      speakerEmoji: data.speakerEmoji,
      speakerName: data.speakerName,
      listenerEmoji: data.listenerEmoji,
      listenerName: data.listenerName,
      dialogA: data.dialogA,
      dialogB: data.dialogB,
      emotion: data.emotion,
      affinityDelta: data.affinityDelta,
      hint: data.hint,
    };

    setScenes((prev) => [...prev, scene]);
    setRel((r) => ({ ...r, progress: data.newProgress, level: data.newLevel }));

    if (data.newLevel !== rel.level) {
      setLevelUp(LEVEL_LABELS[data.newLevel] ?? data.newLevel);
      setTimeout(() => setLevelUp(null), 3500);
    }
  }

  async function handleGift(giftType: string, cost: number, boost: number) {
    if (diamonds < cost) { showToast("Diamond tidak cukup!", "bad"); return; }
    setGiftLoading(giftType);

    const res = await fetch("/api/gift", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ relationshipId: rel.id, giftType }),
    });

    const data = await res.json();
    setGiftLoading(null);

    if (!res.ok) { showToast(data.error ?? "Gagal", "bad"); return; }

    setDiamonds(data.newBalance);
    const prevLevel = rel.level;
    setRel((r) => ({ ...r, progress: data.newProgress, level: data.newLevel }));
    setShowGifts(false);

    if (data.newLevel !== prevLevel) {
      setLevelUp(LEVEL_LABELS[data.newLevel] ?? data.newLevel);
      setTimeout(() => setLevelUp(null), 3500);
      showToast(`✨ Level naik ke ${LEVEL_LABELS[data.newLevel]}!`, "good");
    } else {
      showToast(`+${boost} ketertarikan dari hadiah!`, "good");
    }
  }

  return (
    <div className="min-h-screen bg-dark flex flex-col" style={{ background: "linear-gradient(180deg, #0D0608 0%, #1a0510 100%)" }}>
      {/* Header */}
      <div className="border-b border-crimson/20 bg-dark-card/60 backdrop-blur-sm px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <a href="/relationships" className="text-muted hover:text-white transition-colors text-lg">←</a>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">{myAgent.avatar_emoji}</span>
            <span className="text-white text-sm font-medium">{myAgent.name}</span>
            <span className="text-crimson-glow">❤️</span>
            <span className="text-white text-sm font-medium">{partnerAgent.name}</span>
            <span className="text-lg">{partnerAgent.avatar_emoji}</span>
          </div>
          {/* Progress bar */}
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`text-xs font-medium ${
              rel.level === "committed" ? "text-gold" :
              rel.level === "dating"    ? "text-crimson-bright" :
              rel.level === "crush"     ? "text-pink-400" :
              rel.level === "friends"   ? "text-blue-400" : "text-muted"
            }`}>
              {LEVEL_LABELS[rel.level] ?? rel.level}
            </span>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progressPct}%`,
                  background: "linear-gradient(90deg, #C0392B, #FF6B6B)",
                }}
              />
            </div>
            <span className="text-xs text-muted">{isMax ? "MAX" : `${rel.progress}/${nextAt}`}</span>
          </div>
        </div>
        {/* Diamond + Gift */}
        <button
          onClick={() => setShowGifts((v) => !v)}
          className="flex items-center gap-1.5 text-xs bg-gold/10 border border-gold/20 text-gold px-3 py-1.5 rounded-xl hover:bg-gold/20 transition-colors"
        >
          🎁 <span className="text-gold font-medium">{diamonds}</span>
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 text-sm px-4 py-2 rounded-xl shadow-lg border ${
          toast.type === "good" ? "bg-green-500/10 border-green-500/30 text-green-400" :
          toast.type === "bad"  ? "bg-crimson/10 border-crimson/30 text-crimson-bright" :
                                  "bg-dark-card border-crimson/20 text-white"
        }`}>
          {toast.text}
        </div>
      )}

      {/* Level Up Banner */}
      {levelUp && (
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-center pointer-events-none">
          <div className="bg-dark-card border border-gold/40 rounded-2xl px-8 py-5 shadow-2xl shadow-gold/20">
            <div className="text-3xl mb-1">✨</div>
            <div className="font-serif text-gold text-xl font-bold">Level Naik!</div>
            <div className="text-white text-sm mt-1">{levelUp}</div>
          </div>
        </div>
      )}

      {/* Gift Panel */}
      {showGifts && (
        <div className="border-b border-gold/20 bg-dark-card/80 px-4 py-3">
          <p className="text-xs text-muted mb-2">🎁 Mode Cepat — Kirim hadiah untuk langsung naikkan hubungan</p>
          <div className="grid grid-cols-4 gap-2">
            {GIFTS.map((g) => {
              const can = diamonds >= g.cost;
              return (
                <button
                  key={g.type}
                  onClick={() => handleGift(g.type, g.cost, g.boost)}
                  disabled={!can || giftLoading !== null}
                  className={`p-2.5 rounded-xl border text-center transition-colors ${
                    can ? "bg-dark-card border-gold/20 hover:border-gold/50 hover:bg-gold/10"
                        : "bg-white/5 border-white/10 opacity-40 cursor-not-allowed"
                  }`}
                >
                  <div className="text-xl mb-0.5">{giftLoading === g.type ? "⏳" : g.emoji}</div>
                  <div className="text-white text-xs font-medium">{g.name}</div>
                  <div className="text-gold text-xs">{g.cost}💎</div>
                  <div className="text-green-400 text-xs">+{g.boost}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Scene Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {scenes.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="flex justify-center gap-6 mb-4">
              <div className="text-5xl">{myAgent.avatar_emoji}</div>
              <div className="text-5xl">{partnerAgent.avatar_emoji}</div>
            </div>
            <p className="font-serif text-white text-lg mb-1">
              {myAgent.name} <span className="text-crimson-glow">×</span> {partnerAgent.name}
            </p>
            <p className="text-muted text-sm">Pilih topik percakapan untuk memulai kencan</p>
          </div>
        )}

        {scenes.map((scene, i) => {
          const emo = EMOTION_CONFIG[scene.emotion] ?? EMOTION_CONFIG.neutral;
          const isPositive = scene.affinityDelta > 0;
          const isNegative = scene.affinityDelta < 0;

          return (
            <div key={i} className="space-y-3">
              {/* Speaker dialog */}
              <div className="flex items-end gap-2 justify-start">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-crimson/40 to-crimson-deep/40 flex items-center justify-center text-xl flex-shrink-0 border border-crimson/30">
                  {scene.speakerEmoji}
                </div>
                <div className="max-w-[75%]">
                  <div className="text-xs text-muted mb-1">{scene.speakerName}</div>
                  <div className="bg-dark-card border border-crimson/20 text-white text-sm px-4 py-2.5 rounded-2xl rounded-bl-sm leading-relaxed">
                    {scene.dialogA}
                  </div>
                </div>
              </div>

              {/* Listener reaction */}
              <div className="flex items-end gap-2 justify-end">
                <div className="max-w-[75%] text-right">
                  <div className="text-xs text-muted mb-1 flex items-center justify-end gap-1.5">
                    <span className={emo.color}>{emo.emoji} {emo.label}</span>
                    <span className="text-muted">— {scene.listenerName}</span>
                  </div>
                  <div className={`text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-sm leading-relaxed border ${
                    isPositive ? "bg-pink-500/10 border-pink-500/20" :
                    isNegative ? "bg-red-900/20 border-red-500/20" :
                                 "bg-dark-card border-white/10"
                  }`}>
                    {scene.dialogB}
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-xl flex-shrink-0 border border-white/10">
                  {scene.listenerEmoji}
                </div>
              </div>

              {/* Affinity delta badge + hint */}
              <div className="flex justify-center">
                <div className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border ${
                  isPositive ? "bg-pink-500/10 border-pink-500/20 text-pink-400" :
                  isNegative ? "bg-red-500/10 border-red-500/20 text-crimson-bright" :
                               "bg-white/5 border-white/10 text-muted"
                }`}>
                  <span className="font-semibold">
                    {isPositive ? `+${scene.affinityDelta}` : scene.affinityDelta} ketertarikan
                  </span>
                  <span className="opacity-60">· {scene.hint}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading scene */}
        {loading && (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="flex gap-3 text-4xl">
              <span className="animate-bounce" style={{ animationDelay: "0ms" }}>{myAgent.avatar_emoji}</span>
              <span className="text-crimson-glow animate-pulse">💬</span>
              <span className="animate-bounce" style={{ animationDelay: "200ms" }}>{partnerAgent.avatar_emoji}</span>
            </div>
            <p className="text-muted text-xs">Sedang berbicara...</p>
          </div>
        )}
      </div>

      {/* Choice Buttons */}
      <div className="border-t border-crimson/20 bg-dark/80 backdrop-blur-sm px-4 py-4 flex-shrink-0">
        <p className="text-xs text-muted mb-3 text-center">
          {loading ? "Menunggu respons..." : "Pilih topik percakapan:"}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {CHOICES.map((c) => (
            <button
              key={c.key}
              onClick={() => handleChoice(c.key)}
              disabled={loading || isMax}
              className="bg-dark-card border border-crimson/20 hover:border-crimson/50 hover:bg-crimson/10 rounded-xl px-2 py-3 text-center transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
            >
              <div className="text-xl mb-1">{c.emoji}</div>
              <div className="text-white text-xs font-medium leading-tight">{c.label}</div>
              <div className={`text-xs mt-0.5 ${RISK_COLORS[c.risk]}`}>risiko {c.risk}</div>
            </button>
          ))}
        </div>

        {isMax && (
          <div className="mt-3 text-center">
            <a
              href="/couple"
              className="inline-block bg-gold/20 hover:bg-gold/30 border border-gold/40 text-gold text-sm font-medium px-6 py-2.5 rounded-xl transition-colors no-underline"
            >
              💍 Hubungan Sudah Serius — Lamar Sekarang!
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
