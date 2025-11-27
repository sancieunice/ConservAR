import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChatHistorySchema } from "@shared/schema";
import { z } from "zod";

// Gemini configuration for the chatbot
// Note: @google/genai is not available, so Gemini will be disabled unless a different API is used
let genAI: any = undefined;
// Uncomment and install appropriate Google AI package when needed
// import { GoogleGenAI } from "@google/genai";
// if (process.env.GEMINI_API_KEY) {
//   genAI = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
// }

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const apiRouter = app.route('/api');

  // GET all animals
  app.get('/api/animals', async (req: Request, res: Response) => {
    try {
      const animals = await storage.getAnimals();
      res.json(animals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch animals" });
    }
  });

  // GET animal by id
  app.get('/api/animals/:id', async (req: Request, res: Response) => {
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
  app.get('/api/animals/ar/models', async (req: Request, res: Response) => {
    try {
      const animals = await storage.getAnimalsWithArModels();
      res.json(animals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AR animals" });
    }
  });

  // GET animals by conservation status
  app.get('/api/animals/conservation/:status', async (req: Request, res: Response) => {
    try {
      const animals = await storage.getAnimalsByConservationStatus(req.params.status);
      res.json(animals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch animals by conservation status" });
    }
  });

  // GET all challenges
  app.get('/api/challenges', async (req: Request, res: Response) => {
    try {
      const challenges = await storage.getChallenges();
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });

  // GET challenge by id
  app.get('/api/challenges/:id', async (req: Request, res: Response) => {
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
  app.get('/api/challenges/type/:type', async (req: Request, res: Response) => {
    try {
      const challenges = await storage.getChallengesByType(req.params.type);
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch challenges by type" });
    }
  });

  // GET challenges by difficulty
  app.get('/api/challenges/difficulty/:difficulty', async (req: Request, res: Response) => {
    try {
      const challenges = await storage.getChallengesByDifficulty(req.params.difficulty);
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch challenges by difficulty" });
    }
  });

  // GET all resources
  app.get('/api/resources', async (req: Request, res: Response) => {
    try {
      const resources = await storage.getResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  // GET resources by type
  app.get('/api/resources/type/:type', async (req: Request, res: Response) => {
    try {
      const resources = await storage.getResourcesByType(req.params.type);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources by type" });
    }
  });

  // POST chatbot conversation
  if (genAI) {
    app.post('/api/chatbot', async (req: Request, res: Response) => {
      try {
        // Validate request
        const userMessage = z.object({
          message: z.string().min(1),
        }).parse(req.body);

        // Get response from Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const chat = model.startChat({
          history: [
            {
              role: "user",
              parts: [{ text: "You are a helpful wildlife conservation assistant. You provide accurate information about conservation efforts, endangered species, and cultural significance of animals. Keep responses informative, engaging, and focused on wildlife conservation. Include practical conservation tips when relevant. If you're not sure about something, acknowledge it and suggest reliable sources for more information." }]
            },
            {
              role: "model",
              parts: [{ text: "Understood. I will act as a helpful wildlife conservation assistant." }]
            }
          ],
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7,
          }
        });
        const result = await chat.sendMessage(userMessage.message);
        const response = await result.response;
        const botResponse = response.text();

        // Save to chat history
        const timestamp = new Date().toISOString();
        const chatEntry = await storage.createChatHistoryEntry({
          userMessage: userMessage.message,
          botResponse,
          timestamp
        });

        res.json({
          message: botResponse,
          timestamp: chatEntry.timestamp
        });
      } catch (error) {
        console.error("Chatbot error:", error);
        if (error instanceof z.ZodError) {
          return res.status(400).json({ message: "Invalid request format", errors: error.errors });
        }
        res.status(500).json({ message: "Failed to get response from conservation assistant" });
      }
    });
  } else {
    app.post('/api/chatbot', (req, res) => {
      res.status(503).json({ message: "Chatbot is not available. Please provide a GEMINI_API_KEY." });
    });
  }

  // GET chat history
  app.get('/api/chatbot/history', async (req: Request, res: Response) => {
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
