import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Animal table schema
export const animals = pgTable("animals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  scientificName: text("scientific_name").notNull(),
  description: text("description").notNull(),
  culturalSignificance: text("cultural_significance").notNull(),
  conservationStatus: text("conservation_status").notNull(),
  region: text("region").notNull(),
  habitat: text("habitat").notNull(),
  imageUrl: text("image_url").notNull(),
  modelUrl: text("model_url"),
  hasArModel: boolean("has_ar_model").default(false),
});

// Challenge table schema
export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(),
  type: text("type").notNull(),
  imageUrl: text("image_url").notNull(),
  questions: jsonb("questions").notNull(),
});

// Conservation Resources table schema
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  url: text("url").notNull(),
  icon: text("icon").notNull(),
});

// Chat conversation history
export const chatHistory = pgTable("chat_history", {
  id: serial("id").primaryKey(),
  userMessage: text("user_message").notNull(),
  botResponse: text("bot_response").notNull(),
  timestamp: text("timestamp").notNull(),
});

// Create insert schemas
export const insertAnimalSchema = createInsertSchema(animals).omit({ id: true });
export const insertChallengeSchema = createInsertSchema(challenges).omit({ id: true });
export const insertResourceSchema = createInsertSchema(resources).omit({ id: true });
export const insertChatHistorySchema = createInsertSchema(chatHistory).omit({ id: true });

// Define types
export type InsertAnimal = z.infer<typeof insertAnimalSchema>;
export type Animal = typeof animals.$inferSelect;

export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type Challenge = typeof challenges.$inferSelect;

export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;

export type InsertChatHistory = z.infer<typeof insertChatHistorySchema>;
export type ChatHistory = typeof chatHistory.$inferSelect;
