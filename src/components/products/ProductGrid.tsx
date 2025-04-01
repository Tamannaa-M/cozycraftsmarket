
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

// Mock product data
const allProducts = [
  {
    id: 1,
    name: "Handcrafted Wooden Train",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=500&auto=format&fit=crop",
    category: "toys",
    rating: 4.8,
    isNew: true,
    materials: ["wood"],
    ageRange: "3-5",
  },
  {
    id: 2,
    name: "Organic Cotton Teddy Bear",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1543886151-3bc2b944c718?q=80&w=500&auto=format&fit=crop",
    category: "toys",
    rating: 4.9,
    isNew: false,
    materials: ["cotton"],
    ageRange: "0-1",
  },
  {
    id: 3,
    name: "Hand-Knitted Baby Blanket",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1632163374534-c7b255141add?q=80&w=500&auto=format&fit=crop",
    category: "accessories",
    rating: 5.0,
    isNew: true,
    materials: ["wool"],
    ageRange: "0-1",
  },
  {
    id: 4,
    name: "Wooden Stacking Blocks",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1696446702183-a67bacfb7545?q=80&w=500&auto=format&fit=crop",
    category: "toys",
    rating: 4.7,
    isNew: false,
    materials: ["wood"],
    ageRange: "1-3",
  },
  {
    id: 5,
    name: "Embroidered Baby Bib Set",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=500&auto=format&fit=crop",
    category: "accessories",
    rating: 4.6,
    isNew: true,
    materials: ["cotton"],
    ageRange: "0-1",
  },
  {
    id: 6,
    name: "Handmade Wooden Puzzle",
    price: 27.99,
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=500&auto=format&fit=crop",
    category: "toys",
    rating: 4.8,
    isNew: false,
    materials: ["wood"],
    ageRange: "3-5",
  },
  {
    id: 7,
    name: "Felt Animal Mobile",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=500&auto=format&fit=crop",
    category: "decor",
    rating: 4.7,
    isNew: true,
    materials: ["felt"],
    ageRange: "0-1",
  },
  {
    id: 8,
    name: "Bamboo Baby Dinner Set",
    price: 32.99,
    image: "https://images.unsplash.com/photo-1584473457435-83958d32c42d?q=80&w=500&auto=format&fit=crop",
    category: "accessories",
    rating: 4.5,
    isNew: false,
    materials: ["bamboo"],
    ageRange: "1-3",
  },
  {
    id: 9,
    name: "Wooden Balance Board",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1697015210068-4403a5e29bea?q=80&w=500&auto=format&fit=crop",
    category: "toys",
    rating: 4.9,
    isNew: true,
    materials: ["wood"],
    ageRange: "3-5",
  },
  {
    id: 10,
    name: "Handcrafted Baby Gift Set",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=500&auto=format&fit=crop",
    category: "gift-sets",
    rating: 5.0,
    isNew: false,
    materials: ["cotton", "wood"],
    ageRange: "0-1",
  },
  {
    id: 11,
    name: "Crochet Stuffed Animals",
    price: 22.99,
    image: "https://images.unsplash.com/photo-1591030617255-43892ab87f19?q=80&w=500&auto=format&fit=crop",
    category: "toys",
    rating: 4.6,
    isNew: false,
    materials: ["wool"],
    ageRange: "1-3",
  },
  {
    id: 12,
    name: "Wooden Name Puzzle",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1516981879613-9f5da904015f?q=80&w=500&auto=format&fit=crop",
    category: "toys",
    rating: 4.8,
    isNew: true,
    materials: ["wood"],
    ageRange: "3-5",
  },
];

interface ProductGridProps {
  filters?: any;
  searchQuery?: string;
}

const ProductGrid = ({ filters, searchQuery }: ProductGridProps) => {
  const [filteredProducts, setFilteredProducts] = useState(allProducts);

  useEffect(() => {
    let filtered = [...allProducts];

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.category.toLowerCase().includes(query)
      );
    }

    // Apply other filters if provided
    if (filters) {
      // Price range filter
      if (filters.priceRange) {
        filtered = filtered.filter(
          product => 
            product.price >= filters.priceRange[0] && 
            product.price <= filters.priceRange[1]
        );
      }

      // Category filter
      if (filters.categories && filters.categories.length > 0) {
        filtered = filtered.filter(product => 
          filters.categories.includes(product.category)
        );
      }

      // Material filter
      if (filters.materials && filters.materials.length > 0) {
        filtered = filtered.filter(product => 
          product.materials.some((material: string) => 
            filters.materials.includes(material)
          )
        );
      }

      // Age range filter
      if (filters.age) {
        filtered = filtered.filter(product => 
          product.ageRange === filters.age
        );
      }

      // Sort
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case "price-low":
            filtered.sort((a, b) => a.price - b.price);
            break;
          case "price-high":
            filtered.sort((a, b) => b.price - a.price);
            break;
          case "rating":
            filtered.sort((a, b) => b.rating - a.rating);
            break;
          case "newest":
            filtered.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
            break;
          default:
            // featured - no specific sorting
            break;
        }
      }
    }

    setFilteredProducts(filtered);
  }, [filters, searchQuery]);

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No products found</h3>
        <p className="text-gray-500">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
