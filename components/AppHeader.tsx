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
      <div className="flex items-center gap-4">
        <span className="text-gold text-sm font-medium">
          {profile?.diamond_balance ?? 0}
        </span>
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
