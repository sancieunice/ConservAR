import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { AudioProvider } from "@/context/AudioContext";
import { ARProvider } from "@/context/ARContext";
import { ChallengeProvider } from "@/context/ChallengeContext";
import { ChatbotProvider } from "@/context/ChatbotContext";
import Header from "@/components/Header";
import SoundPlayer from "@/components/SoundPlayer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AudioProvider>
          <ARProvider>
            <ChallengeProvider>
              <ChatbotProvider>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-grow">
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
