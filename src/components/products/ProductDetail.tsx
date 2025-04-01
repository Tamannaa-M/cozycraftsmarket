
import { useState } from "react";
import { Heart, ShoppingCart, Check, Share2, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Mock product data - in a real app this would come from an API
const product = {
  id: 1,
  name: "Handcrafted Wooden Train Set",
  price: 34.99,
  rating: 4.8,
  reviewCount: 124,
  description: "This beautiful wooden train set is handcrafted from sustainable maple wood. Each piece is carefully sanded and finished with non-toxic, child-safe paints and sealants. The set includes a locomotive, two passenger cars, and tracks that form a complete circuit.",
  features: [
    "Made from sustainably harvested maple wood",
    "Non-toxic, water-based finishes",
    "Smooth edges safe for little hands",
    "Compatible with most wooden train track systems",
    "Designed for ages 3 and up"
  ],
  images: [
    "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516981879613-9f5da904015f?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1565723298747-55d0656f3048?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1557181003-139b8e44b1ec?q=80&w=500&auto=format&fit=crop"
  ],
  stock: 15,
  sku: "WT-1001",
  category: "Toys",
  materials: ["Maple Wood", "Non-toxic Paint"],
  dimensions: "Locomotive: 4\" x 2\" x 2.5\", Track: 24\" diameter when assembled",
  careInstructions: "Wipe clean with a damp cloth. Do not submerge in water."
};

interface ProductDetailProps {
  productId?: string;
}

const ProductDetail = ({ productId }: ProductDetailProps) => {
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    toast.success(`${product.name} added to cart!`);
  };
  
  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    
    if (!isWishlisted) {
      toast.success(`${product.name} added to wishlist!`);
    } else {
      toast.info(`${product.name} removed from wishlist`);
    }
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="container-custom py-12">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Product Images */}
        <div className="w-full lg:w-1/2">
          <div className="mb-4 rounded-lg overflow-hidden bg-gray-50 h-96 flex items-center justify-center">
            <img 
              src={mainImage} 
              alt={product.name} 
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden ${
                  image === mainImage ? "ring-2 ring-royal-purple" : "ring-1 ring-gray-200"
                }`}
                onClick={() => setMainImage(image)}
              >
                <img 
                  src={image} 
                  alt={`${product.name} view ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div className="w-full lg:w-1/2">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm mb-2">
              <span className="text-gray-500">Home</span>
              <ChevronRight size={14} className="text-gray-400" />
              <span className="text-gray-500">Toys</span>
              <ChevronRight size={14} className="text-gray-400" />
              <span>Wooden Toys</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">{product.rating} ({product.reviewCount} reviews)</span>
            </div>
            <div className="text-2xl font-bold text-royal-purple mb-6">${product.price}</div>
            <p className="text-gray-600 mb-6">{product.description}</p>
          </div>
          
          <div className="border-t border-b py-6 space-y-4">
            <div className="flex items-center">
              <span className="w-24 text-gray-600">Availability:</span>
              <span className="flex items-center text-green-600">
                <Check size={16} className="mr-1" />
                In Stock ({product.stock} available)
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-gray-600">SKU:</span>
              <span>{product.sku}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-gray-600">Category:</span>
              <span>{product.category}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-gray-600">Materials:</span>
              <div className="flex flex-wrap gap-1">
                {product.materials.map((material, index) => (
                  <span 
                    key={index} 
                    className="bg-royal-light px-2 py-1 rounded-md text-xs text-royal-purple"
                  >
                    {material}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="py-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-md">
                <button 
                  className="px-3 py-2 border-r hover:bg-gray-100 transition-colors"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-6 py-2">{quantity}</span>
                <button 
                  className="px-3 py-2 border-l hover:bg-gray-100 transition-colors"
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
              <Button className="flex-grow btn-primary" onClick={handleAddToCart}>
                <ShoppingCart size={18} className="mr-2" />
                Add to Cart
              </Button>
            </div>
            
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="flex-1 btn-outline" 
                onClick={handleToggleWishlist}
              >
                <Heart 
                  size={18} 
                  className={`mr-2 ${isWishlisted ? "fill-royal-purple" : ""}`} 
                />
                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 btn-outline"
                onClick={handleShare}
              >
                <Share2 size={18} className="mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="p-6 border rounded-b-md">
            <h3 className="text-xl font-semibold mb-4">Product Features</h3>
            <ul className="space-y-2 mb-6">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check size={18} className="mr-2 text-royal-purple flex-shrink-0 mt-1" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-600">
              Each of our wooden toys is handcrafted with attention to detail and quality. Our artisans take pride in creating heirloom-quality toys that can be passed down through generations. We use only the finest materials and finishes to ensure that our toys are not only beautiful but also safe and durable.
            </p>
          </TabsContent>
          <TabsContent value="specs" className="p-6 border rounded-b-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Dimensions</h3>
                <p className="text-gray-600 mb-4">{product.dimensions}</p>
                
                <h3 className="text-xl font-semibold mb-4">Materials</h3>
                <ul className="space-y-2 mb-4">
                  {product.materials.map((material, index) => (
                    <li key={index} className="flex items-start">
                      <Check size={18} className="mr-2 text-royal-purple flex-shrink-0 mt-1" />
                      <span>{material}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Care Instructions</h3>
                <p className="text-gray-600 mb-4">{product.careInstructions}</p>
                
                <h3 className="text-xl font-semibold mb-4">Safety</h3>
                <p className="text-gray-600">
                  This product meets or exceeds all safety standards for children's toys. All materials and finishes are non-toxic and child-safe. Small parts may present a choking hazard for children under 3 years of age.
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="p-6 border rounded-b-md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold mb-1">Customer Reviews</h3>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"} 
                      />
                    ))}
                  </div>
                  <span className="text-sm">Based on {product.reviewCount} reviews</span>
                </div>
              </div>
              <Button>Write a Review</Button>
            </div>
            
            <div className="space-y-6">
              <div className="border-t pt-6">
                <div className="flex justify-between mb-2">
                  <h4 className="font-semibold">Beautiful craftsmanship</h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={i < 5 ? "fill-amber-400 text-amber-400" : "text-gray-300"} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">By Sarah J. on May 12, 2023</p>
                <p className="text-gray-600">
                  This train set is absolutely beautiful. The quality of the wood and the craftsmanship is exceptional. My son loves playing with it and I love that it's made from sustainable materials.
                </p>
              </div>
              
              <div className="border-t pt-6">
                <div className="flex justify-between mb-2">
                  <h4 className="font-semibold">Worth every penny</h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={i < 4 ? "fill-amber-400 text-amber-400" : "text-gray-300"} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">By Michael T. on April 3, 2023</p>
                <p className="text-gray-600">
                  I was hesitant about the price at first, but now that I've seen the quality, I understand why it costs what it does. This is a toy that will last for generations.
                </p>
              </div>
              
              <div className="text-center mt-8">
                <Button variant="outline">Load More Reviews</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetail;
