
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Minus, Plus, Share2, ShoppingCart, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";

interface ProductActionsProps {
  product: {
    id: number | string;
    name: string;
    price: number;
    image: string;
    stock_quantity?: number;
  };
}

const ProductActions = ({ product }: ProductActionsProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && (!product.stock_quantity || newQuantity <= product.stock_quantity)) {
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      });
    }
  };
  
  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };
  
  const handleToggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      });
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on CozyMarket!`,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast.success("Link copied to clipboard!");
      }, () => {
        toast.error("Failed to copy link.");
      });
    }
  };
  
  const wishlistStatus = isInWishlist(product.id);

  return (
    <div className="space-y-6">
      <div className="flex items-baseline">
        <h2 className="text-3xl font-bold">{formatPrice(product.price)}</h2>
        {product.price !== 4999 && (
          <p className="ml-3 text-gray-500 line-through">{formatPrice(4999)}</p>
        )}
      </div>
      
      <div>
        <p className="text-sm text-gray-500 mb-1">Quantity</p>
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 rounded-full"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
          >
            <Minus size={16} />
          </Button>
          <span className="w-16 text-center font-medium">{quantity}</span>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 rounded-full"
            onClick={() => handleQuantityChange(1)}
            disabled={product.stock_quantity !== undefined && quantity >= product.stock_quantity}
          >
            <Plus size={16} />
          </Button>
          
          {product.stock_quantity !== undefined && (
            <span className="ml-4 text-sm text-gray-500">
              {product.stock_quantity} available
            </span>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <Button 
          className="flex-grow md:flex-grow-0"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
        <Button 
          variant="secondary"
          className="flex-grow md:flex-grow-0"
          onClick={handleBuyNow}
        >
          Buy Now
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          className={`h-10 w-10 rounded-full ${wishlistStatus ? 'bg-pink-50 text-pink-500 border-pink-200' : ''}`}
          onClick={handleToggleWishlist}
        >
          <Heart size={20} className={wishlistStatus ? 'fill-pink-500' : ''} />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          className="h-10 w-10 rounded-full"
          onClick={handleShare}
        >
          <Share2 size={20} />
        </Button>
      </div>
      
      <div className="border border-gray-200 rounded-md p-4">
        <div className="flex items-start">
          <div className="mr-3 flex-shrink-0">
            <Truck className="h-5 w-5 text-royal-purple" />
          </div>
          <div>
            <p className="text-sm font-medium">Free shipping across India</p>
            <p className="text-xs text-gray-500">Estimated delivery: 3-5 business days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductActions;
