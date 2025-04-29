import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAR } from "@/context/ARContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Animal } from "@shared/schema";
import { initializeAR } from "@/lib/ar-utils";

interface ARExperienceProps {
  arModels: Animal[];
  isLoading: boolean;
}

const ARExperience = ({ arModels, isLoading }: ARExperienceProps) => {
  const { isARActive, startAR, selectedModel, selectARModel } = useAR();
  const [isARSupported, setIsARSupported] = useState<boolean | null>(null);

  // Check if AR is supported
  useEffect(() => {
    const checkARSupport = async () => {
      try {
        // Simple check for WebXR support
        const supported = 
          'xr' in navigator && 
          await (navigator as any).xr?.isSessionSupported('immersive-ar');
        setIsARSupported(!!supported);
      } catch (error) {
        console.error("Error checking AR support:", error);
        setIsARSupported(false);
      }
    };
    
    checkARSupport();
  }, []);

  const handleARLaunch = async () => {
    if (!isARSupported) {
      alert("Your device doesn't support AR capabilities. Please try on a newer device with AR support.");
      return;
    }
    
    try {
      await startAR();
      initializeAR();
    } catch (error) {
      console.error("Failed to start AR experience:", error);
      alert("Failed to start AR experience. Please ensure camera permissions are granted.");
    }
  };

  return (
    <section id="ar-experience" className="py-16 bg-secondary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl mb-3">AR Wildlife Experience</h2>
          <p className="max-w-2xl mx-auto opacity-90">Bring endangered species into your world with our augmented reality experience</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 rounded-xl overflow-hidden shadow-xl">
            <div className="ar-placeholder w-full h-96 relative bg-black flex items-center justify-center">
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 p-6">
                {isARActive ? (
                  <div id="ar-scene" className="w-full h-full"></div>
                ) : (
                  <>
                    <i className="fas fa-cube text-accent text-5xl mb-4"></i>
                    <h3 className="font-heading font-bold text-2xl mb-2">AR Viewer</h3>
                    <p className="text-center mb-6">Scan the area with your camera to place 3D animals in your environment</p>
                    <Button
                      className="bg-accent hover:bg-orange-500 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg"
                      onClick={handleARLaunch}
                      disabled={isARSupported === false}
                    >
                      <i className="fas fa-camera mr-2"></i> Launch AR Experience
                    </Button>
                    {isARSupported === false && (
                      <p className="mt-4 text-xs text-red-300">
                        AR is not supported on your device. Please try on a newer smartphone or tablet.
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <Card className="bg-primary rounded-xl shadow-xl mb-8">
              <CardContent className="p-6">
                <h3 className="font-heading font-bold text-xl mb-4 text-white">Available 3D Models</h3>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="p-3 bg-white bg-opacity-10 rounded-lg">
                        <Skeleton className="h-10 w-full bg-white bg-opacity-10" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {arModels.map((model) => (
                      <li 
                        key={model.id}
                        className={`flex items-center justify-between p-3 bg-white ${
                          selectedModel?.id === model.id ? 'bg-opacity-30' : 'bg-opacity-10'
                        } rounded-lg hover:bg-opacity-20 transition-colors cursor-pointer`}
                        onClick={() => selectARModel(model)}
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 flex items-center justify-center bg-accent rounded-full mr-3">
                            <i className="fas fa-paw"></i>
                          </div>
                          <span>{model.name}</span>
                        </div>
                        <i className="fas fa-cube"></i>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-primary rounded-xl shadow-xl">
              <CardContent className="p-6">
                <h3 className="font-heading font-bold text-xl mb-4 text-white">How to Use</h3>
                <ol className="space-y-3 list-decimal list-inside text-white">
                  <li>Click "Launch AR Experience"</li>
                  <li>Allow camera access when prompted</li>
                  <li>Scan a flat surface with your device</li>
                  <li>Select an animal from the list</li>
                  <li>Tap on the surface to place the 3D model</li>
                  <li>Pinch to resize and drag to reposition</li>
                </ol>
                <div className="mt-6 p-3 bg-white bg-opacity-10 rounded-lg">
                  <p className="text-sm text-white"><i className="fas fa-info-circle mr-2"></i> AR features work best on newer smartphones and tablets with ARCore or ARKit support.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ARExperience;
