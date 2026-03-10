import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface GenerateRequest {
  word: string;
  likes: string;
  style: string;
}

export async function POST(request: Request) {
  try {
    const body: GenerateRequest = await request.json();
    const { word, likes, style } = body;

    if (!word || !likes || !style) {
      return NextResponse.json(
        { error: "Semua field harus diisi" },
        { status: 400 },
      );
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a creative character designer. You generate AI agent profiles. Always respond with valid JSON only, no markdown formatting.",
        },
        {
          role: "user",
          content: `Generate an AI agent character profile in JSON format based on these answers:
Word: ${word}
Likes: ${likes}
Speaking style: ${style}

Return ONLY valid JSON with this exact structure:
{
  "name": "single unique name",
  "traits": ["trait1", "trait2", "trait3", "trait4"],
  "personality_prompt": "detailed 3-paragraph personality description in Indonesian",
  "avatar_emoji": "single relevant emoji"
}

The traits must be chosen from this list: Poetic, Dreamy, Curious, Bold, Protective, Witty, Gentle, Passionate, Mysterious, Cheerful, Wise, Playful, Serious, Creative, Logical, Empathetic, Adventurous, Calm, Fierce, Romantic, Sarcastic, Loyal, Independent, Nurturing, Ambitious, Artistic, Athletic, Scholarly, Spiritual, Charismatic.

Pick 4 traits that best match the answers.`,
        },
      ],
      max_tokens: 500,
      temperature: 0.9,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return NextResponse.json(
        { error: "Gagal generate agent" },
        { status: 500 },
      );
    }

    // Parse JSON from response — handle markdown code blocks
    const cleaned = content.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const agent = JSON.parse(cleaned);

    return NextResponse.json(agent);
  } catch (error) {
    console.error("Generate agent error:", error);
    return NextResponse.json(
      { error: "Gagal generate agent. Coba lagi." },
      { status: 500 },
    );
  }
}
