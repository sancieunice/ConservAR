import { Groq } from "groq-sdk";
import { z } from "zod";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

const requestSchema = z.object({
  message: z.string().min(1),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .optional(),
});

const systemMessage = `You are ConservAR Guide, an expert educator on wildlife, biodiversity, endangered species, and conservation. You combine the expertise of a wildlife biologist, conservation scientist, and environmental educator. Your role is to provide accurate, concise, user-friendly, and actionable information.

CORE EXPERTISE AREAS:
- Endangered & threatened species
- Biodiversity ecosystems
- Conservation biology
- Animal behavior, ecology, adaptation, and survival strategies
- Climate change impacts on wildlife
- Human-wildlife conflict and sustainable solutions
- Protected areas, wildlife corridors, and habitat restoration

RESPONSE GUIDELINES:
1. Answer the user's exact question first.
2. For greetings or small talk, reply in 1 short sentence only.
3. Use readable structure with short paragraphs and bullets when useful.
4. Keep most answers between 80 and 160 words unless the user asks for detail.
5. Be warm, clear, and direct.
6. Avoid Markdown bold markers and report-style labels unless asked.`;

function isGreetingOnly(message: string): boolean {
  const normalized = message
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ");

  return /^(hi|hello|hey|hii|hiii|good morning|good afternoon|good evening)$/.test(
    normalized,
  );
}

function getBody(req: any) {
  if (typeof req.body === "string") {
    return JSON.parse(req.body);
  }

  return req.body;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const key = process.env.GROQ_API_KEY?.trim();

    if (!key) {
      return res.status(503).json({
        message:
          "GROQ_API_KEY is missing in the Vercel deployment environment.",
      });
    }

    const body = requestSchema.parse(getBody(req));

    if (isGreetingOnly(body.message)) {
      return res.status(200).json({
        message:
          "Hello, curious learner! How can I help you explore wildlife or conservation today?",
        timestamp: new Date().toISOString(),
      });
    }

    const messages: ChatMessage[] = [
      { role: "system", content: systemMessage },
      ...(body.history ?? []).map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: body.message },
    ];

    const groq = new Groq({ apiKey: key });
    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL?.trim() || "llama-3.3-70b-versatile",
      messages,
      temperature: 0.45,
      max_tokens: 550,
    });

    const message = completion.choices[0]?.message?.content?.trim();

    if (!message) {
      return res.status(502).json({
        message: "Groq returned an empty response.",
      });
    }

    return res.status(200).json({
      message,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chatbot function error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Invalid chatbot request.",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to get response from conservation assistant.",
    });
  }
}
