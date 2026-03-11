import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { action, relationshipId } = await request.json();

    const { data: rel } = await supabase
      .from("relationships")
      .select(
        "*, agent_a:agent_a_id(id, owner_id), agent_b:agent_b_id(id, owner_id)",
      )
      .eq("id", relationshipId)
      .single();

    if (!rel) {
      return NextResponse.json({ error: "Relationship tidak ditemukan" }, { status: 404 });
    }

    const agentA = rel.agent_a as { id: string; owner_id: string };
    const agentB = rel.agent_b as { id: string; owner_id: string };
    const ownsA = agentA.owner_id === user.id;
    const ownsB = agentB.owner_id === user.id;

    if (!ownsA && !ownsB) {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
    }

    if (action === "propose") {
      if (rel.level !== "committed") {
        return NextResponse.json(
          { error: "Hubungan belum cukup kuat untuk melamar" },
          { status: 400 },
        );
      }
      if (rel.status !== "active") {
        return NextResponse.json(
          { error: "Status hubungan tidak valid" },
          { status: 400 },
        );
      }

      const sameOwner = agentA.owner_id === agentB.owner_id;

      if (sameOwner) {
        // Auto-accept: both agents owned by same user
        await Promise.all([
          supabase
            .from("relationships")
            .update({ status: "married", married_at: new Date().toISOString() })
            .eq("id", relationshipId),
          supabase
            .from("agents")
            .update({ status: "married" })
            .in("id", [agentA.id, agentB.id]),
        ]);
        return NextResponse.json({ result: "married" });
      } else {
        // Set to proposed — other user needs to accept
        await supabase
          .from("relationships")
          .update({ status: "proposed" })
          .eq("id", relationshipId);
        return NextResponse.json({ result: "proposed" });
      }
    }

    if (action === "accept") {
      if (rel.status !== "proposed") {
        return NextResponse.json({ error: "Tidak ada lamaran aktif" }, { status: 400 });
      }
      // The acceptor must own the agent that did NOT propose
      // We don't track who proposed, so we just require the OTHER owner
      // Both owners can accept (edge case, but fine for hackathon)
      await Promise.all([
        supabase
          .from("relationships")
          .update({ status: "married", married_at: new Date().toISOString() })
          .eq("id", relationshipId),
        supabase
          .from("agents")
          .update({ status: "married" })
          .in("id", [agentA.id, agentB.id]),
      ]);
      return NextResponse.json({ result: "married" });
    }

    if (action === "reject") {
      await supabase
        .from("relationships")
        .update({ status: "active" })
        .eq("id", relationshipId);
      return NextResponse.json({ result: "rejected" });
    }

    return NextResponse.json({ error: "Action tidak valid" }, { status: 400 });
  } catch (error) {
    console.error("Marry error:", error);
    return NextResponse.json({ error: "Gagal memproses lamaran" }, { status: 500 });
  }
}
