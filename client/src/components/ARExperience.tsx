import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAR } from "@/context/ARContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Animal } from "@shared/schema";
import { Download, Smartphone, ExternalLink } from "lucide-react";

// Declare model-viewer as a web component
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": {
        src: string;
        alt?: string;
        "ar-mode"?: string;
        "ar-scale"?: string;
        "ar-placement"?: string;
        "camera-controls"?: boolean;
        "auto-rotate"?: boolean;
        "interaction-policy"?: string;
        style?: React.CSSProperties;
        className?: string;
        ar?: boolean;
        "ios-src"?: string;
        "ar-modes"?: string;
      };
    }
  }
}

interface ARExperienceProps {
  arModels: Animal[];
  isLoading: boolean;
}

interface EcosystemTarget {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
}

const ecosystemTargets: EcosystemTarget[] = [
  {
    id: "savanna",
    name: "Savanna Ecosystem",
    imageUrl: "/images/ecosystems/savannah-target.jpeg",
    description:
      "Use this target to trigger savanna animals like rhino and elephant.",
  },
  {
    id: "mountains",
    name: "Mountain Ecosystem",
    imageUrl: "/images/ecosystems/mountain-target.jpeg",
    description:
      "Use this target to trigger mountain species and habitat storytelling.",
  },
  {
    id: "marine",
    name: "Marine Ecosystem",
    imageUrl: "/images/ecosystems/marine-target.jpeg",
    description:
      "Use this target to trigger marine animals and ocean conservation AR experiences.",
  },
  {
    id: "wetland",
    name: "Wetland Ecosystem",
    imageUrl: "/images/ecosystems/wetland-target.jpeg",
    description:
      "Use this target to trigger wetland species and water habitat AR content.",
  },
];

