"use client";

import { useState } from "react";
import { AVAILABLE_TRAITS, EMOJI_OPTIONS } from "@/lib/traits";

interface CustomFormProps {
  onSubmit: (data: {
    name: string;
    traits: string[];
    personalityPrompt: string;
    avatarEmoji: string;
  }) => void;
  loading: boolean;
}

export default function CustomForm({ onSubmit, loading }: CustomFormProps) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(EMOJI_OPTIONS[0]);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [personality, setPersonality] = useState("");

  function toggleTrait(trait: string) {
    setSelectedTraits((prev) =>
      prev.includes(trait)
        ? prev.filter((t) => t !== trait)
        : prev.length < 6
          ? [...prev, trait]
          : prev,
    );
  }

  function handleSubmit() {
    onSubmit({
      name: name.trim(),
      traits: selectedTraits,
      personalityPrompt: personality.trim(),
      avatarEmoji: emoji,
    });
  }

  const canSubmit =
    name.trim().length > 0 &&
    selectedTraits.length >= 2 &&
    personality.trim().length >= 100;

  return (
    <div className="space-y-6">
      {/* Name + Emoji */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4">
        <div>
          <label className="block text-sm text-muted mb-1.5">Nama Agent</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama agent"
            className="w-full bg-dark border border-crimson/20 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-crimson transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1.5">Emoji</label>
          <div className="flex flex-wrap gap-1.5 max-w-[200px]">
            {EMOJI_OPTIONS.map((e, i) => (
              <button
                key={`${e}-${i}`}
                onClick={() => setEmoji(e)}
                className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                  emoji === e && EMOJI_OPTIONS.indexOf(e) === EMOJI_OPTIONS.indexOf(emoji)
                    ? "bg-crimson/20 border border-crimson"
                    : "bg-dark-card border border-crimson/10 hover:border-crimson/30"
                } ${emoji === e ? "ring-1 ring-crimson" : ""}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Traits */}
      <div>
        <label className="block text-sm text-muted mb-1.5">
          Traits ({selectedTraits.length}/6, min 2)
        </label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_TRAITS.map((trait) => {
            const isSelected = selectedTraits.includes(trait);
            return (
              <button
                key={trait}
                onClick={() => toggleTrait(trait)}
                className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                  isSelected
                    ? "bg-crimson text-white"
                    : "bg-dark border border-crimson/20 text-muted hover:border-crimson/40 hover:text-white"
                } ${
                  !isSelected && selectedTraits.length >= 6
                    ? "opacity-30 cursor-not-allowed"
                    : ""
                }`}
                disabled={!isSelected && selectedTraits.length >= 6}
              >
                {trait}
              </button>
            );
          })}
        </div>
      </div>

      {/* Personality Prompt */}
      <div>
        <label className="block text-sm text-muted mb-1.5">
          Personality Prompt ({personality.length}/100 min)
        </label>
        <textarea
          value={personality}
          onChange={(e) => setPersonality(e.target.value)}
          placeholder="Deskripsikan kepribadian agent-mu secara detail... (minimal 100 karakter)"
          rows={5}
          className="w-full bg-dark border border-crimson/20 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-crimson transition-colors resize-none"
        />
      </div>

      {/* Live Preview */}
      <div className="bg-dark border border-crimson/20 rounded-xl p-5">
        <p className="text-xs text-muted mb-3">Preview</p>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-crimson/30 to-crimson-deep/30 flex items-center justify-center text-2xl">
            {emoji}
          </div>
          <div>
            <h3 className="text-white font-semibold">
              {name || "Nama Agent"}
            </h3>
            <span className="text-xs text-muted">Gen 1 &bull; Common</span>
          </div>
        </div>
        {selectedTraits.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {selectedTraits.map((trait) => (
              <span
                key={trait}
                className="text-xs px-2 py-0.5 rounded-full bg-crimson/10 text-crimson-bright border border-crimson/20"
              >
                {trait}
              </span>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !canSubmit}
        className="w-full bg-crimson hover:bg-crimson-bright text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Membuat Agent..." : "Buat Agent"}
      </button>
    </div>
  );
}
