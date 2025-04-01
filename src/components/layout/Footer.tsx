
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-royal-light pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-royal-purple">CozyMarket</h3>
            <p className="text-gray-700 mb-4">
              Handcrafted toys and accessories made with love and care, bringing joy to homes worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-royal-purple transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-royal-purple transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-royal-purple transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-700 hover:text-royal-purple transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=toys" className="text-gray-700 hover:text-royal-purple transition-colors">
                  Toys
                </Link>
              </li>
              <li>
                <Link to="/products?category=accessories" className="text-gray-700 hover:text-royal-purple transition-colors">
                  Accessories
                </Link>
              </li>
              <li>
                <Link to="/products?category=gift-sets" className="text-gray-700 hover:text-royal-purple transition-colors">
                  Gift Sets
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">About</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-700 hover:text-royal-purple transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/artisans" className="text-gray-700 hover:text-royal-purple transition-colors">
                  Our Artisans
                </Link>
              </li>
              <li>
                <Link to="/sustainability" className="text-gray-700 hover:text-royal-purple transition-colors">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-700 hover:text-royal-purple transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-gray-700 hover:text-royal-purple transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-700 hover:text-royal-purple transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-700 hover:text-royal-purple transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-700 hover:text-royal-purple transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 text-center text-gray-600">
          <p>© {new Date().getFullYear()} CozyMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
