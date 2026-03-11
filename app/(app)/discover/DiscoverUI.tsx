"use client";

import { useState } from "react";
import { Agent } from "@/types/agent";

interface Props {
  myAgents: Agent[];
  otherAgents: Agent[];
  initialLikedIds: Record<string, string[]>;
  myAgentIds: string[]; // to label own agents in discover list
}

interface MatchInfo {
  myAgent: Agent;
  theirAgent: Agent;
}

export default function DiscoverUI({ myAgents, otherAgents, initialLikedIds, myAgentIds }: Props) {
  const [selectedId, setSelectedId] = useState(myAgents[0]?.id ?? "");
  const [likedIds, setLikedIds] = useState<Record<string, Set<string>>>(() => {
    const result: Record<string, Set<string>> = {};
    for (const [k, v] of Object.entries(initialLikedIds)) {
      result[k] = new Set(v);
    }
    return result;
  });
  const [passedIds, setPassedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<string | null>(null);
  const [match, setMatch] = useState<MatchInfo | null>(null);

  const selectedAgent = myAgents.find((a) => a.id === selectedId);
  const myLiked = likedIds[selectedId] ?? new Set();

  // Exclude currently selected agent from visible list
  const visible = otherAgents.filter(
    (a) => a.id !== selectedId && !myLiked.has(a.id) && !passedIds.has(a.id),
  );

  const handleLike = async (target: Agent) => {
    if (!selectedId || loading) return;
    setLoading(target.id);

    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromAgentId: selectedId, toAgentId: target.id }),
      });

      const data = await res.json();

      // Remove from visible
      setLikedIds((prev) => {
        const copy = { ...prev };
        const set = new Set(copy[selectedId] ?? []);
        set.add(target.id);
        copy[selectedId] = set;
        return copy;
      });

      if (data.matched) {
        setMatch({ myAgent: selectedAgent!, theirAgent: target });
      }
    } catch {
      // silently fail
    } finally {
      setLoading(null);
    }
  };

  const handlePass = (targetId: string) => {
    setPassedIds((prev) => new Set([...prev, targetId]));
  };

  const rarityClass = (rarity: string) =>
    rarity === "legendary"
      ? "bg-gold/10 text-gold border-gold/20"
      : rarity === "epic"
        ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
        : rarity === "rare"
          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
          : "bg-white/5 text-muted border-white/10";

  return (
    <div className="section-inner py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-white mb-1">Discover</h1>
        <p className="text-muted text-sm">Temukan pasangan untuk agentmu</p>
      </div>

      {/* My Agent Selector */}
      {myAgents.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🤖</div>
          <p className="text-white font-semibold mb-2">Belum punya agent</p>
          <p className="text-muted text-sm mb-6">Buat agent dulu sebelum bisa discover</p>
          <a
            href="/create-agent"
            className="inline-block bg-crimson hover:bg-crimson-bright text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors no-underline"
          >
            Buat Agent
          </a>
        </div>
      ) : (
        <>
          {/* Selected Agent */}
          <div className="mb-6">
            <p className="text-muted text-xs mb-2 uppercase tracking-wider">Agent kamu</p>
            {myAgents.length === 1 ? (
              <div className="inline-flex items-center gap-2 bg-dark-card border border-crimson/30 rounded-xl px-3 py-2">
                <span className="text-xl">{selectedAgent?.avatar_emoji}</span>
                <span className="text-white text-sm font-medium">{selectedAgent?.name}</span>
              </div>
            ) : (
              <div className="flex gap-2 flex-wrap">
                {myAgents.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setSelectedId(a.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-colors ${
                      a.id === selectedId
                        ? "bg-crimson/20 border-crimson text-white"
                        : "bg-dark-card border-crimson/20 text-muted hover:border-crimson/40 hover:text-white"
                    }`}
                  >
                    <span>{a.avatar_emoji}</span>
                    <span>{a.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Agent Cards */}
          {visible.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">✨</div>
              <p className="text-white font-semibold mb-2">Tidak ada agent tersedia</p>
              <p className="text-muted text-sm">
                Kamu sudah melihat semua agent. Coba lagi nanti!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visible.map((agent) => (
                <div
                  key={agent.id}
                  className="bg-dark-card border border-crimson/20 rounded-xl p-5 flex flex-col"
                >
                  {/* Agent Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-crimson/30 to-crimson-deep/30 flex items-center justify-center text-3xl">
                      {agent.avatar_emoji}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{agent.name}</h3>
                      <span className="text-xs text-muted">
                        {myAgentIds.includes(agent.id) ? "🏠 Agentmu" : `Gen ${agent.generation}`}
                      </span>
                    </div>
                    <span
                      className={`ml-auto text-xs px-2 py-0.5 rounded-full border ${rarityClass(agent.rarity)}`}
                    >
                      {agent.rarity}
                    </span>
                  </div>

                  {/* Traits */}
                  <div className="flex flex-wrap gap-1.5 mb-4 flex-1">
                    {(agent.traits as string[]).map((trait) => (
                      <span
                        key={trait}
                        className="text-xs px-2 py-0.5 rounded-full bg-crimson/10 text-crimson-bright border border-crimson/20"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePass(agent.id)}
                      disabled={!!loading}
                      className="flex-1 py-2 rounded-xl border border-white/10 text-muted hover:border-white/20 hover:text-white text-sm transition-colors disabled:opacity-40"
                    >
                      ✕ Pass
                    </button>
                    <button
                      onClick={() => handleLike(agent)}
                      disabled={!!loading}
                      className="flex-1 py-2 rounded-xl bg-crimson hover:bg-crimson-bright text-white text-sm font-medium transition-colors disabled:opacity-40 flex items-center justify-center gap-1.5"
                    >
                      {loading === agent.id ? (
                        <span className="animate-pulse">...</span>
                      ) : (
                        <>❤️ Like</>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Match Modal */}
      {match && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="bg-dark-card border border-crimson/40 rounded-2xl p-8 max-w-sm w-full text-center">
            <div className="text-5xl mb-2">💕</div>
            <h2 className="font-serif text-2xl font-bold text-white mb-1">It&apos;s a Match!</h2>
            <p className="text-muted text-sm mb-6">
              <span className="text-crimson-bright">{match.myAgent.name}</span> dan{" "}
              <span className="text-crimson-bright">{match.theirAgent.name}</span> saling tertarik!
            </p>

            <div className="flex justify-center gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-crimson/30 to-crimson-deep/30 flex items-center justify-center text-3xl mx-auto mb-1">
                  {match.myAgent.avatar_emoji}
                </div>
                <p className="text-xs text-muted">{match.myAgent.name}</p>
              </div>
              <div className="flex items-center text-crimson-glow text-2xl">❤️</div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-crimson/30 to-crimson-deep/30 flex items-center justify-center text-3xl mx-auto mb-1">
                  {match.theirAgent.avatar_emoji}
                </div>
                <p className="text-xs text-muted">{match.theirAgent.name}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <a
                href={`/chat/${match.myAgent.id}`}
                className="block w-full py-2.5 bg-crimson hover:bg-crimson-bright text-white rounded-xl text-sm font-medium transition-colors no-underline"
              >
                💬 Mulai Chat
              </a>
              <button
                onClick={() => setMatch(null)}
                className="w-full py-2.5 border border-crimson/20 text-muted hover:text-white rounded-xl text-sm transition-colors"
              >
                Lanjut Discover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
