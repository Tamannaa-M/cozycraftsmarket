
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "../products/ProductCard";

// Mock data for featured products
const featuredProducts = [
  {
    id: 1,
    name: "Handcrafted Wooden Train",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=500&auto=format&fit=crop",
    category: "toys",
    rating: 4.8,
    isNew: true
  },
  {
    id: 2,
    name: "Organic Cotton Teddy Bear",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1543886151-3bc2b944c718?q=80&w=500&auto=format&fit=crop",
    category: "toys",
    rating: 4.9,
    isNew: false
  },
  {
    id: 3,
    name: "Hand-Knitted Baby Blanket",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1632163374534-c7b255141add?q=80&w=500&auto=format&fit=crop",
    category: "accessories",
    rating: 5.0,
    isNew: true
  },
  {
    id: 4,
    name: "Wooden Stacking Blocks",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1696446702183-a67bacfb7545?q=80&w=500&auto=format&fit=crop",
    category: "toys",
    rating: 4.7,
    isNew: false
  },
  {
    id: 5,
    name: "Embroidered Baby Bib Set",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=500&auto=format&fit=crop",
    category: "accessories",
    rating: 4.6,
    isNew: true
  },
  {
    id: 6,
    name: "Handmade Wooden Puzzle",
    price: 27.99,
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=500&auto=format&fit=crop",
    category: "toys",
    rating: 4.8,
    isNew: false
  }
];

const FeaturedProducts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleProducts, setVisibleProducts] = useState<any[]>([]);
  const [itemsToShow, setItemsToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(1);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(2);
      } else {
        setItemsToShow(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const endIndex = currentIndex + itemsToShow;
    setVisibleProducts(featuredProducts.slice(currentIndex, endIndex));
  }, [currentIndex, itemsToShow]);

  const nextSlide = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex + itemsToShow <= featuredProducts.length) {
      setCurrentIndex(nextIndex);
    } else {
      setCurrentIndex(0);
    }
  };

  const prevSlide = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setCurrentIndex(prevIndex);
    } else {
      setCurrentIndex(featuredProducts.length - itemsToShow);
    }
  };

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Collection</h2>
            <p className="text-gray-600">Our most popular handcrafted items</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prevSlide}
              className="rounded-full hover:bg-royal-light hover:text-royal-purple"
            >
              <ChevronLeft size={20} />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextSlide}
              className="rounded-full hover:bg-royal-light hover:text-royal-purple"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/products">
            <Button className="btn-outline">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
