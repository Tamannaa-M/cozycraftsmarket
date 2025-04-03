
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import ProductGrid from "@/components/products/ProductGrid";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // Here you would typically make an API call to search for products
    // For demo purposes, we'll just simulate a search delay
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto mb-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Search Products</h1>
            
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search for handcrafted treasures..."
                className="pr-12 py-6 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                className="absolute right-1 top-1 bottom-1"
                disabled={isSearching || !searchQuery.trim()}
              >
                <SearchIcon className="mr-2" size={20} />
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </form>
          </div>
          
          {searchQuery && (
            <div className="mb-6">
              <h2 className="text-xl font-medium mb-4">
                {isSearching 
                  ? `Searching for "${searchQuery}"...` 
                  : `Search results for "${searchQuery}"`
                }
              </h2>
              <ProductGrid />
            </div>
          )}
          
          {!searchQuery && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-medium mb-4">Discover unique handcrafted treasures</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Search for products by name, description, or category to find the perfect handcrafted item for your home or as a gift.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Search;
