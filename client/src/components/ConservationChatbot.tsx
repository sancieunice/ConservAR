import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChattbot } from "@/context/ChatbotContext";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Mic, Bot, Volume2, VolumeX, Sparkles, 
  Leaf, Globe, BookOpen, X, ExternalLink
} from "lucide-react";

// --- Internal Component: Typewriter Effect ---
const Typewriter = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    setDisplayedText("");
    let index = 0;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index === text.length) {
        clearInterval(intervalId);
        if (onComplete) onComplete();
      }
    }, 10); // Faster typing speed
    return () => clearInterval(intervalId);
  }, [text]);

  return <span>{displayedText}</span>;
};

// --- THE LOCAL BRAIN (Simulated AI) ---
const generateBotResponse = (input: string) => {
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes("endangered") || lowerInput.includes("tiger") || lowerInput.includes("animal")) {
    return {
      text: "The Bengal Tiger is one of the most endangered species. Fewer than 2,500 remain in the wild due to poaching and habitat loss. Other critical species include the Black Rhino and Amur Leopard.",
      image: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=1000&auto=format&fit=crop"
    };
  }
  
  if (lowerInput.includes("elephant") || lowerInput.includes("ivory")) {
    return {
      text: "Elephants are crucial ecosystem engineers. However, they face threats from the ivory trade. Conservationists are using AI to track herds and prevent poaching.",
      image: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=1000&auto=format&fit=crop"
    };
  }

  if (lowerInput.includes("global") || lowerInput.includes("action") || lowerInput.includes("initiative")) {
    return {
      text: "Global initiatives like '30x30' aim to protect 30% of the planet by 2030. Organizations like WWF and The Nature Conservancy are leading these efforts.",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop"
    };
  }

  if (lowerInput.includes("resource") || lowerInput.includes("learn") || lowerInput.includes("book")) {
    return {
      text: "Here are some great resources to learn more:\n\n• WWF Wild Classroom\n• National Geographic Conservation\n• The IUCN Red List\n\nWould you like links to any of these?",
      image: null
    };
  }

  if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
    return {
      text: "Hello! I am ready to help you explore the wild. Ask me about endangered species, climate change, or how to get involved!",
      image: null
    };
  }

  return {
    text: "That is an interesting topic. While I don't have specific data on that right now, I recommend checking the IUCN Red List for the most up-to-date conservation status.",
    image: null
  };
};

