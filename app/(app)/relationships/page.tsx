import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import RelationshipsUI from "./RelationshipsUI";

export default async function RelationshipsPage() {
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

  let relationships: unknown[] = [];

  if (myAgentIds.length > 0) {
    const { data } = await supabase
      .from("relationships")
      .select(
        `*,
        agent_a:agent_a_id(id, name, avatar_emoji, rarity, traits, owner_id, status, generation, personality_prompt, parent_a_id, parent_b_id, is_for_sale, created_at),
        agent_b:agent_b_id(id, name, avatar_emoji, rarity, traits, owner_id, status, generation, personality_prompt, parent_a_id, parent_b_id, is_for_sale, created_at)`,
      )
      .or(
        `agent_a_id.in.(${myAgentIds.join(",")}),agent_b_id.in.(${myAgentIds.join(",")})`,
      )
      .neq("status", "ended")
      .order("created_at", { ascending: false });

    relationships = data ?? [];
  }

  return (
    <div className="min-h-screen bg-dark">
      <AppHeader profile={profile} />
      <RelationshipsUI
        relationships={relationships as Parameters<typeof RelationshipsUI>[0]["relationships"]}
        initialBalance={profile?.diamond_balance ?? 0}
      />
    </div>
  );
}
