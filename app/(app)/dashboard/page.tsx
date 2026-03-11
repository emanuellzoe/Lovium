import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AppHeader from "@/components/AppHeader";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: agents } = await supabase
    .from("agents")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-dark">
      <AppHeader profile={profile} />

      <main className="section-inner py-12">
        <h1 className="font-serif text-3xl font-bold text-white mb-2">
          Selamat datang, {profile?.username ?? "User"}!
        </h1>
        <p className="text-muted mb-8">
          {agents && agents.length > 0
            ? `Kamu punya ${agents.length} agent`
            : "Mulai dengan membuat agent pertamamu"}
        </p>

        {/* Agent Cards */}
        {agents && agents.length > 0 && (
          <section className="mb-10">
            <h2 className="text-white font-semibold text-lg mb-4">
              Agent Saya
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="bg-dark-card border border-crimson/20 rounded-xl p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-crimson/30 to-crimson-deep/30 flex items-center justify-center text-2xl">
                      {agent.avatar_emoji}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">
                        {agent.name}
                      </h3>
                      <span className="text-xs text-muted">
                        Gen {agent.generation}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(agent.traits as string[]).slice(0, 3).map((trait) => (
                      <span
                        key={trait}
                        className="text-xs px-2 py-0.5 rounded-full bg-crimson/10 text-crimson-bright border border-crimson/20"
                      >
                        {trait}
                      </span>
                    ))}
                    {(agent.traits as string[]).length > 3 && (
                      <span className="text-xs text-muted">
                        +{(agent.traits as string[]).length - 3}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        agent.rarity === "legendary"
                          ? "bg-gold/10 text-gold border border-gold/20"
                          : agent.rarity === "epic"
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            : agent.rarity === "rare"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : "bg-white/5 text-muted border border-white/10"
                      }`}
                    >
                      {agent.rarity}
                    </span>
                    <span className="text-xs text-muted">
                      {agent.status === "married"
                        ? "Married"
                        : agent.status === "dating"
                          ? "Dating"
                          : "Single"}
                    </span>
                  </div>
                  <a
                    href={`/chat/${agent.id}`}
                    className="block w-full text-center text-xs py-1.5 rounded-lg bg-crimson/10 hover:bg-crimson/20 text-crimson-bright border border-crimson/20 hover:border-crimson/40 transition-colors no-underline"
                  >
                    💬 Chat
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="/create-agent"
            className="bg-dark-card border border-crimson/20 rounded-xl p-6 hover:border-crimson/40 transition-colors no-underline group"
          >
            <div className="text-4xl mb-3">+</div>
            <h3 className="text-white font-semibold mb-1 group-hover:text-crimson-bright transition-colors">
              Buat Agent Baru
            </h3>
            <p className="text-muted text-sm">
              Buat AI agent dengan kepribadian unik
            </p>
          </a>

          <a
            href="/discover"
            className="bg-dark-card border border-crimson/20 rounded-xl p-6 hover:border-crimson/40 transition-colors no-underline group"
          >
            <div className="text-4xl mb-3">&#x2764;</div>
            <h3 className="text-white font-semibold mb-1 group-hover:text-crimson-bright transition-colors">
              Discover
            </h3>
            <p className="text-muted text-sm">
              Temukan pasangan untuk agent-mu
            </p>
          </a>

          <a
            href="/relationships"
            className="bg-dark-card border border-crimson/20 rounded-xl p-6 hover:border-crimson/40 transition-colors no-underline group"
          >
            <div className="text-4xl mb-3">💎</div>
            <h3 className="text-white font-semibold mb-1 group-hover:text-crimson-bright transition-colors">
              Hubungan
            </h3>
            <p className="text-muted text-sm">
              Kirim hadiah dan tingkatkan hubungan
            </p>
          </a>
        </div>
      </main>
    </div>
  );
}
