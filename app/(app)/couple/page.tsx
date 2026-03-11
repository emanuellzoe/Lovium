import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import CoupleUI from "./CoupleUI";

const SELECT_AGENTS = `
  *,
  agent_a:agent_a_id(id, name, avatar_emoji, rarity, traits, owner_id, status, generation, personality_prompt, parent_a_id, parent_b_id, is_for_sale, created_at),
  agent_b:agent_b_id(id, name, avatar_emoji, rarity, traits, owner_id, status, generation, personality_prompt, parent_a_id, parent_b_id, is_for_sale, created_at)
`;

export default async function CouplePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { data: myAgents }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("agents").select("id").eq("owner_id", user.id),
  ]);

  const myAgentIds = (myAgents ?? []).map((a) => a.id);

  let married: unknown[] = [];
  let proposed: unknown[] = [];
  let committed: unknown[] = [];

  if (myAgentIds.length > 0) {
    const filter = `agent_a_id.in.(${myAgentIds.join(",")}),agent_b_id.in.(${myAgentIds.join(",")})`;

    const [{ data: m }, { data: p }, { data: c }] = await Promise.all([
      supabase.from("relationships").select(SELECT_AGENTS).or(filter).eq("status", "married"),
      supabase.from("relationships").select(SELECT_AGENTS).or(filter).eq("status", "proposed"),
      supabase
        .from("relationships")
        .select(SELECT_AGENTS)
        .or(filter)
        .eq("status", "active")
        .eq("level", "committed"),
    ]);

    married = m ?? [];
    proposed = p ?? [];
    committed = c ?? [];
  }

  type RelWithAgents = Parameters<typeof CoupleUI>[0]["marriedRels"][0];

  return (
    <div className="min-h-screen bg-dark">
      <AppHeader profile={profile} />
      <CoupleUI
        marriedRels={married as RelWithAgents[]}
        proposedRels={proposed as RelWithAgents[]}
        committedRels={committed as RelWithAgents[]}
        userId={user.id}
      />
    </div>
  );
}