const ARExperience = ({ arModels, isLoading }: ARExperienceProps) => {
  const { isARActive, startAR, selectedModel, selectARModel, stopAR } = useAR();
  const [isARSupported, setIsARSupported] = useState<boolean | null>(null);
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
  const [targetImageFailed, setTargetImageFailed] = useState(false);

  const activeTarget = ecosystemTargets[currentTargetIndex];

  // Check if AR is supported (model-viewer supports AR on iOS and Android)
  useEffect(() => {
    const checkARSupport = () => {
      // Check if model-viewer is loaded
      const isModelViewerLoaded =
        typeof (window as any).customElements?.get("model-viewer") !==
        "undefined";

      // Check for AR support (iOS ARKit or Android ARCore via model-viewer)
      const userAgent =
        navigator.userAgent || navigator.vendor || (window as any).opera;
      const isIOS =
        /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
      const isAndroid = /android/i.test(userAgent);

      // Model-viewer supports AR on iOS (AR Quick Look) and Android (ARCore)
      // On desktop, show 3D viewer (no AR, but can rotate/zoom)
      setIsARSupported(isModelViewerLoaded);
    };

    // Wait for model-viewer to load
    const checkInterval = setInterval(() => {
      if ((window as any).customElements?.get("model-viewer")) {
        checkARSupport();
        clearInterval(checkInterval);
      }
    }, 100);

    // Timeout after 5 seconds
    setTimeout(() => {
      clearInterval(checkInterval);
      checkARSupport();
    }, 5000);

    return () => clearInterval(checkInterval);
  }, []);

  const handleARLaunch = async () => {
    if (!selectedModel || !selectedModel.modelUrl) {
      alert("Please select a 3D model from the list first.");
      return;
    }

    try {
      await startAR();
    } catch (error) {
      console.error("Failed to start AR experience:", error);
      alert(
        "Failed to start AR experience. Please ensure camera permissions are granted.",
      );
    }
  };

  // Auto-select first model if available
  useEffect(() => {
    if (arModels.length > 0 && !selectedModel) {
      const firstModelWithAR = arModels.find((m) => m.hasArModel && m.modelUrl);
      if (firstModelWithAR) {
        selectARModel(firstModelWithAR);
      }
    }
  }, [arModels, selectedModel, selectARModel]);

  useEffect(() => {
    setTargetImageFailed(false);
  }, [currentTargetIndex]);

  const isMobile = () => {
    const userAgent =
      navigator.userAgent || navigator.vendor || (window as any).opera;
    return /iPad|iPhone|iPod|Android/i.test(userAgent);
  };

  const goToPreviousTarget = () => {
    setCurrentTargetIndex((prev) =>
      prev === 0 ? ecosystemTargets.length - 1 : prev - 1,
    );
  };

  const goToNextTarget = () => {
    setCurrentTargetIndex((prev) => (prev + 1) % ecosystemTargets.length);
  };

  const handleOpenARApp = () => {
    // For Android: attempt to open the app via intent or provide APK download
    const userAgent =
      navigator.userAgent || navigator.vendor || (window as any).opera;
    const isAndroid = /android/i.test(userAgent);

    if (isAndroid) {
      // Try to launch the app via deep link (adjust package name as needed)
      const appPackage = "com.ConservAR.BiodiversityAR";
      const intentUri = `intent://scan?action=scan#Intent;package=${appPackage};end`;

      // Attempt to launch via intent
      window.location.href = intentUri;

      // If app is not installed, show fallback after a delay
      setTimeout(() => {
        const isAppInstalled = document.hidden === false;
        if (!isAppInstalled) {
          showAPKDownloadModal();
        }
      }, 2000);
    } else {
      // For iOS or desktop, show download/install instructions
      showAPKDownloadModal();
    }
  };

  const showAPKDownloadModal = () => {
    const message =
      "ConservAR AR App is not installed.\n\n" +
      "📱 Download Options:\n\n" +
      "1. Android: Download APK from our server\n" +
      "2. Install the app, then return to this page\n\n" +
      "After installation, return here and tap 'Open AR App' to scan ecosystem targets.";

    alert(message);
    window.location.href = "/downloads/ConservAR.apk";
  };

  return (
    <section id="ar-experience" className="py-16 bg-secondary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl mb-3">
            AR Wildlife Experience
          </h2>
          <p className="max-w-2xl mx-auto opacity-90">
            Bring endangered species into your world with our augmented reality
            experience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 rounded-xl overflow-hidden shadow-xl">
            <div className="w-full h-96 relative bg-black flex items-center justify-center">
              {selectedModel && selectedModel.modelUrl ? (
                <>
                  <model-viewer
                    src={selectedModel.modelUrl}
                    alt={selectedModel.name}
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                    ar-scale="auto"
                    ar-placement="floor"
                    camera-controls
                    auto-rotate
                    interaction-policy="allow-when-focused"
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#000",
                    }}
                    className="w-full h-full"
                  />
                  {isMobile() && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                      <p className="text-xs text-white bg-black bg-opacity-70 px-4 py-2 rounded mb-2">
                        Tap the AR button on the model to view in AR
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 p-6">
                  <i className="fas fa-cube text-accent text-5xl mb-4"></i>
                  <h3 className="font-heading font-bold text-2xl mb-2">
                    AR Viewer
                  </h3>
                  <p className="text-center mb-6">
                    {arModels.length > 0
                      ? "Select a 3D model from the list to view it in AR"
                      : "No 3D models available. Please add model files to /public/models/"}
                  </p>
                  {arModels.length === 0 && (
                    <p className="text-xs text-yellow-300 mt-2">
                      Supported formats: .glb, .gltf, .usdz (for iOS)
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <Card className="bg-primary rounded-xl shadow-xl mb-8">
              <CardContent className="p-6">
                <h3 className="font-heading font-bold text-xl mb-4 text-white">
                  Available 3D Models
                </h3>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="p-3 bg-white bg-opacity-10 rounded-lg"
                      >
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
                          selectedModel?.id === model.id
                            ? "bg-opacity-30"
                            : "bg-opacity-10"
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
                <h3 className="font-heading font-bold text-xl mb-4 text-white">
                  How to Use
                </h3>
                <ol className="space-y-3 list-decimal list-inside text-white">
                  <li>Select an animal from the list above</li>
                  <li>
                    On mobile: Tap the AR button that appears on the 3D model
                  </li>
                  <li>
                    On desktop: Rotate and zoom the 3D model with your mouse
                  </li>
                  <li>Allow camera access when prompted (mobile only)</li>
                  <li>Point your device at a flat surface</li>
                  <li>The 3D model will appear in your environment</li>
                </ol>
                <div className="mt-6 p-3 bg-white bg-opacity-10 rounded-lg">
                  <p className="text-sm text-white">
                    <i className="fas fa-info-circle mr-2"></i>
                    AR works on iOS (Safari) and Android (Chrome). Desktop shows
                    interactive 3D viewer.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-10">
          <Card className="bg-primary rounded-xl shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
                <div>
                  <h3 className="font-heading font-bold text-2xl text-white">
                    Ecosystem Scan Targets
                  </h3>
                  <p className="text-white/90 text-sm mt-1">
                    Show these target images one by one, then scan them in your
                    Unity + Vuforia app to trigger the matching AR experience.
                  </p>
                </div>
                <div className="text-white/80 text-sm">
                  Target {currentTargetIndex + 1} of {ecosystemTargets.length}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 rounded-xl overflow-hidden bg-black/30 border border-white/10">
                  {targetImageFailed ? (
                    <div className="h-72 flex items-center justify-center px-6 text-center text-white/90">
                      <div>
                        <p className="font-semibold mb-2">
                          {activeTarget.name}
                        </p>
                        <p className="text-sm mb-3">
                          Could not load this image yet.
                        </p>
                        <p className="text-xs text-white/70">
                          Add your image at:{" "}
                          <span className="font-mono">
                            {activeTarget.imageUrl}
                          </span>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={activeTarget.imageUrl}
                      alt={`${activeTarget.name} target`}
                      className="w-full h-72 object-cover"
                      onError={() => setTargetImageFailed(true)}
                    />
                  )}
                </div>

                <div className="bg-white/10 rounded-xl p-4 text-white space-y-4">
                  <div>
                    <h4 className="font-heading font-bold text-lg mb-2">
                      {activeTarget.name}
                    </h4>
                    <p className="text-sm text-white/90">
                      {activeTarget.description}
                    </p>
                  </div>

                  <div className="border-t border-white/20 pt-3">
                    <h5 className="font-semibold text-sm mb-2">How to Scan:</h5>
                    <ol className="text-xs list-decimal list-inside space-y-1 text-white/80">
                      <li>Open ConservAR AR App on mobile</li>
                      <li>Point camera at this ecosystem image</li>
                      <li>Wait for Vuforia detection (1-3 sec)</li>
                      <li>Use in-app Q&A buttons to learn more</li>
                    </ol>
                  </div>

                  <Button
                    type="button"
                    onClick={handleOpenARApp}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Open AR App
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      className="flex-1"
                      onClick={goToPreviousTarget}
                    >
                      ← Previous
                    </Button>
                    <Button
                      type="button"
                      className="flex-1 bg-accent hover:bg-orange-500 text-white"
                      onClick={goToNextTarget}
                    >
                      Next →
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ARExperience;
