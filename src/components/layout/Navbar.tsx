
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart, Heart, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavbarActions from "./NavbarActions";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm py-4 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-playfair font-bold text-royal-purple">CozyMarket</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-medium hover:text-royal-purple transition-colors">
              Home
            </Link>
            <Link to="/products" className="font-medium hover:text-royal-purple transition-colors">
              Shop
            </Link>
            <Link to="/about" className="font-medium hover:text-royal-purple transition-colors">
              About
            </Link>
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/search">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-royal-light">
                <Search size={20} className="text-royal-purple" />
              </Button>
            </Link>
            <Link to="/profile/wishlist">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-royal-light">
                <Heart size={20} className="text-royal-purple" />
              </Button>
            </Link>
            <NavbarActions />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="text-royal-purple">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md p-4 flex flex-col space-y-4 animate-fade-in">
          <Link to="/" className="font-medium py-2 hover:text-royal-purple transition-colors" onClick={toggleMobileMenu}>
            Home
          </Link>
          <Link to="/products" className="font-medium py-2 hover:text-royal-purple transition-colors" onClick={toggleMobileMenu}>
            Shop
          </Link>
          <Link to="/about" className="font-medium py-2 hover:text-royal-purple transition-colors" onClick={toggleMobileMenu}>
            About
          </Link>
          <div className="flex items-center justify-around pt-2 border-t">
            <Link to="/search">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-royal-light">
                <Search size={20} className="text-royal-purple" />
              </Button>
            </Link>
            <Link to="/profile/wishlist">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-royal-light">
                <Heart size={20} className="text-royal-purple" />
              </Button>
            </Link>
            <NavbarActions />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
