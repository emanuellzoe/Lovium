"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import TemplateGrid from "@/components/agent/TemplateGrid";
import AIGenerateForm from "@/components/agent/AIGenerateForm";
import CustomForm from "@/components/agent/CustomForm";

type Mode = "template" | "ai" | "custom";

const MODES: { key: Mode; label: string; desc: string }[] = [
  { key: "template", label: "Template", desc: "Pilih karakter siap pakai" },
  { key: "ai", label: "AI Generate", desc: "Biarkan AI buatkan" },
  { key: "custom", label: "Custom", desc: "Tulis sendiri dari nol" },
];

export default function CreateAgentPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("template");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(data: {
    name: string;
    traits: string[];
    personalityPrompt: string;
    avatarEmoji: string;
  }) {
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { error: insertError } = await supabase.from("agents").insert({
        owner_id: user.id,
        name: data.name,
        traits: data.traits,
        personality_prompt: data.personalityPrompt,
        avatar_emoji: data.avatarEmoji,
        rarity: "common",
        generation: 1,
      });

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Gagal membuat agent. Coba lagi.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="border-b border-crimson/20 bg-dark-card/50 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
        <a
          href="/dashboard"
          className="font-serif text-2xl font-bold text-white tracking-wider no-underline"
        >
          LOVIU<span className="text-crimson-glow">M</span>
        </a>
        <a
          href="/dashboard"
          className="text-sm text-muted hover:text-white transition-colors no-underline"
        >
          &larr; Kembali
        </a>
      </header>

      <main className="section-inner py-12 max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl font-bold text-white mb-2">
          Buat Agent Baru
        </h1>
        <p className="text-muted mb-8">
          Pilih cara membuat agent AI dengan kepribadian unik
        </p>

        {/* Mode Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-8">
          {MODES.map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={`rounded-xl p-3 text-center transition-all ${
                mode === m.key
                  ? "bg-crimson/10 border border-crimson text-white"
                  : "bg-dark-card border border-crimson/10 text-muted hover:border-crimson/30"
              }`}
            >
              <div className="font-semibold text-sm">{m.label}</div>
              <div className="text-xs mt-0.5 opacity-70">{m.desc}</div>
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-crimson/10 border border-crimson/30 rounded-lg px-4 py-3 mb-6 text-sm text-crimson-bright">
            {error}
          </div>
        )}

        {/* Forms */}
        {mode === "template" && (
          <TemplateGrid onSubmit={handleSubmit} loading={loading} />
        )}
        {mode === "ai" && (
          <AIGenerateForm onSubmit={handleSubmit} loading={loading} />
        )}
        {mode === "custom" && (
          <CustomForm onSubmit={handleSubmit} loading={loading} />
        )}
      </main>
    </div>
  );
}
