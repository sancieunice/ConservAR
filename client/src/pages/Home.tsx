import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Hero from "@/components/Hero";
import FeaturedAnimals from "@/components/FeaturedAnimals";
import ARExperience from "@/components/ARExperience";
import Challenges from "@/components/Challenges";
import ConservationChatbot from "@/components/ConservationChatbot";
import Footer from "@/components/Footer";
import { Animal } from "@shared/schema";

export default function Home() {
  // Load animals data
  const { data: animals, isLoading: animalsLoading, error: animalsError } = useQuery<Animal[]>({
    queryKey: ["/api/animals"],
    staleTime: 60000, // 1 minute
  });

  // For AR models, get animals with AR models
  const { data: arModels, isLoading: arModelsLoading } = useQuery<Animal[]>({
    queryKey: ["/api/animals/ar/models"],
    staleTime: 60000, // 1 minute
  });

  // Preload assets
  useEffect(() => {
    // Link to Google fonts
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Open+Sans:wght@400;600&family=Quicksand:wght@500;600&display=swap";
    document.head.appendChild(link);

    // Font Awesome
    const fontAwesome = document.createElement("link");
    fontAwesome.rel = "stylesheet";
    fontAwesome.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css";
    document.head.appendChild(fontAwesome);

    // Set page title
    document.title = "WildCulture Quest - Wildlife Conservation";

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(fontAwesome);
    };
  }, []);

  return (
    <div className="flex flex-col">
      <Hero />
      
      <FeaturedAnimals 
        animals={animals || []} 
        isLoading={animalsLoading} 
        error={animalsError ? true : false} 
      />
      
      <ARExperience 
        arModels={arModels || []} 
        isLoading={arModelsLoading} 
      />
      
      <Challenges />
      
      <ConservationChatbot />
      
      <Footer />
    </div>
  );
}