const ConservationChatbot = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { messages, addMessage } = useChattbot();
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        role: 'bot',
        content: "Hello! I'm your ConservAR Guide. Ask me about endangered species, conservation strategies, or indigenous nature practices.",
        timestamp: new Date().toISOString()
      });
    }
  }, [messages, addMessage]);

  const speakText = (text: string) => {
    if (!soundEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({ title: "Error", description: "Browser doesn't support speech recognition.", variant: "destructive" });
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    if (!isListening) {
      setIsListening(true);
      recognition.start();
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } else {
      setIsListening(false);
      window.speechSynthesis.cancel();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;
    
    const userMsg = inputMessage.trim();
    setInputMessage('');
    setIsListening(false);
    
    // 1. Add User Message
    addMessage({ role: 'user', content: userMsg, timestamp: new Date().toISOString() });
    
    setIsLoading(true);

    // 2. SIMULATE API CALL (The fix)
    setTimeout(() => {
      const response = generateBotResponse(userMsg);
      
      addMessage({ 
        role: 'bot', 
        content: response.text, 
        // We cheat slightly and store the image URL in the content if needed, 
        // or purely rely on the rendering logic below. 
        // For this quick fix, we will modify the message object in context or append markdown.
        // Let's append a special marker for the image for now or use a custom field if you updated context.
        // Assuming context is strict, we append a separator.
        timestamp: new Date().toISOString(),
        // @ts-ignore - Adding image property dynamically for this component
        image: response.image 
      });

      if (soundEnabled) speakText(response.text);
      setIsLoading(false);
    }, 1500); // 1.5 second "thinking" delay
  };

  return (
    <section id="conservation" className="py-16 bg-gradient-to-b from-slate-900 to-slate-950 text-white min-h-[700px]">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-2 bg-emerald-500/10 rounded-full mb-4 border border-emerald-500/20">
             <Sparkles className="w-4 h-4 text-emerald-400 mr-2" />
             <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">ConservAR AI 2.0</span>
          </div>
          <h2 className="font-bold text-4xl mb-3">Wildlife Conservation Guide</h2>
          <p className="max-w-2xl mx-auto text-slate-400">Interactive AI powered by global conservation data.</p>
        </div>
        
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          <div className="hidden lg:block col-span-1 space-y-3">
            <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-4">Quick Topics</h3>
            {[
              { label: "Endangered List", icon: <Leaf className="w-4 h-4"/>, query: "Tell me about endangered tigers" },
              { label: "Global Action", icon: <Globe className="w-4 h-4"/>, query: "What global actions are being taken?" },
              { label: "Resources", icon: <BookOpen className="w-4 h-4"/>, query: "Give me learning resources" },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => setInputMessage(item.query)}
                className="flex items-center w-full p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-500/30 rounded-lg transition-all text-sm text-left group"
              >
                <span className="text-emerald-500 group-hover:text-emerald-400 mr-3">{item.icon}</span>
                <span className="text-slate-300 group-hover:text-white">{item.label}</span>
              </button>
            ))}
          </div>

          <Card className="col-span-1 lg:col-span-3 bg-slate-900/80 border-white/10 shadow-2xl overflow-hidden backdrop-blur-sm h-[600px] flex flex-col">
            <CardHeader className="bg-white/5 p-4 flex flex-row items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/20">
                  <Bot className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">EcoGuide</h3>
                  <span className="flex items-center text-xs text-emerald-400">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                    Online
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSoundEnabled(!soundEnabled)} className="text-slate-400 hover:text-white">
                {soundEnabled ? <Volume2 className="w-5 h-5"/> : <VolumeX className="w-5 h-5"/>}
              </Button>
            </CardHeader>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
              <AnimatePresence initial={false}>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                     <div className={`max-w-[85%] lg:max-w-[75%] p-4 rounded-2xl ${
                       message.role === 'user' 
                       ? 'bg-emerald-600 text-white rounded-tr-sm' 
                       : 'bg-slate-800 text-slate-200 border border-white/10 rounded-tl-sm'
                     }`}>
                        <div className="flex items-start gap-3">
                          {message.role === 'bot' && (
                             <div className="w-6 h-6 bg-slate-950 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                               <Bot className="w-3 h-3 text-emerald-500" />
                             </div>
                          )}
                          <div className="flex flex-col gap-2">
                            <div className="text-sm leading-relaxed">
                              {message.role === 'bot' && index === messages.length - 1 && !isLoading ? (
                                <Typewriter text={message.content} onComplete={scrollToBottom} />
                              ) : (
                                <span className="whitespace-pre-wrap">{message.content}</span>
                              )}
                            </div>
                            
                            {/* RENDER IMAGE IF AVAILABLE */}
                            {/* @ts-ignore */}
                            {message.image && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1 }}
                                className="mt-2 rounded-lg overflow-hidden border border-white/10"
                              >
                                {/* @ts-ignore */}
                                <img src={message.image} alt="Reference" className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />
                              </motion.div>
                            )}
                          </div>
                        </div>
                     </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-slate-800 border border-white/10 p-4 rounded-2xl rounded-tl-sm ml-0">
                    <div className="flex space-x-1.5">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <CardContent className="p-4 bg-slate-900 border-t border-white/5">
              <form className="relative flex items-center gap-2" onSubmit={handleSubmit}>
                 <Button 
                   type="button" 
                   variant="ghost" 
                   size="icon" 
                   onClick={toggleListening}
                   className={`shrink-0 rounded-full ${isListening ? 'text-red-500 bg-red-500/10' : 'text-slate-400 hover:text-white'}`}
                 >
                   {isListening ? <X className="w-5 h-5"/> : <Mic className="w-5 h-5" />}
                 </Button>
                 
                 <Input 
                   type="text" 
                   placeholder={isListening ? "Listening..." : "Ask about tigers, elephants, or resources..."}
                   className="flex-grow bg-slate-950 border-white/10 focus-visible:ring-emerald-500/50 text-white"
                   value={inputMessage}
                   onChange={(e) => setInputMessage(e.target.value)}
                   disabled={isLoading}
                 />
                 
                 <Button 
                   type="submit" 
                   className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-4"
                   disabled={isLoading || !inputMessage.trim()}
                 >
                   <Send className="w-4 h-4" />
                 </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ConservationChatbot;
