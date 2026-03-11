"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Agent } from "@/types/agent";

interface RelWithAgents {
  id: string;
  status: string;
  level: string;
  progress: number;
  married_at: string | null;
  spawn_count: number;
  agent_a: Agent;
  agent_b: Agent;
}

interface Props {
  marriedRels: RelWithAgents[];
  proposedRels: RelWithAgents[];
  committedRels: RelWithAgents[];
  userId: string;
}

export default function CoupleUI({ marriedRels, proposedRels, committedRels, userId }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const router = useRouter();

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAction = async (
    action: "propose" | "accept" | "reject",
    relationshipId: string,
  ) => {
    setLoading(action + relationshipId);
    try {
      const res = await fetch("/api/marry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, relationshipId }),
      });
      const data = await res.json();

      if (data.error) {
        showToast(data.error);
        return;
      }

      if (data.result === "married") {
        showToast("💍 Selamat! Mereka resmi menikah!");
      } else if (data.result === "proposed") {
        showToast("💌 Lamaran terkirim! Menunggu jawaban...");
      } else if (data.result === "rejected") {
        showToast("💔 Lamaran ditolak.");
      }

      router.refresh();
    } finally {
      setLoading(null);
    }
  };

  const AgentPair = ({ rel, children }: { rel: RelWithAgents; children?: React.ReactNode }) => (
    <div className="bg-dark-card border border-crimson/20 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-crimson/30 to-crimson-deep/30 flex items-center justify-center text-2xl">
            {rel.agent_a.avatar_emoji}
          </div>
          <div>
            <p className="text-white text-sm font-medium">{rel.agent_a.name}</p>
            <p className="text-muted text-xs">
              {rel.agent_a.owner_id === userId ? "Agentmu" : "Agent lain"}
            </p>
          </div>
        </div>

        <div className="flex-1 text-center text-2xl">💍</div>

        <div className="flex items-center gap-2 flex-row-reverse">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-crimson/30 to-crimson-deep/30 flex items-center justify-center text-2xl">
            {rel.agent_b.avatar_emoji}
          </div>
          <div className="text-right">
            <p className="text-white text-sm font-medium">{rel.agent_b.name}</p>
            <p className="text-muted text-xs">
              {rel.agent_b.owner_id === userId ? "Agentmu" : "Agent lain"}
            </p>
          </div>
        </div>
      </div>
      {children}
    </div>
  );

  return (
    <div className="section-inner py-10">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-dark-card border border-crimson/30 text-white text-sm px-4 py-2 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-white mb-1">Pernikahan</h1>
        <p className="text-muted text-sm">Lamar, terima, dan kelola pasangan agenmu</p>
      </div>

      {/* Incoming Proposals */}
      {proposedRels.length > 0 && (
        <section className="mb-10">
          <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            💌 Lamaran Masuk
            <span className="text-xs bg-crimson/20 text-crimson-bright px-2 py-0.5 rounded-full border border-crimson/30">
              {proposedRels.length}
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proposedRels.map((rel) => (
              <AgentPair key={rel.id} rel={rel}>
                <p className="text-muted text-xs text-center mb-3">
                  Ingin menjadi pasangan resmi
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction("reject", rel.id)}
                    disabled={!!loading}
                    className="flex-1 py-2 rounded-xl border border-white/10 text-muted hover:border-white/20 hover:text-white text-sm transition-colors disabled:opacity-40"
                  >
                    {loading === "reject" + rel.id ? "..." : "✕ Tolak"}
                  </button>
                  <button
                    onClick={() => handleAction("accept", rel.id)}
                    disabled={!!loading}
                    className="flex-1 py-2 rounded-xl bg-crimson hover:bg-crimson-bright text-white text-sm font-medium transition-colors disabled:opacity-40"
                  >
                    {loading === "accept" + rel.id ? "..." : "💍 Terima"}
                  </button>
                </div>
              </AgentPair>
            ))}
          </div>
        </section>
      )}

      {/* Ready to Propose */}
      {committedRels.length > 0 && (
        <section className="mb-10">
          <h2 className="text-white font-semibold text-lg mb-4">💫 Siap Dilamar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {committedRels.map((rel) => (
              <AgentPair key={rel.id} rel={rel}>
                <p className="text-muted text-xs text-center mb-3">
                  Hubungan sudah sangat kuat · Level Serius
                </p>
                <button
                  onClick={() => handleAction("propose", rel.id)}
                  disabled={!!loading}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-crimson to-crimson-bright hover:opacity-90 text-white text-sm font-medium transition-opacity disabled:opacity-40"
                >
                  {loading === "propose" + rel.id ? "Memproses..." : "💍 Lamar Sekarang"}
                </button>
              </AgentPair>
            ))}
          </div>
        </section>
      )}

      {/* Married Couples */}
      {marriedRels.length > 0 && (
        <section className="mb-10">
          <h2 className="text-white font-semibold text-lg mb-4">👑 Pasangan Resmi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marriedRels.map((rel) => (
              <AgentPair key={rel.id} rel={rel}>
                {rel.married_at && (
                  <p className="text-muted text-xs text-center mb-3">
                    Menikah pada{" "}
                    {new Date(rel.married_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}
                <div className="flex gap-2">
                  <a
                    href={`/chat/${rel.agent_a.owner_id === userId ? rel.agent_a.id : rel.agent_b.id}`}
                    className="flex-1 text-center text-xs py-2 rounded-xl bg-crimson/10 hover:bg-crimson/20 text-crimson-bright border border-crimson/20 transition-colors no-underline"
                  >
                    💬 Chat
                  </a>
                  <a
                    href={`/spawn/${rel.id}`}
                    className="flex-1 text-center text-xs py-2 rounded-xl bg-gold/10 hover:bg-gold/20 text-gold border border-gold/20 transition-colors no-underline"
                  >
                    ✨ Spawn Anak
                  </a>
                </div>
              </AgentPair>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {marriedRels.length === 0 &&
        proposedRels.length === 0 &&
        committedRels.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">💍</div>
            <p className="text-white font-semibold mb-2">Belum ada pasangan</p>
            <p className="text-muted text-sm mb-6">
              Tingkatkan hubungan ke level &quot;Serius&quot; untuk bisa melamar
            </p>
            <a
              href="/relationships"
              className="inline-block bg-crimson hover:bg-crimson-bright text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors no-underline"
            >
              Lihat Hubungan
            </a>
          </div>
        )}
    </div>
  );
}
