import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChattbot } from "@/context/ChatbotContext";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Mic,
  Bot,
  Sparkles,
  Leaf,
  Globe,
  BookOpen,
  X,
} from "lucide-react";

const formatBotText = (text: string) => {
  return text
    .replace(/\*\*/g, "")
    .replace(/^\s*#+\s*/gm, "")
    .replace(/\s+-\s+/g, "\n- ")
    .replace(/\s+(\d+\.)\s+/g, "\n$1 ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const MessageText = ({ text, isBot }: { text: string; isBot: boolean }) => {
  if (!isBot) {
    return <span className="whitespace-pre-wrap">{text}</span>;
  }

  const blocks = formatBotText(text).split(/\n{2,}/);

  return (
    <div className="space-y-3">
      {blocks.map((block, blockIndex) => {
        const lines = block
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        const bulletLines = lines.filter((line) => /^(-|\d+\.)\s+/.test(line));

        if (bulletLines.length === lines.length && lines.length > 0) {
          return (
            <ul key={blockIndex} className="list-disc pl-5 space-y-1">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>
                  {line.replace(/^-\s+/, "").replace(/^\d+\.\s+/, "")}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={blockIndex} className="whitespace-pre-wrap">
            {lines.join("\n")}
          </p>
        );
      })}
    </div>
  );
};

const ConservationChatbot = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const { messages, addMessage } = useChattbot();
  const { toast } = useToast();

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        role: "bot",
        content: "Hi! Ask me about wildlife, endangered species, or conservation.",
        timestamp: new Date().toISOString(),
      });
    }
  }, [messages, addMessage]);

  const toggleListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        title: "Error",
        description: "Browser doesn't support speech recognition.",
        variant: "destructive",
      });
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";

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
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage.trim();
    setInputMessage("");
    setIsListening(false);

    // 1. Add User Message
    addMessage({
      role: "user",
      content: userMsg,
      timestamp: new Date().toISOString(),
    });

    setIsLoading(true);

    try {
      // 2. Call chatbot API (Groq-backed on the server)
      // Build conversation history from previous messages
      const history = messages
        .filter((msg) => msg.role === "user" || msg.role === "bot")
        .slice(-6) // Keep last 6 messages for context
        .map((msg) => ({
          role: msg.role === "bot" ? "assistant" : ("user" as const),
          content: msg.content,
        }));

      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMsg,
          history: history,
        }),
      });

      const responseText = await response.text();
      let data: { message?: string; timestamp?: string } = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error("The online chatbot is unavailable right now.");
      }

      if (!response.ok) {
        throw new Error(data?.message || `API error: ${response.status}`);
      }

      addMessage({
        role: "bot",
        content: data.message,
        timestamp: data.timestamp || new Date().toISOString(),
      });
    } catch (error) {
      console.error("Chatbot API error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "The AI chatbot is unavailable right now.";

      addMessage({
        role: "bot",
        content:
          errorMessage || "The AI chatbot is unavailable right now.",
        timestamp: new Date().toISOString(),
      });

      toast({
        title: "AI unavailable",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="conservation"
      className="py-16 bg-gradient-to-b from-slate-900 to-slate-950 text-white min-h-[700px]"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-2 bg-emerald-500/10 rounded-full mb-4 border border-emerald-500/20">
            <Sparkles className="w-4 h-4 text-emerald-400 mr-2" />
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
              ConservAR AI 2.0
            </span>
          </div>
          <h2 className="font-bold text-4xl mb-3">
            Wildlife Conservation Guide
          </h2>
          <p className="max-w-2xl mx-auto text-slate-400">
            Interactive AI powered by global conservation data.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="hidden lg:block col-span-1 space-y-3">
            <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-4">
              Quick Topics
            </h3>
            {[
              {
                label: "Endangered List",
                icon: <Leaf className="w-4 h-4" />,
                query: "Tell me about endangered tigers",
              },
              {
                label: "Global Action",
                icon: <Globe className="w-4 h-4" />,
                query: "What global actions are being taken?",
              },
              {
                label: "Resources",
                icon: <BookOpen className="w-4 h-4" />,
                query: "Give me learning resources",
              },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => setInputMessage(item.query)}
                className="flex items-center w-full p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-500/30 rounded-lg transition-all text-sm text-left group"
              >
                <span className="text-emerald-500 group-hover:text-emerald-400 mr-3">
                  {item.icon}
                </span>
                <span className="text-slate-300 group-hover:text-white">
                  {item.label}
                </span>
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
            </CardHeader>

            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20"
            >
              <AnimatePresence initial={false}>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] lg:max-w-[75%] p-4 rounded-2xl ${
                        message.role === "user"
                          ? "bg-emerald-600 text-white rounded-tr-sm"
                          : "bg-slate-800 text-slate-200 border border-white/10 rounded-tl-sm"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {message.role === "bot" && (
                          <div className="w-6 h-6 bg-slate-950 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Bot className="w-3 h-3 text-emerald-500" />
                          </div>
                        )}
                        <div className="flex flex-col gap-2">
                          <div className="text-sm leading-relaxed">
                            <MessageText
                              text={message.content}
                              isBot={message.role === "bot"}
                            />
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
                              <img
                                src={message.image}
                                alt="Reference"
                                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                              />
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-slate-800 border border-white/10 p-4 rounded-2xl rounded-tl-sm ml-0">
                    <div className="flex space-x-1.5">
                      <div
                        className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0s" }}
                      />
                      <div
                        className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <div
                        className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <CardContent className="p-4 bg-slate-900 border-t border-white/5">
              <form
                className="relative flex items-center gap-2"
                onSubmit={handleSubmit}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={toggleListening}
                  className={`shrink-0 rounded-full ${isListening ? "text-red-500 bg-red-500/10" : "text-slate-400 hover:text-white"}`}
                >
                  {isListening ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </Button>

                <Input
                  type="text"
                  placeholder={
                    isListening
                      ? "Listening..."
                      : "Ask about tigers, elephants, or resources..."
                  }
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
