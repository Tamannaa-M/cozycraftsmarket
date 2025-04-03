
import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  isNew?: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
  };
  
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    
    if (!isWishlisted) {
      toast.success(`${product.name} added to wishlist!`);
    } else {
      toast.info(`${product.name} removed from wishlist`);
    }
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <Link to={`/product/${product.id}`}>
      <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 card-hover">
        <div className="relative h-64 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {product.isNew && (
            <div className="absolute top-4 left-4 bg-royal-purple text-white text-xs font-medium px-2 py-1 rounded">
              New Arrival
            </div>
          )}
          
          <div className="absolute top-4 right-4">
            <Button 
              size="icon" 
              variant="secondary"
              className="rounded-full bg-white/80 hover:bg-white"
              onClick={handleToggleWishlist}
            >
              <Heart 
                size={18} 
                className={isWishlisted ? "fill-royal-purple text-royal-purple" : "text-gray-600"}
              />
            </Button>
          </div>
          
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent h-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Button 
              className="w-full bg-white text-royal-purple hover:bg-royal-light hover:text-royal-purple"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={16} className="mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-gray-900 group-hover:text-royal-purple transition-colors">
              {product.name}
            </h3>
            <span className="font-semibold text-royal-purple">{formatPrice(product.price)}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Star size={16} className="fill-amber-400 text-amber-400" />
            <span className="text-sm text-gray-500">{product.rating.toFixed(1)}</span>
            <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600 capitalize">
              {product.category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
