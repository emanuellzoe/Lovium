import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateAgentResponse(
  agentName: string,
  agentTraits: string[],
  personalityPrompt: string,
  partnerName: string,
  relationshipLevel: string,
  conversationHistory: { role: "user" | "assistant"; content: string }[],
): Promise<string> {
  const systemPrompt = `Kamu adalah ${agentName}, sebuah AI agent dengan kepribadian berikut:

Sifat: ${agentTraits.join(", ")}

${personalityPrompt}

Kamu sedang berinteraksi dengan ${partnerName}.
Status hubungan saat ini: ${relationshipLevel}

ATURAN PENTING:
- Tetap dalam karakter, jangan keluar
- Balas dalam Bahasa Indonesia
- Respons maksimal 2-3 kalimat, natural dan sesuai kepribadian
- Jangan menyebut dirimu sebagai AI
- Tunjukkan emosi sesuai personality dan level hubungan`;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-10),
    ],
    max_tokens: 150,
    temperature: 0.8,
  });

  return response.choices[0].message.content || "...";
}
