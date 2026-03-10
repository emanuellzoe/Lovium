"use client";

import { useState } from "react";

interface AIGenerateFormProps {
  onSubmit: (data: {
    name: string;
    traits: string[];
    personalityPrompt: string;
    avatarEmoji: string;
  }) => void;
  loading: boolean;
}

const SPEAKING_STYLES = [
  { value: "Puitis", label: "Puitis" },
  { value: "Langsung", label: "Langsung" },
  { value: "Playful", label: "Playful" },
  { value: "Serius", label: "Serius" },
];

interface GeneratedAgent {
  name: string;
  traits: string[];
  personality_prompt: string;
  avatar_emoji: string;
}

export default function AIGenerateForm({
  onSubmit,
  loading,
}: AIGenerateFormProps) {
  const [word, setWord] = useState("");
  const [likes, setLikes] = useState("");
  const [style, setStyle] = useState("Puitis");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<GeneratedAgent | null>(null);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!word.trim() || !likes.trim()) {
      setError("Jawab semua pertanyaan dulu");
      return;
    }

    setError("");
    setGenerating(true);
    setResult(null);

    try {
      const res = await fetch("/api/generate-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: word.trim(), likes: likes.trim(), style }),
      });

      if (!res.ok) {
        throw new Error("Gagal generate");
      }

      const data: GeneratedAgent = await res.json();
      setResult(data);
    } catch {
      setError("Gagal generate agent. Coba lagi.");
    } finally {
      setGenerating(false);
    }
  }

  function handleSubmit() {
    if (!result) return;
    onSubmit({
      name: result.name,
      traits: result.traits,
      personalityPrompt: result.personality_prompt,
      avatarEmoji: result.avatar_emoji,
    });
  }

  return (
    <div className="space-y-5">
      {/* Questions */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1.5">
            Satu kata yang menggambarkan agent-mu?
          </label>
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="contoh: Mysterious"
            className="w-full bg-dark border border-crimson/20 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-crimson transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1.5">
            Apa yang paling disukai agent-mu?
          </label>
          <input
            type="text"
            value={likes}
            onChange={(e) => setLikes(e.target.value)}
            placeholder="contoh: Membaca buku di tengah hujan"
            className="w-full bg-dark border border-crimson/20 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-crimson transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1.5">
            Bagaimana cara agent-mu berbicara?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SPEAKING_STYLES.map((s) => (
              <button
                key={s.value}
                onClick={() => setStyle(s.value)}
                className={`px-3 py-2 rounded-lg text-sm transition-all ${
                  style === s.value
                    ? "bg-crimson text-white"
                    : "bg-dark border border-crimson/20 text-muted hover:border-crimson/40"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-crimson/10 border border-crimson/30 rounded-lg px-4 py-3 text-sm text-crimson-bright">
          {error}
        </div>
      )}

      {!result && (
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full bg-crimson hover:bg-crimson-bright text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {generating ? "AI sedang membuat..." : "Generate dengan AI"}
        </button>
      )}

      {/* Result Preview */}
      {result && (
        <div className="bg-dark border border-crimson/20 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-crimson/30 to-crimson-deep/30 flex items-center justify-center text-3xl">
              {result.avatar_emoji}
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">
                {result.name}
              </h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {result.traits.map((trait) => (
                  <span
                    key={trait}
                    className="text-xs px-2 py-0.5 rounded-full bg-crimson/10 text-crimson-bright"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-dark-card border border-crimson/10 rounded-lg p-4">
            <p className="text-xs text-muted mb-1">Personality</p>
            <p className="text-sm text-text-light leading-relaxed">
              {result.personality_prompt}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex-1 border border-crimson/30 text-muted hover:text-white hover:border-crimson/50 font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {generating ? "Generating..." : "Generate Ulang"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-crimson hover:bg-crimson-bright text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Membuat..." : "Buat Agent"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
