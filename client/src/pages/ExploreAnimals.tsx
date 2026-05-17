import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

const animals = [
  {
    name: "Giant Panda",
    image: "/images/giant-panda.jpg",
    status: "Endangered",
    significance:
      "National treasure of China and symbol of peace. Pandas play a significant role in Chinese culture and diplomacy.",
    location: "China",
    habitat: "Bamboo Forests",
  },
  {
    name: "Bengal Tiger",
    image: "/images/Bengal tiger.png",
    status: "Endangered",
    significance:
      "National animal of India and Bangladesh. The tiger is deeply embedded in South Asian mythology, folklore and cultural expressions.",
    location: "India",
    habitat: "Tropical Forests",
  },
  {
    name: "African Elephant",
    image: "/images/African-elephant.png",
    status: "Vulnerable",
    significance:
      "Symbol of wisdom and strength in many African cultures. Featured in traditional stories, artwork and ceremonies across the continent.",
    location: "Africa",
    habitat: "Savannas",
  },
  {
    name: "White Rhinoceros",
    image: "/images/white-rhino.jpg",
    status: "Near Threatened",
    significance:
      "Symbol of strength and protection in African cultures. Rhinos are featured in traditional art and are considered guardians of the land.",
    location: "Africa",
    habitat: "Savannas and Grasslands",
  },
];

const ExploreAnimals = () => {
  return (
    <div className="container mx-auto p-4 text-white">
      <div className="relative mb-8 text-center">
        <div className="w-full h-72 bg-gradient-to-r from-green-800 via-green-700 to-green-800 rounded-2xl shadow-2xl flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/giant-panda.jpg')] bg-cover bg-center opacity-20"></div>
          <div className="relative z-10 px-4">
            <h1 className="text-4xl md:text-6xl font-bold font-heading tracking-wider text-white drop-shadow-lg">
              Endangered Species & Their Cultural Significance
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/90 drop-shadow-md">
              Discover wildlife from around the globe and learn how they shape
              cultural identities and traditions
            </p>
          </div>
        </div>
      </div>

      {/* Animal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {animals.map((animal) => (
          <div
            key={animal.name}
            className="animal-card bg-white text-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col md:flex-row"
          >
            <img
              src={animal.image}
              alt={animal.name}
              className="w-full md:w-2/5 h-64 md:h-auto object-cover"
            />
            <div className="p-6 flex flex-col">
              <div className="flex justify-between items-start">
                <h3 className="text-3xl font-bold font-heading">
                  {animal.name}
                </h3>
                <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                  {animal.status}
                </span>
              </div>
              <p className="font-body text-slate-700 mt-2 flex-grow">
                {animal.significance}
              </p>
              <div className="flex items-center text-sm text-slate-600 mt-4">
                <FaMapMarkerAlt className="mr-2" />
                <span>
                  <strong>{animal.location}</strong> | {animal.habitat}
                </span>
              </div>
              <button className="mt-4 self-start bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreAnimals;
