import { Switch, Route } from "wouter";
import { useEffect, useRef } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ExploreAnimals from "@/pages/ExploreAnimals"; // Import the new page
import { AudioProvider } from "@/context/AudioContext";
import { ARProvider } from "@/context/ARContext";
import { ChallengeProvider } from "@/context/ChallengeContext";
import { ChatbotProvider } from "@/context/ChatbotContext";
import Header from "@/components/Header";
import SoundPlayer from "@/components/SoundPlayer";
import ScrollToTop from "@/components/ScrollToTop"; // Import the new component

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/explore" component={ExploreAnimals} /> {/* Add route for the new page */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const mainScrollRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);
    mainScrollRef.current?.scrollTo(0, 0);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AudioProvider>
          <ARProvider>
            <ChallengeProvider>
              <ChatbotProvider>
                <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#1f5233] via-[#2d7a4a] to-[#1f5233]">
                  <ScrollToTop scrollableElementRef={mainScrollRef} />
                  <Header />
                  <main ref={mainScrollRef} className="flex-grow overflow-y-auto">
                    <Router />
                  </main>
                  <SoundPlayer />
                  <Toaster />
                </div>
              </ChatbotProvider>
            </ChallengeProvider>
          </ARProvider>
        </AudioProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
