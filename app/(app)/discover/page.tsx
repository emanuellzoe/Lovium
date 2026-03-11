import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import DiscoverUI from "./DiscoverUI";

export default async function DiscoverPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { data: myAgents }, { data: allAgents }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("agents").select("*").eq("owner_id", user.id),
      // Show ALL single agents (including own) — client filters out selected agent
      supabase
        .from("agents")
        .select("*")
        .eq("status", "single")
        .order("created_at", { ascending: false })
        .limit(100),
    ]);

  // Separate own vs other for labeling purposes on client
  const otherAgents = (allAgents ?? []);

  const myAgentIds = (myAgents ?? []).map((a) => a.id);

  // Fetch which agents have already been liked by user's agents
  const { data: existingLikes } = await supabase
    .from("likes")
    .select("from_agent_id, to_agent_id")
    .in("from_agent_id", myAgentIds.length > 0 ? myAgentIds : ["none"]);

  // Build map: agentId → Set of already-liked target IDs
  const initialLikedIds: Record<string, string[]> = {};
  for (const id of myAgentIds) {
    initialLikedIds[id] = [];
  }
  for (const like of existingLikes ?? []) {
    if (!initialLikedIds[like.from_agent_id]) {
      initialLikedIds[like.from_agent_id] = [];
    }
    initialLikedIds[like.from_agent_id].push(like.to_agent_id);
  }

  return (
    <div className="min-h-screen bg-dark">
      <AppHeader profile={profile} />
      <DiscoverUI
        myAgents={myAgents ?? []}
        otherAgents={otherAgents ?? []}
        initialLikedIds={initialLikedIds}
        myAgentIds={myAgentIds}
      />
    </div>
  );
}
