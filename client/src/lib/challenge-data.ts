import { Challenge } from "@shared/schema";

// These are just fallback data in case the API requests fail
export const DEFAULT_CHALLENGES: Challenge[] = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
