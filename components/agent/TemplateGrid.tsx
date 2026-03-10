"use client";

import { useState } from "react";
import { AGENT_TEMPLATES } from "@/lib/traits";

interface TemplateGridProps {
  onSubmit: (data: {
    name: string;
    traits: string[];
    personalityPrompt: string;
    avatarEmoji: string;
  }) => void;
  loading: boolean;
}

export default function TemplateGrid({ onSubmit, loading }: TemplateGridProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [customName, setCustomName] = useState("");

  const template = selected !== null ? AGENT_TEMPLATES[selected] : null;

  function handleSubmit() {
    if (!template) return;
    onSubmit({
      name: customName.trim() || template.name,
      traits: [...template.traits],
      personalityPrompt: template.personalityPrompt,
      avatarEmoji: template.emoji,
    });
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {AGENT_TEMPLATES.map((t, i) => (
          <button
            key={t.label}
            onClick={() => {
              setSelected(i);
              setCustomName("");
            }}
            className={`bg-dark border rounded-xl p-4 text-left transition-all ${
              selected === i
                ? "border-crimson shadow-[0_0_20px_rgba(192,57,43,0.15)]"
                : "border-crimson/10 hover:border-crimson/30"
            }`}
          >
            <div className="text-3xl mb-2">{t.emoji}</div>
            <div className="text-white font-semibold text-sm">{t.name}</div>
            <div className="text-muted text-xs">{t.label}</div>
            <div className="flex flex-wrap gap-1 mt-2">
              {t.traits.map((trait) => (
                <span
                  key={trait}
                  className="text-[10px] px-1.5 py-0.5 rounded-full bg-crimson/10 text-crimson-bright"
                >
                  {trait}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {template && (
        <div className="bg-dark border border-crimson/20 rounded-xl p-5 space-y-4">
          <div>
            <label className="block text-sm text-muted mb-1.5">
              Nama Agent (opsional, default: {template.name})
            </label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder={template.name}
              className="w-full bg-dark-card border border-crimson/20 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-crimson transition-colors"
            />
          </div>

          <div className="bg-dark-card border border-crimson/10 rounded-lg p-4">
            <p className="text-xs text-muted mb-1">Personality Preview</p>
            <p className="text-sm text-text-light leading-relaxed">
              {template.personalityPrompt}
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-crimson hover:bg-crimson-bright text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Membuat Agent..." : "Buat Agent"}
          </button>
        </div>
      )}
    </div>
  );
}
