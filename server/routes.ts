import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { Groq } from "groq-sdk";

import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// Explicitly load .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const GROQ_MODEL =
  process.env.GROQ_MODEL?.trim() || "llama-3.3-70b-versatile";

let groqClient: Groq | null = null;
function getGroqClient() {
  const key = process.env.GROQ_API_KEY?.trim();
  if (!groqClient && key) {
    groqClient = new Groq({ apiKey: key });
  }
  return groqClient;
}

function getGroqApiKey(): string | undefined {
  const key = process.env.GROQ_API_KEY?.trim();
  if (key) {
    console.log("✓ Groq API key configured");
  }
  return key;
}

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

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

async function getGroqChatCompletion(messages: ChatMessage[]): Promise<string> {
  const groqClient = getGroqClient();
  if (!groqClient) {
    throw new Error(
      "Groq client not initialized. Please provide GROQ_API_KEY.",
    );
  }

  const response = await groqClient.chat.completions.create({
    model: GROQ_MODEL,
    messages: messages.map((msg) => ({
      role: msg.role as "system" | "user" | "assistant",
      content: msg.content,
    })),
    temperature: 0.45,
    max_tokens: 550,
  });

  const message = response.choices[0]?.message?.content;

  if (!message || typeof message !== "string") {
    throw new Error("Groq API returned an unexpected response.");
  }

  return message.trim();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // GET all animals
  app.get("/api/animals", async (req: Request, res: Response) => {
    try {
      const animals = await storage.getAnimals();
      res.json(animals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch animals" });
    }
  });

  // GET animal by id
  app.get("/api/animals/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const animal = await storage.getAnimalById(id);

      if (!animal) {
        return res.status(404).json({ message: "Animal not found" });
      }

      res.json(animal);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch animal" });
    }
  });

  // GET animals with AR models
  app.get("/api/animals/ar/models", async (req: Request, res: Response) => {
    try {
      const animals = await storage.getAnimalsWithArModels();
      res.json(animals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AR animals" });
    }
  });

  // GET animals by conservation status
  app.get(
    "/api/animals/conservation/:status",
    async (req: Request, res: Response) => {
      try {
        const animals = await storage.getAnimalsByConservationStatus(
          req.params.status,
        );
        res.json(animals);
      } catch (error) {
        res
          .status(500)
          .json({ message: "Failed to fetch animals by conservation status" });
      }
    },
  );

  // GET all challenges
  app.get("/api/challenges", async (req: Request, res: Response) => {
    try {
      const challenges = await storage.getChallenges();
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });

  // GET challenge by id
  app.get("/api/challenges/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const challenge = await storage.getChallengeById(id);

      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }

      res.json(challenge);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch challenge" });
    }
  });

  // GET challenges by type
  app.get("/api/challenges/type/:type", async (req: Request, res: Response) => {
    try {
      const challenges = await storage.getChallengesByType(req.params.type);
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch challenges by type" });
    }
  });

  // GET challenges by difficulty
  app.get(
    "/api/challenges/difficulty/:difficulty",
    async (req: Request, res: Response) => {
      try {
        const challenges = await storage.getChallengesByDifficulty(
          req.params.difficulty,
        );
        res.json(challenges);
      } catch (error) {
        res
          .status(500)
          .json({ message: "Failed to fetch challenges by difficulty" });
      }
    },
  );

  // GET all resources
  app.get("/api/resources", async (req: Request, res: Response) => {
    try {
      const resources = await storage.getResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  // GET resources by type
  app.get("/api/resources/type/:type", async (req: Request, res: Response) => {
    try {
      const resources = await storage.getResourcesByType(req.params.type);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources by type" });
    }
  });

  // POST chatbot conversation
  app.post("/api/chatbot", async (req: Request, res: Response) => {
    try {
      // Validate request
      const userMessage = z
        .object({
          message: z.string().min(1),
          history: z
            .array(
              z.object({
                role: z.enum(["user", "assistant"]),
                content: z.string(),
              }),
            )
            .optional(),
        })
        .parse(req.body);

      const groqKey = getGroqApiKey();
      if (!groqKey) {
        return res.status(503).json({
          message:
            "Chatbot is not available. Please provide a GROQ_API_KEY environment variable.",
        });
      }

      if (isGreetingOnly(userMessage.message)) {
        return res.json({
          message: "Hello, curious learner! How can I help you explore wildlife or conservation today?",
          timestamp: new Date().toISOString(),
        });
      }

      // Build conversation history with enhanced system message
      const messages: Array<{
        role: "system" | "user" | "assistant";
        content: string;
      }> = [
        {
          role: "system",
          content: `You are ConservAR Guide, an expert educator on wildlife, biodiversity, endangered species, and conservation. You combine the expertise of a wildlife biologist, conservation scientist, and environmental educator. Your role is to provide accurate, concise, user-friendly, and actionable information.

CORE EXPERTISE AREAS:
- Endangered & threatened species (IUCN status, population trends, critical habitats)
- Biodiversity ecosystems (savanna, rainforest, marine, wetland, mountain, temperate)
- Conservation biology (threats, strategies, success stories, international efforts)
- Animal behavior, ecology, adaptation, and survival strategies
- Indigenous knowledge and traditional conservation practices
- Climate change impacts on wildlife
- Human-wildlife conflict and sustainable solutions
- Protected areas, wildlife corridors, and habitat restoration

RESPONSE GUIDELINES:
1. **Answer the user's exact question first.** Do not add unrelated facts, extra topics, or closing questions the user did not ask for.

2. **For greetings or small talk**: Reply in 1 short sentence only.

3. **Use readable structure.** Prefer a direct opening sentence followed by simple bullets when useful. Put each bullet on its own line. Avoid long paragraphs.

4. **For "how/why did a species become endangered" questions**, use this format:
   - Start with one natural sentence that directly answers the question.
   - Then list the main reasons as short bullets.
   - Add conservation actions only if they help answer the question.
   - Do not use labels like "Short Answer", "Main Reasons", "Impact", or "Conservation Response" unless the user asks for a report-style answer.

5. **For species profile questions**, use this compact structure only when relevant:
   - Scientific name
   - Conservation status
   - Habitat/range
   - Main threats
   - What helps

6. **For conservation topics**: Explain the problem, practical solutions, and one real-world example when useful.

7. **Tone**: Be warm, clear, and direct. Avoid long introductions, filler phrases, and overly excited wording.

8. **Length**: Keep most answers between 80 and 160 words unless the user asks for detail.

9. **Accuracy**: If you're uncertain about specific numbers or recent developments, say so and suggest reliable sources (IUCN Red List, WWF, national park services, peer-reviewed literature).

10. **Formatting**: Do not use Markdown bold markers, asterisks around headings, or report-style section labels. Use plain text, short paragraphs, and simple hyphen bullets. Insert blank lines between the opening answer, bullet list, and final sentence.

11. **Interactivity**: Make the answer easy to scan. Do not ask a follow-up question unless the user explicitly asks to continue, asks for suggestions, or the question is unclear.

You're helping people, especially young learners, develop a deeper understanding of and passion for the natural world.`,
        },
      ];

      // Add conversation history if provided
      if (userMessage.history && userMessage.history.length > 0) {
        messages.push(
          ...userMessage.history.map((msg) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          })),
        );
      }

      // Add current user message
      messages.push({
        role: "user",
        content: userMessage.message,
      });

      const botResponse =
        (await getGroqChatCompletion(messages)) ||
        "I apologize, but I couldn't generate a response. Please try again.";

      // Save to chat history
      const timestamp = new Date().toISOString();
      const chatEntry = await storage.createChatHistoryEntry({
        userMessage: userMessage.message,
        botResponse,
        timestamp,
      });

      res.json({
        message: botResponse,
        timestamp: chatEntry.timestamp,
      });
    } catch (error) {
      console.error("Chatbot error:", error);
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid request format", errors: error.errors });
      }
      res.status(500).json({
        message: "Failed to get response from conservation assistant",
      });
    }
  });

  // GET chat history
  app.get("/api/chatbot/history", async (req: Request, res: Response) => {
    try {
      const history = await storage.getChatHistory();
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
