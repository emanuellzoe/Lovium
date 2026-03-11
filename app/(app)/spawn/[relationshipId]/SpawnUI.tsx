"use client";

import { useState } from "react";
import { Agent } from "@/types/agent";

interface Props {
  relationshipId: string;
  agentA: Agent;
  agentB: Agent;
  spawnCount: number;
  lastSpawnAt: string | null;
}

const RARITY_CLASS: Record<string, string> = {
  legendary: "bg-gold/10 text-gold border-gold/20",
  epic: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  rare: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  common: "bg-white/5 text-muted border-white/10",
};

const COOLDOWN_MS = 60 * 60 * 1000;

function getCooldownText(lastSpawnAt: string | null): string | null {
  if (!lastSpawnAt) return null;
  const remaining = COOLDOWN_MS - (Date.now() - new Date(lastSpawnAt).getTime());
  if (remaining <= 0) return null;
  const min = Math.ceil(remaining / 60000);
  return `${min} menit`;
}

export default function SpawnUI({ relationshipId, agentA, agentB, spawnCount, lastSpawnAt }: Props) {
  const [loading, setLoading] = useState(false);
  const [childAgent, setChildAgent] = useState<Agent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cooldown = getCooldownText(lastSpawnAt);

  const handleSpawn = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/spawn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ relationshipId }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setChildAgent(data.agent);
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-inner py-10 max-w-2xl">
      <div className="mb-8">
        <a href="/couple" className="text-muted hover:text-white text-sm transition-colors">
          ← Kembali
        </a>
        <h1 className="font-serif text-3xl font-bold text-white mt-3 mb-1">Spawn Child Agent</h1>
        <p className="text-muted text-sm">
          Gabungkan trait kedua orang tua untuk menciptakan agent baru
        </p>
      </div>

      {/* Parents */}
      <div className="bg-dark-card border border-crimson/20 rounded-xl p-6 mb-6">
        <p className="text-muted text-xs uppercase tracking-wider mb-4">Orang Tua</p>
        <div className="flex items-center justify-between gap-4">
          {/* Agent A */}
          <div className="flex-1 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-crimson/30 to-crimson-deep/30 flex items-center justify-center text-3xl mx-auto mb-2">
              {agentA.avatar_emoji}
            </div>
            <p className="text-white font-semibold text-sm">{agentA.name}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${RARITY_CLASS[agentA.rarity]}`}>
              {agentA.rarity}
            </span>
            <div className="flex flex-wrap gap-1 justify-center mt-2">
              {agentA.traits.slice(0, 2).map((t) => (
                <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-crimson/10 text-crimson-bright">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="text-3xl flex-shrink-0">✨</div>

          {/* Agent B */}
          <div className="flex-1 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-crimson/30 to-crimson-deep/30 flex items-center justify-center text-3xl mx-auto mb-2">
              {agentB.avatar_emoji}
            </div>
            <p className="text-white font-semibold text-sm">{agentB.name}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${RARITY_CLASS[agentB.rarity]}`}>
              {agentB.rarity}
            </span>
            <div className="flex flex-wrap gap-1 justify-center mt-2">
              {agentB.traits.slice(0, 2).map((t) => (
                <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-crimson/10 text-crimson-bright">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-crimson/10 flex items-center justify-between text-xs text-muted">
          <span>Sudah di-spawn: {spawnCount}x</span>
          {cooldown && <span>Cooldown: {cooldown}</span>}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {/* Spawn Button */}
      {!childAgent && (
        <button
          onClick={handleSpawn}
          disabled={loading || !!cooldown}
          className="w-full py-4 bg-gradient-to-r from-crimson to-crimson-bright hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-opacity text-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">✨</span>
              Generating child agent...
            </span>
          ) : cooldown ? (
            `⏳ Cooldown ${cooldown}`
          ) : (
            "✨ Spawn Child Agent"
          )}
        </button>
      )}

      {/* Result */}
      {childAgent && (
        <div className="bg-dark-card border border-gold/30 rounded-xl p-6 text-center">
          <div className="text-gold text-sm uppercase tracking-wider mb-4">✨ Agent Baru Lahir!</div>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold/20 to-crimson/20 flex items-center justify-center text-4xl mx-auto mb-3">
            {childAgent.avatar_emoji}
          </div>
          <h2 className="font-serif text-2xl font-bold text-white mb-1">{childAgent.name}</h2>
          <p className="text-muted text-xs mb-3">
            Gen {childAgent.generation} · Anak dari {agentA.name} & {agentB.name}
          </p>
          <span className={`inline-block text-xs px-3 py-1 rounded-full border mb-4 ${RARITY_CLASS[childAgent.rarity]}`}>
            {childAgent.rarity}
          </span>
          <div className="flex flex-wrap gap-1.5 justify-center mb-6">
            {childAgent.traits.map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-crimson/10 text-crimson-bright border border-crimson/20">
                {t}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <a
              href={`/chat/${childAgent.id}`}
              className="flex-1 text-center py-2.5 bg-crimson hover:bg-crimson-bright text-white rounded-xl text-sm font-medium transition-colors no-underline"
            >
              💬 Chat
            </a>
            <a
              href="/dashboard"
              className="flex-1 text-center py-2.5 border border-crimson/20 text-muted hover:text-white rounded-xl text-sm transition-colors no-underline"
            >
              Dashboard
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
