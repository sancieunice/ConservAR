import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChatHistorySchema } from "@shared/schema";
import { z } from "zod";

// OpenAI configuration for the chatbot
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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
  app.post('/api/chatbot', async (req: Request, res: Response) => {
    try {
      // Validate request
      const userMessage = z.object({
        message: z.string().min(1),
      }).parse(req.body);

      // Get response from OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a helpful wildlife conservation assistant. You provide accurate information about conservation efforts, endangered species, and cultural significance of animals. Keep responses informative, engaging, and focused on wildlife conservation. Include practical conservation tips when relevant. If you're not sure about something, acknowledge it and suggest reliable sources for more information."
          },
          {
            role: "user",
            content: userMessage.message
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const botResponse = completion.choices[0].message.content || "I'm sorry, I couldn't process that request.";
      
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
