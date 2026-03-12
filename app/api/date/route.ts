import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const CHOICES: Record<string, { label: string; instruction: string }> = {
  joke:      { label: "😄 Buat Lelucon",       instruction: "membuat lelucon atau cerita lucu" },
  feelings:  { label: "💝 Ungkapkan Perasaan", instruction: "mengungkapkan perasaan suka secara tulus" },
  story:     { label: "✨ Cerita Seru",         instruction: "menceritakan pengalaman atau hal menarik tentang dirinya" },
  question:  { label: "❓ Tanya Personal",      instruction: "menanyakan hal personal yang menunjukkan ketertarikan" },
  compliment:{ label: "🌹 Puji",                instruction: "memuji keunikan atau kelebihan agent B dengan tulus" },
  tease:     { label: "😏 Goda Sedikit",        instruction: "menggoda dengan cara yang playful dan flirty" },
};

const LEVEL_ORDER = ["acquaintance", "friends", "crush", "dating", "committed"];
const LEVEL_THRESHOLD: Record<string, number> = {
  acquaintance: 25,
  friends: 50,
  crush: 75,
  dating: 100,
};

function getNextLevel(progress: number, currentLevel: string): string {
  const threshold = LEVEL_THRESHOLD[currentLevel];
  if (threshold !== undefined && progress >= threshold) {
    const idx = LEVEL_ORDER.indexOf(currentLevel);
    if (idx < LEVEL_ORDER.length - 1) return LEVEL_ORDER[idx + 1];
  }
  return currentLevel;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { relationshipId, choiceKey } = await request.json();

    const choice = CHOICES[choiceKey];
    if (!choice) return NextResponse.json({ error: "Pilihan tidak valid" }, { status: 400 });

    // Ambil relationship + kedua agent
    const { data: rel } = await supabase
      .from("relationships")
      .select("*, agent_a:agent_a_id(*), agent_b:agent_b_id(*)")
      .eq("id", relationshipId)
      .single();

    if (!rel) return NextResponse.json({ error: "Hubungan tidak ditemukan" }, { status: 404 });

    const agentA = rel.agent_a as Record<string, unknown>;
    const agentB = rel.agent_b as Record<string, unknown>;

    // Pastikan user memiliki salah satu agent
    if (agentA.owner_id !== user.id && agentB.owner_id !== user.id) {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
    }

    // Tentukan siapa yang "berbicara" — agent milik user
    const speakerIsA = agentA.owner_id === user.id;
    const speaker = speakerIsA ? agentA : agentB;
    const listener = speakerIsA ? agentB : agentA;

    // 1 Groq call — generate dialog + reaksi + affinity
    const prompt = `Kamu adalah engine simulasi kencan (dating sim). Generate 1 adegan percakapan.

Konteks:
- Agent yang berbicara: ${speaker.name}, traits: ${(speaker.traits as string[]).join(", ")}
- Agent yang merespons: ${listener.name}, traits: ${(listener.traits as string[]).join(", ")}, kepribadian: ${String(listener.personality_prompt).slice(0, 200)}
- Status hubungan saat ini: ${rel.level} (progress: ${rel.progress}/100)
- Aksi yang dipilih user: Agent ${speaker.name} ${choice.instruction}

Aturan:
- dialogA: apa yang dikatakan ${speaker.name} (1-2 kalimat, sesuai karakternya, dalam Bahasa Indonesia)
- dialogB: bagaimana ${listener.name} bereaksi (1-2 kalimat, reaksi JUJUR sesuai kepribadiannya — bisa positif, netral, atau negatif)
- emotion: emosi ${listener.name} setelah adegan: "delighted" | "happy" | "neutral" | "annoyed" | "upset"
- affinity_delta: perubahan ketertarikan (-10 hingga +15), sesuaikan dengan kesesuaian kepribadian kedua agent dan aksi yang dilakukan
- hint: 1 kalimat singkat alasan kenapa reaksinya begitu (Bahasa Indonesia)

Kembalikan HANYA JSON valid tanpa markdown:
{"dialogA":"...","dialogB":"...","emotion":"...","affinity_delta":0,"hint":"..."}`;

    const groqRes = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 350,
      temperature: 0.85,
    });

    const raw = groqRes.choices[0].message.content ?? "{}";
    const cleaned = raw.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const generated = JSON.parse(cleaned);

    const affinityDelta = Math.max(-10, Math.min(15, Number(generated.affinity_delta) || 0));
    const newProgress = Math.max(0, Math.min(100, rel.progress + affinityDelta));
    const newLevel = getNextLevel(newProgress, rel.level);

    // Update relationship progress
    await supabase
      .from("relationships")
      .update({ progress: newProgress, level: newLevel })
      .eq("id", relationshipId);

    return NextResponse.json({
      dialogA: generated.dialogA ?? "",
      dialogB: generated.dialogB ?? "",
      emotion: generated.emotion ?? "neutral",
      affinityDelta,
      hint: generated.hint ?? "",
      newProgress,
      newLevel,
      speakerName: speaker.name,
      listenerName: listener.name,
      speakerEmoji: speaker.avatar_emoji,
      listenerEmoji: listener.avatar_emoji,
    });
  } catch (error) {
    console.error("Date API error:", error);
    return NextResponse.json({ error: "Gagal memproses adegan" }, { status: 500 });
  }
}
