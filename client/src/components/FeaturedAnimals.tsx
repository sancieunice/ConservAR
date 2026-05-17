import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Animal } from "@shared/schema";

interface FeaturedAnimalsProps {
  animals: Animal[];
  isLoading: boolean;
  error: boolean;
}

const FeaturedAnimals = ({ animals, isLoading, error }: FeaturedAnimalsProps) => {
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const getAnimalImageUrl = (animal: Animal) =>
    animal.name.toLowerCase() === "kangaroo"
      ? "/images/Red-Kangaroo.jpg"
      : animal.imageUrl;
  
  const openAnimalDetails = (animal: Animal) => {
    setSelectedAnimal(animal);
  };

  const closeAnimalDetails = () => {
    setSelectedAnimal(null);
  };

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'endangered':
        return 'bg-red-500';
      case 'vulnerable':
        return 'bg-yellow-500';
      case 'recovered':
        return 'bg-green-500';
      case 'least concern':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <section id="animals" className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl mb-3 text-emerald-900">Endangered Species & Their Cultural Significance</h2>
          <p className="max-w-2xl mx-auto text-gray-600">Discover wildlife from around the globe and learn how they shape cultural identities and traditions</p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-52 w-full" />
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Skeleton className="h-4 w-20 mr-3" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-10 w-full rounded-lg" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-50 rounded-lg">
            <p className="text-red-500">Failed to load animals. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {animals.map((animal) => (
              <div key={animal.id} className="animal-card bg-white text-slate-950 rounded-xl overflow-hidden shadow-lg border border-slate-200">
                <img 
                  src={getAnimalImageUrl(animal)} 
                  alt={`${animal.name} in natural habitat`} 
                  className="w-full h-52 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-heading font-bold text-xl text-slate-950">{animal.name}</h3>
                    <span className={`${getStatusColor(animal.conservationStatus)} text-white text-xs py-1 px-2 rounded-full`}>
                      {animal.conservationStatus}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{animal.culturalSignificance}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="mr-3"><i className="fas fa-map-marker-alt mr-1"></i> {animal.region}</span>
                    <span><i className="fas fa-paw mr-1"></i> {animal.habitat}</span>
                  </div>
                  <Button 
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2 rounded-lg transition-colors" 
                    onClick={() => openAnimalDetails(animal)}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Button 
            variant="link" 
            className="inline-flex items-center text-emerald-800 hover:text-emerald-950 font-bold"
          >
            Explore All Animals <i className="fas fa-arrow-right ml-2"></i>
          </Button>
        </div>
      </div>

      {/* Animal Details Dialog */}
      <Dialog open={!!selectedAnimal} onOpenChange={() => closeAnimalDetails()}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white text-slate-950 border-slate-200">
          {selectedAnimal && (
            <>
              <img 
                src={getAnimalImageUrl(selectedAnimal)} 
                alt={selectedAnimal.name} 
                className="w-full h-64 object-cover rounded-t-lg -mt-6 -mx-6 mb-4"
              />
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <DialogTitle className="text-2xl font-heading text-slate-950">{selectedAnimal.name}</DialogTitle>
                  <span className={`${getStatusColor(selectedAnimal.conservationStatus)} text-white text-xs py-1 px-2 rounded-full`}>
                    {selectedAnimal.conservationStatus}
                  </span>
                </div>
                <DialogDescription className="text-sm italic font-medium text-slate-600">
                  {selectedAnimal.scientificName}
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4">
                <h4 className="font-bold text-emerald-900 mb-2">Description</h4>
                <p className="mb-4 text-gray-700">{selectedAnimal.description}</p>
                
                <h4 className="font-bold text-emerald-900 mb-2">Cultural Significance</h4>
                <p className="mb-4 text-gray-700">{selectedAnimal.culturalSignificance}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="text-sm font-semibold text-gray-600">Region</h5>
                    <p className="text-slate-900">{selectedAnimal.region}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="text-sm font-semibold text-gray-600">Habitat</h5>
                    <p className="text-slate-900">{selectedAnimal.habitat}</p>
                  </div>
                </div>
                
                {selectedAnimal.hasArModel && (
                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white" 
                    onClick={closeAnimalDetails}
                  >
                    <i className="fas fa-cube mr-2"></i> View in AR
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FeaturedAnimals;
