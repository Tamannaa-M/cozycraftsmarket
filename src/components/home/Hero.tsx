
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative bg-royal-light overflow-hidden">
      <div className="container-custom relative z-10 py-20 md:py-32">
        <div className="max-w-3xl animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gradient">Handcrafted</span> with Love, <br />
            Made to Cherish
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-700">
            Discover unique, artisanal toys and accessories crafted by skilled artisans
            for the special moments in your life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/products">
              <Button className="btn-primary w-full sm:w-auto">
                Shop Collection
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" className="btn-outline w-full sm:w-auto">
                Our Story
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-royal-purple opacity-10 rounded-full" />
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-royal-silver opacity-20 rounded-full" />
    </div>
  );
};

export default Hero;
