import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import DateUI from "./DateUI";

export default async function DatePage({
  params,
}: {
  params: Promise<{ relationshipId: string }>;
}) {
  const { relationshipId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: rel } = await supabase
    .from("relationships")
    .select("*, agent_a:agent_a_id(*), agent_b:agent_b_id(*)")
    .eq("id", relationshipId)
    .single();

  if (!rel) notFound();

  const agentA = rel.agent_a as Record<string, unknown>;
  const agentB = rel.agent_b as Record<string, unknown>;

  const userOwnsA = agentA.owner_id === user.id;
  const userOwnsB = agentB.owner_id === user.id;
  if (!userOwnsA && !userOwnsB) redirect("/relationships");

  const { data: profile } = await supabase
    .from("profiles")
    .select("diamond_balance")
    .eq("id", user.id)
    .single();

  return (
    <DateUI
      relationship={rel as Parameters<typeof DateUI>[0]["relationship"]}
      userId={user.id}
      initialDiamonds={profile?.diamond_balance ?? 0}
    />
  );
}
