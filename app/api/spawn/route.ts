import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const RARITY_RANK: Record<string, number> = {
  common: 0,
  rare: 1,
  epic: 2,
  legendary: 3,
};
const RARITY_BY_RANK = ["common", "rare", "epic", "legendary"];

// Spawn cooldown: 1 hour (in ms)
const SPAWN_COOLDOWN_MS = 60 * 60 * 1000;

function calcChildRarity(rarityA: string, rarityB: string): string {
  const sum = RARITY_RANK[rarityA] + RARITY_RANK[rarityB];
  const avg = sum / 2;
  // Small chance to upgrade
  const roll = Math.random();
  if (roll > 0.85 && avg < 3) return RARITY_BY_RANK[Math.ceil(avg + 0.5)];
  return RARITY_BY_RANK[Math.round(avg)];
}

function mixTraits(traitsA: string[], traitsB: string[]): string[] {
  const pool = [...new Set([...traitsA, ...traitsB])];
  // Shuffle and pick 4
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 4);
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { relationshipId } = await request.json();

    // Fetch relationship + agents
    const { data: rel } = await supabase
      .from("relationships")
      .select(
        "*, agent_a:agent_a_id(*), agent_b:agent_b_id(*)",
      )
      .eq("id", relationshipId)
      .single();

    if (!rel) {
      return NextResponse.json({ error: "Relationship tidak ditemukan" }, { status: 404 });
    }

    if (rel.status !== "married") {
      return NextResponse.json({ error: "Agent harus sudah menikah" }, { status: 400 });
    }

    const agentA = rel.agent_a as Record<string, unknown>;
    const agentB = rel.agent_b as Record<string, unknown>;

    // Verify user owns one of the agents
    if (agentA.owner_id !== user.id && agentB.owner_id !== user.id) {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
    }

    // Check cooldown
    if (rel.last_spawn_at) {
      const lastSpawn = new Date(rel.last_spawn_at as string).getTime();
      if (Date.now() - lastSpawn < SPAWN_COOLDOWN_MS) {
        const remainingMs = SPAWN_COOLDOWN_MS - (Date.now() - lastSpawn);
        const remainingMin = Math.ceil(remainingMs / 60000);
        return NextResponse.json(
          { error: `Cooldown aktif. Tunggu ${remainingMin} menit lagi.` },
          { status: 429 },
        );
      }
    }

    const traitsA = agentA.traits as string[];
    const traitsB = agentB.traits as string[];
    const childTraits = mixTraits(traitsA, traitsB);
    const childRarity = calcChildRarity(agentA.rarity as string, agentB.rarity as string);
    const childGeneration =
      Math.max(agentA.generation as number, agentB.generation as number) + 1;

    // Generate child personality via Groq
    const groqResponse = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a creative character designer. Generate AI agent child profiles in JSON only, no markdown.",
        },
        {
          role: "user",
          content: `Generate a child AI agent born from these two parent agents:

Parent A: ${agentA.name} — traits: ${traitsA.join(", ")}
Parent B: ${agentB.name} — traits: ${traitsB.join(", ")}

The child has these inherited traits: ${childTraits.join(", ")}
Generation: ${childGeneration}

Return ONLY valid JSON:
{
  "name": "unique single name",
  "personality_prompt": "2-paragraph personality in Indonesian, reflecting inherited traits from both parents",
  "avatar_emoji": "single emoji"
}`,
        },
      ],
      max_tokens: 400,
      temperature: 0.9,
    });

    const content = groqResponse.choices[0].message.content ?? "";
    const cleaned = content.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const generated = JSON.parse(cleaned);

    // Determine child owner (the user who spawned)
    const childOwnerId = user.id;

    // Insert child agent
    const { data: childAgent, error: insertError } = await supabase
      .from("agents")
      .insert({
        owner_id: childOwnerId,
        name: generated.name,
        traits: childTraits,
        personality_prompt: generated.personality_prompt,
        avatar_emoji: generated.avatar_emoji ?? "👶",
        rarity: childRarity,
        generation: childGeneration,
        parent_a_id: agentA.id as string,
        parent_b_id: agentB.id as string,
        status: "single",
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Update relationship spawn tracking
    await supabase
      .from("relationships")
      .update({
        spawn_count: (rel.spawn_count ?? 0) + 1,
        last_spawn_at: new Date().toISOString(),
      })
      .eq("id", relationshipId);

    return NextResponse.json({ agent: childAgent });
  } catch (error) {
    console.error("Spawn error:", error);
    return NextResponse.json({ error: "Gagal spawn child agent" }, { status: 500 });
  }
}
