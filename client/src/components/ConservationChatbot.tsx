import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChattbot } from "@/context/ChatbotContext";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Import Google AI
import { 
  Send, Mic, Bot, Volume2, VolumeX, Sparkles, 
  Leaf, Globe, BookOpen, X, Loader2
} from "lucide-react";

// !!! ------------------------------------------------ !!!
// PASTE YOUR API KEY HERE
const API_KEY = "AIzaSyDbZ1pBx4a4laXcF9P60tEOpO_meVo_c2E"; 
// !!! ------------------------------------------------ !!!

// Initialize Gemini
const genAI = new GoogleGenerativeAI(API_KEY);

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
    }, 10);
    return () => clearInterval(intervalId);
  }, [text]);
  return <span className="whitespace-pre-wrap">{displayedText}</span>;
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
        content: "Hello! I am connected to the ConservAR AI Network. I can explain complex topics, translate languages, or help you plan conservation projects. What would you like to know?",
        timestamp: new Date().toISOString()
      });
    }
  }, [messages, addMessage]);

  const speakText = (text: string) => {
    if (!soundEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    // Strip markdown symbols (*) for smoother speech
    const cleanText = text.replace(/\*/g, ''); 
    const utterance = new SpeechSynthesisUtterance(cleanText);
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
    
    // Check if API Key is missing
    if (API_KEY === "PASTE_YOUR_GEMINI_KEY_HERE" || !API_KEY) {
      toast({ title: "Config Error", description: "Please add your API Key in the code.", variant: "destructive" });
      return;
    }

    const userMsg = inputMessage.trim();
    setInputMessage('');
    setIsListening(false);
    
    addMessage({ role: 'user', content: userMsg, timestamp: new Date().toISOString() });
    setIsLoading(true);

    try {
      // 1. Configure the AI Model
      const model = genAI.getGenerativeModel({ model: "gemini-pro"});
      
      // 2. Set the "Persona" (System Instruction equivalent via prompt)
      const prompt = `
        You are an advanced AI assistant for a project called "ConservAR". 
        Your goal is to educate users about wildlife conservation, biology, and nature.
        Keep your answers concise, engaging, and hopeful. Use emojis occasionally.
        
        User Question: ${userMsg}
      `;

      // 3. Get Result from Google AI
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      addMessage({ 
        role: 'bot', 
        content: text, 
        timestamp: new Date().toISOString() 
      });

      if (soundEnabled) speakText(text);

    } catch (error) {
      console.error("AI Error:", error);
      toast({ title: "AI Error", description: "I couldn't reach the AI network.", variant: "destructive" });
      addMessage({ 
        role: 'bot', 
        content: "I'm having trouble connecting to my AI brain right now. Please check your API key.", 
        timestamp: new Date().toISOString() 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="conservation" className="py-16 bg-gradient-to-b from-slate-900 to-slate-950 text-white min-h-[700px]">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-2 bg-emerald-500/10 rounded-full mb-4 border border-emerald-500/20">
             <Sparkles className="w-4 h-4 text-emerald-400 mr-2" />
             <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Powered by Gemini AI</span>
          </div>
          <h2 className="font-bold text-4xl mb-3">ConservAR Intelligent Guide</h2>
          <p className="max-w-2xl mx-auto text-slate-400">Ask me anything about nature, science, or sustainability.</p>
        </div>
        
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          <div className="hidden lg:block col-span-1 space-y-3">
            <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-4">Try Asking...</h3>
            {[
              { label: "Explain Symbiosis", icon: <Leaf className="w-4 h-4"/>, query: "Explain symbiosis like I'm 10 years old" },
              { label: "Climate Solutions", icon: <Globe className="w-4 h-4"/>, query: "What are 3 things I can do to help climate change?" },
              { label: "Fun Facts", icon: <Sparkles className="w-4 h-4"/>, query: "Tell me a mind-blowing fact about octopus" },
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
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Sparkles className="text-white w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">AI Assistant</h3>
                  <span className="flex items-center text-xs text-emerald-400">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                    Gemini Live
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
                       ? 'bg-indigo-600 text-white rounded-tr-sm' 
                       : 'bg-slate-800 text-slate-200 border border-white/10 rounded-tl-sm'
                     }`}>
                        <div className="flex items-start gap-3">
                          {message.role === 'bot' && (
                             <div className="w-6 h-6 bg-slate-950 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                               <Sparkles className="w-3 h-3 text-purple-400" />
                             </div>
                          )}
                          <div className="text-sm leading-relaxed">
                            {message.role === 'bot' && index === messages.length - 1 && !isLoading ? (
                              <Typewriter text={message.content} onComplete={scrollToBottom} />
                            ) : (
                              <span className="whitespace-pre-wrap">{message.content}</span>
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
                    <div className="flex space-x-2 items-center text-slate-400 text-xs">
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                      <span>Thinking...</span>
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
                   placeholder={isListening ? "Listening..." : "Ask me anything..."}
                   className="flex-grow bg-slate-950 border-white/10 focus-visible:ring-indigo-500/50 text-white"
                   value={inputMessage}
                   onChange={(e) => setInputMessage(e.target.value)}
                   disabled={isLoading}
                 />
                 
                 <Button 
                   type="submit" 
                   className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-4"
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
