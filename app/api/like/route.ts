import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { fromAgentId, toAgentId } = await request.json();

    // Verify fromAgent belongs to user
    const { data: myAgent } = await supabase
      .from("agents")
      .select("id, owner_id")
      .eq("id", fromAgentId)
      .eq("owner_id", user.id)
      .single();

    if (!myAgent) {
      return NextResponse.json({ error: "Agent tidak valid" }, { status: 403 });
    }

    // Check target agent
    const { data: toAgent } = await supabase
      .from("agents")
      .select("id, owner_id")
      .eq("id", toAgentId)
      .single();

    if (!toAgent) {
      return NextResponse.json({ error: "Target agent tidak ditemukan" }, { status: 404 });
    }

    const sameOwner = toAgent.owner_id === user.id;

    if (sameOwner) {
      // Same owner: directly create relationship (no mutual like needed)
      const { error: relError } = await supabase.from("relationships").insert({
        agent_a_id: fromAgentId,
        agent_b_id: toAgentId,
        level: "acquaintance",
        progress: 10,
        status: "active",
      });

      if (relError && relError.code !== "23505") throw relError;

      // Update both agents to dating
      await supabase
        .from("agents")
        .update({ status: "dating" })
        .in("id", [fromAgentId, toAgentId]);

      return NextResponse.json({ matched: true });
    }

    // Different owner: normal like flow (DB trigger handles mutual match)
    const { data: reverselike } = await supabase
      .from("likes")
      .select("id")
      .eq("from_agent_id", toAgentId)
      .eq("to_agent_id", fromAgentId)
      .maybeSingle();

    const willMatch = !!reverselike;

    const { error } = await supabase
      .from("likes")
      .insert({ from_agent_id: fromAgentId, to_agent_id: toAgentId });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ matched: false, alreadyLiked: true });
      }
      throw error;
    }

    return NextResponse.json({ matched: willMatch });
  } catch (error) {
    console.error("Like error:", error);
    return NextResponse.json({ error: "Gagal like agent" }, { status: 500 });
  }
}
