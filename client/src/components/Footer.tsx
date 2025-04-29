import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Subscription Successful",
      description: "Thank you for subscribing to our newsletter!",
    });
    
    setEmail('');
  };

  // Handle smooth scrolling for anchor links
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="bg-secondary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <i className="fas fa-paw text-accent text-2xl mr-2"></i>
              <h3 className="font-heading font-bold text-xl">WildCulture Quest</h3>
            </div>
            <p className="mb-4 opacity-90">Discover wildlife and cultures around the world through interactive experiences.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-accent transition-colors" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
              <a href="#" className="text-white hover:text-accent transition-colors" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-white hover:text-accent transition-colors" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-white hover:text-accent transition-colors" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection('home')}
                  className="hover:text-accent transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('animals')}
                  className="hover:text-accent transition-colors"
                >
                  Endangered Species
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('ar-experience')}
                  className="hover:text-accent transition-colors"
                >
                  AR Experience
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('challenges')}
                  className="hover:text-accent transition-colors"
                >
                  Cultural Challenges
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('conservation')}
                  className="hover:text-accent transition-colors"
                >
                  Conservation
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-accent transition-colors">Conservation Partners</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Educational Materials</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Teachers' Guide</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Research Publications</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Developer API</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Newsletter</h4>
            <p className="mb-3 opacity-90">Subscribe for updates on new species, features and conservation news.</p>
            <form className="mb-3" onSubmit={handleSubmit}>
              <div className="flex">
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-3 py-2 bg-white bg-opacity-10 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-accent focus:bg-opacity-20 flex-grow text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" className="bg-accent hover:bg-orange-500 text-white px-4 py-2 rounded-r-lg transition-colors">
                  <i className="fas fa-paper-plane"></i>
                </Button>
              </div>
            </form>
            <p className="text-sm opacity-70">We respect your privacy and will never share your information.</p>
          </div>
        </div>
        
        <div className="border-t border-white border-opacity-20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm opacity-70 mb-4 md:mb-0">© {new Date().getFullYear()} WildCulture Quest. All rights reserved.</p>
          <div className="flex space-x-4 text-sm opacity-70">
            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-accent transition-colors">Cookie Policy</a>
            <a href="#" className="hover:text-accent transition-colors">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
