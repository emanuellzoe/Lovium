"use client";

import { useState, useEffect, useRef } from "react";
import { Agent } from "@/types/agent";

interface Message {
  id: string;
  role: "user" | "agent";
  content: string;
}

export default function ChatUI({ agent }: { agent: Agent }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const storageKey = `chat_${agent.id}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setMessages(JSON.parse(saved));
  }, [storageKey]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, storageKey]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const autoResize = () => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "40px";
    setLoading(true);

    try {
      const history = newMessages.map((m) => ({
        role: m.role === "user" ? ("user" as const) : ("assistant" as const),
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: agent.id,
          message: userMsg.content,
          history: history.slice(-10),
        }),
      });

      const data = await res.json();
      if (data.response) {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "agent", content: data.response },
        ]);
      }
    } catch {
      // keep user message visible, just no response
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const rarityClass =
    agent.rarity === "legendary"
      ? "bg-gold/10 text-gold border-gold/20"
      : agent.rarity === "epic"
        ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
        : agent.rarity === "rare"
          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
          : "bg-white/5 text-muted border-white/10";

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
      {/* Header */}
      <div className="bg-dark-card border-b border-crimson/20 px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <a
          href="/dashboard"
          className="text-muted hover:text-white transition-colors text-lg leading-none"
        >
          ←
        </a>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-crimson/30 to-crimson-deep/30 flex items-center justify-center text-xl flex-shrink-0">
          {agent.avatar_emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-semibold text-sm">{agent.name}</h2>
          <p className="text-muted text-xs truncate">
            {agent.traits.slice(0, 3).join(" · ")}
          </p>
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${rarityClass}`}
        >
          {agent.rarity}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center mt-12">
            <div className="text-5xl mb-3">{agent.avatar_emoji}</div>
            <p className="text-white font-semibold mb-1">{agent.name}</p>
            <p className="text-muted text-sm">
              Mulai percakapan dengan agentmu
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "agent" && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-crimson/30 to-crimson-deep/30 flex items-center justify-center text-sm flex-shrink-0">
                {agent.avatar_emoji}
              </div>
            )}
            <div
              className={`max-w-[75%] px-3 py-2 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-crimson text-white rounded-2xl rounded-br-sm"
                  : "bg-dark-card border border-crimson/20 text-text-light rounded-2xl rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-end gap-2 justify-start">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-crimson/30 to-crimson-deep/30 flex items-center justify-center text-sm flex-shrink-0">
              {agent.avatar_emoji}
            </div>
            <div className="bg-dark-card border border-crimson/20 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1 items-center">
                <div
                  className="w-1.5 h-1.5 bg-crimson-bright rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-1.5 h-1.5 bg-crimson-bright rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-1.5 h-1.5 bg-crimson-bright rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-crimson/20 px-4 py-3 bg-dark flex-shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              autoResize();
            }}
            onKeyDown={handleKeyDown}
            placeholder={`Kirim pesan ke ${agent.name}...`}
            rows={1}
            className="flex-1 bg-dark-card border border-crimson/20 rounded-xl px-3 py-2 text-white text-sm placeholder-muted resize-none focus:outline-none focus:border-crimson/50 transition-colors"
            style={{ minHeight: "40px", maxHeight: "120px" }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="bg-crimson hover:bg-crimson-bright disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors flex-shrink-0"
          >
            Kirim
          </button>
        </div>
        <p className="text-muted text-xs mt-1.5">
          Enter untuk kirim · Shift+Enter baris baru
        </p>
      </div>
    </div>
  );
}
