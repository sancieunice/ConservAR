import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useChattbot } from "@/context/ChatbotContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
}

const ConservationChatbot = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { messages, addMessage } = useChattbot();
  const { toast } = useToast();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Initialize with a welcome message if there are no messages
  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        role: 'bot',
        content: "Hello! I'm your Wildlife Conservation Guide. Ask me about conservation efforts, endangered species, or how different cultures are working to protect wildlife.",
        timestamp: new Date().toISOString()
      });
    }
  }, [messages, addMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Add user message immediately
    addMessage({
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    });
    
    // Send to backend
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/chatbot', { message: userMessage });
      const data = await response.json();
      
      addMessage({
        role: 'bot',
        content: data.message,
        timestamp: data.timestamp
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Conversation Error",
        description: "Failed to get a response from the conservation guide. Please try again.",
        variant: "destructive"
      });
      
      // Fallback message in case of error
      addMessage({
        role: 'bot',
        content: "I'm sorry, I'm having trouble responding right now. Please try again later.",
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <section id="conservation" className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl mb-3">Wildlife Conservation Assistant</h2>
          <p className="max-w-2xl mx-auto opacity-90">Ask questions about wildlife conservation efforts around the world</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white rounded-xl overflow-hidden shadow-2xl">
            <CardHeader className="bg-secondary p-4 flex items-center">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-robot"></i>
              </div>
              <h3 className="font-heading font-bold text-xl text-white">Conservation Guide</h3>
            </CardHeader>
            
            <div className="h-80 p-4 overflow-y-auto bg-gray-50">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex items-start chatbot-message mb-4 ${
                    message.role === 'user' ? 'justify-end' : ''
                  }`}
                >
                  {message.role === 'bot' && (
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                      <i className="fas fa-robot text-sm text-white"></i>
                    </div>
                  )}
                  
                  <div className={`${
                    message.role === 'user' 
                      ? 'bg-accent text-white rounded-lg rounded-tr-none' 
                      : 'bg-secondary text-white rounded-lg rounded-tl-none'
                  } p-3 max-w-xs md:max-w-md`}>
                    {message.content.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                    ))}
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center ml-2 mt-1 flex-shrink-0">
                      <i className="fas fa-user text-sm text-white"></i>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start chatbot-message">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                    <i className="fas fa-robot text-sm text-white"></i>
                  </div>
                  <div className="bg-secondary text-white p-3 rounded-lg rounded-tl-none">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef}></div>
            </div>
            
            <CardContent className="p-4 border-t">
              <form className="flex" onSubmit={handleSubmit}>
                <Input 
                  type="text" 
                  placeholder="Ask about wildlife conservation..." 
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-r-lg transition-colors"
                  disabled={isLoading}
                >
                  <i className="fas fa-paper-plane"></i>
                </Button>
              </form>
              <div className="flex flex-wrap gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm" 
                  className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full transition-colors"
                  onClick={() => handleSuggestedQuestion("How can I help endangered species?")}
                >
                  How can I help endangered species?
                </Button>
                <Button
                  variant="outline"
                  size="sm" 
                  className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full transition-colors"
                  onClick={() => handleSuggestedQuestion("What animals are most at risk?")}
                >
                  What animals are most at risk?
                </Button>
                <Button
                  variant="outline"
                  size="sm" 
                  className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full transition-colors"
                  onClick={() => handleSuggestedQuestion("Indigenous conservation practices?")}
                >
                  Indigenous conservation practices?
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-10 p-6 rounded-xl">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-hands-helping text-xl"></i>
              </div>
              <h3 className="font-heading font-bold text-xl mb-2">Support Conservation</h3>
              <p className="mb-3 text-white text-opacity-90">Learn how you can contribute to global wildlife protection efforts</p>
              <Button
                variant="link" 
                className="inline-flex items-center text-accent hover:text-white"
              >
                Find Organizations <i className="fas fa-arrow-right ml-1"></i>
              </Button>
            </div>
            
            <div className="bg-white bg-opacity-10 p-6 rounded-xl">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-book-open text-xl"></i>
              </div>
              <h3 className="font-heading font-bold text-xl mb-2">Educational Resources</h3>
              <p className="mb-3 text-white text-opacity-90">Discover books, documentaries, and online courses about wildlife</p>
              <Button
                variant="link" 
                className="inline-flex items-center text-accent hover:text-white"
              >
                Browse Resources <i className="fas fa-arrow-right ml-1"></i>
              </Button>
            </div>
            
            <div className="bg-white bg-opacity-10 p-6 rounded-xl">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-globe-americas text-xl"></i>
              </div>
              <h3 className="font-heading font-bold text-xl mb-2">Global Initiatives</h3>
              <p className="mb-3 text-white text-opacity-90">Explore international efforts to protect endangered species</p>
              <Button
                variant="link" 
                className="inline-flex items-center text-accent hover:text-white"
              >
                View Initiatives <i className="fas fa-arrow-right ml-1"></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConservationChatbot;
