import { 
  animals, type Animal, type InsertAnimal,
  challenges, type Challenge, type InsertChallenge,
  resources, type Resource, type InsertResource,
  chatHistory, type ChatHistory, type InsertChatHistory 
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // Animal operations
  getAnimals(): Promise<Animal[]>;
  getAnimalById(id: number): Promise<Animal | undefined>;
  getAnimalsByConservationStatus(status: string): Promise<Animal[]>;
  getAnimalsWithArModels(): Promise<Animal[]>;
  createAnimal(animal: InsertAnimal): Promise<Animal>;

  // Challenge operations
  getChallenges(): Promise<Challenge[]>;
  getChallengeById(id: number): Promise<Challenge | undefined>;
  getChallengesByType(type: string): Promise<Challenge[]>;
  getChallengesByDifficulty(difficulty: string): Promise<Challenge[]>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;

  // Resource operations
  getResources(): Promise<Resource[]>;
  getResourcesByType(type: string): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;

  // Chat history operations
  getChatHistory(): Promise<ChatHistory[]>;
  createChatHistoryEntry(entry: InsertChatHistory): Promise<ChatHistory>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private animalsData: Map<number, Animal>;
  private challengesData: Map<number, Challenge>;
  private resourcesData: Map<number, Resource>;
  private chatHistoryData: Map<number, ChatHistory>;
  private animalCurrentId: number;
  private challengeCurrentId: number;
  private resourceCurrentId: number;
  private chatHistoryCurrentId: number;

  constructor() {
    this.animalsData = new Map();
    this.challengesData = new Map();
    this.resourcesData = new Map();
    this.chatHistoryData = new Map();
    
    this.animalCurrentId = 1;
    this.challengeCurrentId = 1;
    this.resourceCurrentId = 1;
    this.chatHistoryCurrentId = 1;
    
    // Initialize with some sample data
    this.initializeData();
  }

  private initializeData() {
    // Sample animals
    const sampleAnimals: InsertAnimal[] = [
      {
        name: "Giant Panda",
        scientificName: "Ailuropoda melanoleuca",
        description: "The giant panda is a bear native to China, characterized by its bold black-and-white coat and rotund body.",
        culturalSignificance: "National treasure of China and symbol of peace. Pandas play a significant role in Chinese culture and diplomacy.",
        conservationStatus: "Endangered",
        region: "China",
        habitat: "Bamboo Forests",
        imageUrl: "/images/giant-panda.jpg",
        modelUrl: "/models/panda.glb",
        hasArModel: true
      },
      {
        name: "Bengal Tiger",
        scientificName: "Panthera tigris tigris",
        description: "The Bengal tiger is a tiger subspecies native to the Indian subcontinent, known for its orange coat with dark stripes.",
        culturalSignificance: "National animal of India and Bangladesh. The tiger is deeply embedded in South Asian mythology, folklore and cultural expressions.",
        conservationStatus: "Endangered",
        region: "India",
        habitat: "Tropical Forests",
        imageUrl: "/images/Bengal tiger.png",
        modelUrl: "/models/tiger.glb",
        hasArModel: true
      },
      {
        name: "African Elephant",
        scientificName: "Loxodonta africana",
        description: "The African elephant is the largest land animal, characterized by its large ears, long trunk, and ivory tusks.",
        culturalSignificance: "Symbol of wisdom and strength in many African cultures. Featured in traditional stories, artwork and ceremonies across the continent.",
        conservationStatus: "Vulnerable",
        region: "Africa",
        habitat: "Savannas",
        imageUrl: "/images/African-elephant.png",
        modelUrl: "/models/elephant.glb",
        hasArModel: true
      },
      {
        name: "White Rhinoceros",
        scientificName: "Ceratotherium simum",
        description: "The white rhinoceros is the largest species of rhinoceros, characterized by its wide mouth and two horns.",
        culturalSignificance: "Symbol of strength and protection in African cultures. Rhinos are featured in traditional art and are considered guardians of the land.",
        conservationStatus: "Near Threatened",
        region: "Africa",
        habitat: "Savannas and Grasslands",
        imageUrl: "/images/white-rhino.jpg",
        modelUrl: "/models/white_rhinoceros.glb",
        hasArModel: true
      },
      {
        name: "Red Fox",
        scientificName: "Vulpes vulpes",
        description: "The red fox is a medium-sized canid with rusty-red fur, white underparts, and a bushy tail.",
        culturalSignificance: "Featured in Northern European, Asian and Native American folklore as a clever trickster. Symbolizes intelligence and adaptability.",
        conservationStatus: "Least Concern",
        region: "Northern Hemisphere",
        habitat: "Various Habitats",
        imageUrl: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        modelUrl: null,
        hasArModel: false
      },
      {
        name: "Kangaroo",
        scientificName: "Macropus",
        description: "The kangaroo is a marsupial with powerful hind legs, large feet, and a muscular tail.",
        culturalSignificance: "Australian icon that appears on the national coat of arms. Significant in Aboriginal Dreamtime stories and contemporary Australian identity.",
        conservationStatus: "Least Concern",
        region: "Australia",
        habitat: "Grasslands",
        imageUrl: "/images/Red-Kangaroo.jpg",
        modelUrl: null,
        hasArModel: false
      }
    ];

    // Sample challenges
    const sampleChallenges: InsertChallenge[] = [
      {
        title: "Animal Symbols Challenge",
        description: "Match animals to their cultural significance in different parts of the world",
        difficulty: "Medium",
        type: "Quiz",
        imageUrl: "https://images.unsplash.com/photo-1469598614039-ccfeb0a21111?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        questions: JSON.stringify([
          {
            question: "Which animal is considered sacred in Hindu culture?",
            options: [
              { id: "a", text: "Bengal Tiger" },
              { id: "b", text: "Cow" },
              { id: "c", text: "African Elephant" },
              { id: "d", text: "Bald Eagle" }
            ],
            correctAnswer: "b",
            explanation: "The cow is considered sacred in Hindu culture and is revered as a symbol of life and sustenance."
          },
          {
            question: "Which animal is a symbol of longevity in Chinese culture?",
            options: [
              { id: "a", text: "Panda" },
              { id: "b", text: "Tiger" },
              { id: "c", text: "Turtle" },
              { id: "d", text: "Dragon" }
            ],
            correctAnswer: "c",
            explanation: "The turtle is a symbol of longevity, wisdom, and good fortune in Chinese culture."
          }
        ])
      },
      {
        title: "Conservation Match",
        description: "Match conservation efforts with the correct regions and species they protect",
        difficulty: "Medium",
        type: "Matching",
        imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        questions: JSON.stringify([
          {
            pairs: [
              { id: 1, text: "Project Tiger", match: "India" },
              { id: 2, text: "Great Barrier Reef Marine Park", match: "Australia" },
              { id: 3, text: "Virunga National Park", match: "Democratic Republic of Congo" },
              { id: 4, text: "Yellowstone National Park", match: "United States" }
            ]
          }
        ])
      },
      {
        title: "Cultural Quiz",
        description: "Test your knowledge about how different cultures relate to their local wildlife",
        difficulty: "Easy",
        type: "Quiz",
        imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        questions: JSON.stringify([
          {
            question: "In Japanese culture, what does the red-crowned crane symbolize?",
            options: [
              { id: "a", text: "Wealth" },
              { id: "b", text: "Longevity and good fortune" },
              { id: "c", text: "War and power" },
              { id: "d", text: "Divine punishment" }
            ],
            correctAnswer: "b",
            explanation: "The red-crowned crane symbolizes longevity, good fortune, and fidelity in Japanese culture."
          }
        ])
      },
      {
        title: "Habitat Explorer",
        description: "Identify which habitats support specific species and the communities that protect them",
        difficulty: "Hard",
        type: "Interactive",
        imageUrl: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        questions: JSON.stringify([
          {
            habitat: "Rainforest",
            species: ["Jaguar", "Toucan", "Poison Dart Frog"],
            communities: ["Indigenous Amazon tribes", "Conservation researchers"],
            challenges: ["Deforestation", "Mining", "Climate change"]
          }
        ])
      }
    ];

    // Sample resources
    const sampleResources: InsertResource[] = [
      {
        title: "Support Conservation",
        description: "Learn how you can contribute to global wildlife protection efforts",
        type: "organization",
        url: "https://www.worldwildlife.org/",
        icon: "hands-helping"
      },
      {
        title: "Educational Resources",
        description: "Discover books, documentaries, and online courses about wildlife",
        type: "education",
        url: "https://www.nationalgeographic.com/animals/",
        icon: "book-open"
      },
      {
        title: "Global Initiatives",
        description: "Explore international efforts to protect endangered species",
        type: "initiative",
        url: "https://www.iucn.org/",
        icon: "globe-americas"
      }
    ];

    // Add sample data
    sampleAnimals.forEach(animal => this.createAnimal(animal));
    sampleChallenges.forEach(challenge => this.createChallenge(challenge));
    sampleResources.forEach(resource => this.createResource(resource));
  }

  // Animal methods
  async getAnimals(): Promise<Animal[]> {
    return Array.from(this.animalsData.values());
  }

  async getAnimalById(id: number): Promise<Animal | undefined> {
    return this.animalsData.get(id);
  }

  async getAnimalsByConservationStatus(status: string): Promise<Animal[]> {
    return Array.from(this.animalsData.values()).filter(
      animal => animal.conservationStatus.toLowerCase() === status.toLowerCase()
    );
  }

  async getAnimalsWithArModels(): Promise<Animal[]> {
    return Array.from(this.animalsData.values()).filter(
      animal => animal.hasArModel
    );
  }

  async createAnimal(animal: InsertAnimal): Promise<Animal> {
    const id = this.animalCurrentId++;
    const newAnimal = { ...animal, id };
    this.animalsData.set(id, newAnimal);
    return newAnimal;
  }

  // Challenge methods
  async getChallenges(): Promise<Challenge[]> {
    return Array.from(this.challengesData.values());
  }

  async getChallengeById(id: number): Promise<Challenge | undefined> {
    return this.challengesData.get(id);
  }

  async getChallengesByType(type: string): Promise<Challenge[]> {
    return Array.from(this.challengesData.values()).filter(
      challenge => challenge.type.toLowerCase() === type.toLowerCase()
    );
  }

  async getChallengesByDifficulty(difficulty: string): Promise<Challenge[]> {
    return Array.from(this.challengesData.values()).filter(
      challenge => challenge.difficulty.toLowerCase() === difficulty.toLowerCase()
    );
  }

  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const id = this.challengeCurrentId++;
    const newChallenge = { ...challenge, id };
    this.challengesData.set(id, newChallenge);
    return newChallenge;
  }

  // Resource methods
  async getResources(): Promise<Resource[]> {
    return Array.from(this.resourcesData.values());
  }

  async getResourcesByType(type: string): Promise<Resource[]> {
    return Array.from(this.resourcesData.values()).filter(
      resource => resource.type.toLowerCase() === type.toLowerCase()
    );
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const id = this.resourceCurrentId++;
    const newResource = { ...resource, id };
    this.resourcesData.set(id, newResource);
    return newResource;
  }

  // Chat history methods
  async getChatHistory(): Promise<ChatHistory[]> {
    return Array.from(this.chatHistoryData.values());
  }

  async createChatHistoryEntry(entry: InsertChatHistory): Promise<ChatHistory> {
    const id = this.chatHistoryCurrentId++;
    const newEntry = { ...entry, id };
    this.chatHistoryData.set(id, newEntry);
    return newEntry;
  }
}

export const storage = new MemStorage();
