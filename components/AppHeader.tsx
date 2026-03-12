"use client";

import { useState, useRef, useEffect } from "react";
import type { Profile } from "@/types/user";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/i18n";

interface AppHeaderProps {
  profile: Profile | null;
}

export default function AppHeader({ profile }: AppHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { lang, toggle } = useLanguage();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const username = profile?.username ?? t("profile", "guest", lang);

  return (
    <header className="border-b border-crimson/20 bg-dark-card/50 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <a href="/dashboard" className="font-serif text-2xl font-bold text-white tracking-wider no-underline">
        LOVIU<span className="text-crimson-glow">M</span>
      </a>

      {/* Nav */}
      <nav className="hidden sm:flex items-center gap-1">
        <a href="/discover" className="text-sm text-muted hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors no-underline">
          {t("nav", "discover", lang)}
        </a>
        <a href="/relationships" className="text-sm text-muted hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors no-underline">
          {t("nav", "relationships", lang)}
        </a>
        <a href="/couple" className="text-sm text-muted hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors no-underline">
          {t("nav", "couple", lang)}
        </a>
        <a href="/marketplace" className="text-sm text-muted hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors no-underline">
          {t("nav", "marketplace", lang)}
        </a>
      </nav>

      {/* Kanan */}
      <div className="flex items-center gap-3">
        {/* Toggle Bahasa */}
        <button
          onClick={toggle}
          title={lang === "id" ? "Switch to English" : "Ganti ke Indonesia"}
          className="flex items-center gap-1.5 text-xs font-semibold border rounded-full px-2.5 py-1 transition-all bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-muted hover:text-white"
        >
          <span className="text-base leading-none">{lang === "id" ? "🇮🇩" : "🇬🇧"}</span>
          <span className="uppercase">{lang === "id" ? "ID" : "EN"}</span>
        </button>

        {/* Diamond balance */}
        <a href="/topup" className="flex items-center gap-1.5 text-gold text-sm font-medium hover:opacity-80 transition-opacity no-underline">
          💎 {profile?.diamond_balance?.toLocaleString() ?? 0}
        </a>

        {/* Profil dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full px-3 py-1.5 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-crimson/30 border border-crimson/40 flex items-center justify-center text-xs font-bold text-white uppercase">
              {username.charAt(0)}
            </div>
            <span className="text-sm text-white font-medium max-w-[100px] truncate">{username}</span>
            <svg
              className={`w-3 h-3 text-muted transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-dark-card border border-crimson/20 rounded-xl shadow-xl shadow-black/40 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-crimson/10">
                <div className="text-white font-semibold text-sm truncate">{username}</div>
                <div className="text-muted text-xs mt-0.5">💎 {profile?.diamond_balance?.toLocaleString() ?? 0} {t("common", "diamond", lang)}</div>
              </div>

              <div className="py-1">
                <a href="/dashboard" onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted hover:text-white hover:bg-white/5 transition-colors no-underline">
                  <span>🏠</span> {t("profile", "dashboard", lang)}
                </a>
                <a href="/topup" onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted hover:text-white hover:bg-white/5 transition-colors no-underline">
                  <span>💎</span> {t("profile", "topup", lang)}
                </a>
                <a href="/create-agent" onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted hover:text-white hover:bg-white/5 transition-colors no-underline">
                  <span>✨</span> {t("profile", "createAgent", lang)}
                </a>
              </div>

              <div className="border-t border-crimson/10 py-1">
                <form action="/auth/signout" method="post">
                  <button type="submit"
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-crimson-bright hover:text-white hover:bg-crimson/10 transition-colors text-left">
                    <span>🚪</span> {t("profile", "logout", lang)}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
