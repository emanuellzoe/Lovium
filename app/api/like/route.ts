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
      .select("id")
      .eq("id", fromAgentId)
      .eq("owner_id", user.id)
      .single();

    if (!myAgent) {
      return NextResponse.json({ error: "Agent tidak valid" }, { status: 403 });
    }

    // Check reverse like before insert (will it be a match?)
    const { data: reverselike } = await supabase
      .from("likes")
      .select("id")
      .eq("from_agent_id", toAgentId)
      .eq("to_agent_id", fromAgentId)
      .maybeSingle();

    const willMatch = !!reverselike;

    // Insert like (DB trigger handles mutual match → relationship creation)
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
