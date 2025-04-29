import { Button } from "@/components/ui/button";

const Hero = () => {
  // Function to scroll to a section
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
    <section id="home" className="relative bg-forest-pattern bg-cover bg-center">
      <div className="absolute inset-0 bg-secondary bg-opacity-70"></div>
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            Discover Wildlife & Culture Around the World
          </h1>
          <p className="text-xl text-white mb-8">
            Embark on a global adventure to learn about different cultures through their wildlife and conservation efforts
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              className="bg-accent hover:bg-orange-500 text-white font-bold px-8 py-6 rounded-full shadow-lg"
              onClick={() => scrollToSection('challenges')}
              size="lg"
            >
              Start Your Journey
            </Button>
            <Button 
              className="bg-white hover:bg-gray-100 text-primary font-bold px-8 py-6 rounded-full shadow-lg"
              onClick={() => scrollToSection('ar-experience')}
              variant="outline"
              size="lg"
            >
              Try AR Experience
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
