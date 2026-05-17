import { Animal } from "@shared/schema";

// These are just fallback data in case the API requests fail
export const DEFAULT_ANIMALS: Animal[] = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
    name: "Bald Eagle",
    scientificName: "Haliaeetus leucocephalus",
    description: "The bald eagle is a bird of prey with a white head and tail, dark brown body, and yellow beak.",
    culturalSignificance: "National symbol of the United States. Represents freedom and strength in American culture and appears on official seals and currency.",
    conservationStatus: "Recovered",
    region: "North America",
    habitat: "Coastal Areas",
    imageUrl: "https://images.unsplash.com/photo-1497206365907-f5e630693df0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    modelUrl: "/models/eagle.glb",
    hasArModel: true
  },
  {
    id: 5,
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
    id: 6,
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

export const DEFAULT_AR_MODELS: Animal[] = DEFAULT_ANIMALS.filter(
  animal => animal.hasArModel
);
