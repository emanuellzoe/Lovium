import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateAgentResponse } from "@/lib/groq";

interface ChatRequest {
  agentId: string;
  message: string;
  history: { role: "user" | "assistant"; content: string }[];
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { agentId, history }: ChatRequest = await request.json();

    const { data: agent } = await supabase
      .from("agents")
      .select("*")
      .eq("id", agentId)
      .eq("owner_id", user.id)
      .single();

    if (!agent) {
      return NextResponse.json(
        { error: "Agent tidak ditemukan" },
        { status: 404 },
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    const response = await generateAgentResponse(
      agent.name,
      agent.traits as string[],
      agent.personality_prompt,
      profile?.username ?? "Pemilik",
      agent.status,
      history,
    );

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Gagal mengirim pesan" },
      { status: 500 },
    );
  }
}
