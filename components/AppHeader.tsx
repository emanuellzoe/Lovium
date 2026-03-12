import type { Profile } from "@/types/user";

interface AppHeaderProps {
  profile: Profile | null;
}

export default function AppHeader({ profile }: AppHeaderProps) {
  return (
    <header className="border-b border-crimson/20 bg-dark-card/50 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
      <a
        href="/dashboard"
        className="font-serif text-2xl font-bold text-white tracking-wider no-underline"
      >
        LOVIU<span className="text-crimson-glow">M</span>
      </a>
      <nav className="hidden sm:flex items-center gap-1">
        <a href="/discover" className="text-xs text-muted hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors no-underline">
          Discover
        </a>
        <a href="/relationships" className="text-xs text-muted hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors no-underline">
          Hubungan
        </a>
        <a href="/couple" className="text-xs text-muted hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors no-underline">
          Nikah
        </a>
        <a href="/marketplace" className="text-xs text-muted hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors no-underline">
          Marketplace
        </a>
      </nav>
      <div className="flex items-center gap-4">
        <a href="/topup" className="flex items-center gap-1.5 text-gold text-sm font-medium hover:opacity-80 transition-opacity no-underline">
          💎 {profile?.diamond_balance ?? 0}
        </a>
        <span className="text-sm text-muted">
          @{profile?.username ?? "user"}
        </span>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="text-xs text-muted hover:text-white transition-colors"
          >
            Logout
          </button>
        </form>
      </div>
    </header>
  );
}
