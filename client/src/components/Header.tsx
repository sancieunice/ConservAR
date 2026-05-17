import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAudio } from "@/context/AudioContext";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isPlaying, togglePlay } = useAudio();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Handle scrolling effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle smooth scrolling for anchor links
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <header className={`bg-primary text-white shadow-md sticky top-0 z-50 ${scrolled ? 'bg-opacity-95' : ''}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <i className="fas fa-paw text-accent text-3xl mr-2"></i>
          <h1 className="font-heading font-bold text-2xl">ConservAR</h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center">
          <button
            onClick={() => scrollToSection('home')}
            className="hover:text-accent transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('animals')}
            className="hover:text-accent transition-colors"
          >
            Animals
          </button>
          <button
            onClick={() => scrollToSection('ar-experience')}
            className="hover:text-accent transition-colors"
          >
            AR Experience
          </button>
          <button
            onClick={() => scrollToSection('challenges')}
            className="hover:text-accent transition-colors"
          >
            Challenges
          </button>
          <button
            onClick={() => scrollToSection('conservation')}
            className="hover:text-accent transition-colors"
          >
            Conservation
          </button>
          <button
            className="flex items-center text-accent bg-white bg-opacity-20 rounded-full py-1 px-3 hover:bg-opacity-30 transition-all"
            onClick={togglePlay}
          >
            <div className="sound-wave mr-2">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span>{isPlaying ? 'Music On' : 'Music Off'}</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-xl"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="bg-primary border-t border-primary-700 py-2">
            <div className="container mx-auto px-4 flex flex-col space-y-3">
              <button
                onClick={() => scrollToSection('home')}
                className="py-2 hover:text-accent transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('animals')}
                className="py-2 hover:text-accent transition-colors"
              >
                Animals
              </button>
              <button
                onClick={() => scrollToSection('ar-experience')}
                className="py-2 hover:text-accent transition-colors"
              >
                AR Experience
              </button>
              <button
                onClick={() => scrollToSection('challenges')}
                className="py-2 hover:text-accent transition-colors"
              >
                Challenges
              </button>
              <button
                onClick={() => scrollToSection('conservation')}
                className="py-2 hover:text-accent transition-colors"
              >
                Conservation
              </button>
              <button
                className="flex items-center text-accent bg-white bg-opacity-20 rounded-full py-1 px-3 hover:bg-opacity-30 transition-all w-min"
                onClick={togglePlay}
              >
                <div className="sound-wave mr-2">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span>{isPlaying ? 'Music On' : 'Music Off'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
