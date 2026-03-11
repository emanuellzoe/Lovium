import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import SpawnUI from "./SpawnUI";
import { Agent } from "@/types/agent";

export default async function SpawnPage({
  params,
}: {
  params: Promise<{ relationshipId: string }>;
}) {
  const { relationshipId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { data: rel }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("relationships")
      .select(
        "*, agent_a:agent_a_id(*), agent_b:agent_b_id(*)",
      )
      .eq("id", relationshipId)
      .single(),
  ]);

  if (!rel || rel.status !== "married") redirect("/couple");

  const agentA = rel.agent_a as Agent;
  const agentB = rel.agent_b as Agent;

  // Verify user owns one of the agents
  if (agentA.owner_id !== user.id && agentB.owner_id !== user.id) {
    redirect("/couple");
  }

  return (
    <div className="min-h-screen bg-dark">
      <AppHeader profile={profile} />
      <SpawnUI
        relationshipId={relationshipId}
        agentA={agentA}
        agentB={agentB}
        spawnCount={rel.spawn_count ?? 0}
        lastSpawnAt={rel.last_spawn_at ?? null}
      />
    </div>
  );
}
