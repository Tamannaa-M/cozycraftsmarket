
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductFilters from "@/components/products/ProductFilters";
import ProductGrid from "@/components/products/ProductGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<any>({});
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const location = useLocation();

  // Parse category from URL query params
  const queryParams = new URLSearchParams(location.search);
  const categoryFromQuery = queryParams.get("category");

  // Apply category filter from URL if present
  useState(() => {
    if (categoryFromQuery) {
      const newFilters = {
        ...filters,
        categories: [categoryFromQuery],
      };
      setFilters(newFilters);
      setIsFilterApplied(true);
    }
  });

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setIsFilterApplied(Object.keys(newFilters).some(key => {
      if (Array.isArray(newFilters[key])) {
        return newFilters[key].length > 0;
      }
      return newFilters[key] !== null && newFilters[key] !== undefined;
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is already applied through the state
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="container-custom py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Shop Our Collection</h1>
            <p className="text-gray-600">
              Discover our handcrafted toys and accessories, each made with love and care
            </p>
          </div>

          <div className="flex justify-between items-center mb-8">
            <form onSubmit={handleSearch} className="relative flex-grow max-w-md">
              <Input
                type="search"
                placeholder="Search products..."
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-0 h-full"
              >
                <Search size={18} />
              </Button>
            </form>
            
            <div className="flex items-center gap-2">
              {isFilterApplied && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setFilters({});
                    setIsFilterApplied(false);
                  }}
                  className="flex items-center gap-1"
                >
                  <X size={16} />
                  Clear Filters
                </Button>
              )}
              
              {/* Mobile filter button */}
              <div className="block md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Filter size={16} />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full sm:max-w-md overflow-auto">
                    <SheetHeader className="mb-4">
                      <SheetTitle>Product Filters</SheetTitle>
                      <SheetDescription>
                        Refine your product search
                      </SheetDescription>
                    </SheetHeader>
                    <ProductFilters onFilterChange={handleFilterChange} />
                    <div className="mt-4 flex justify-end">
                      <SheetClose asChild>
                        <Button className="bg-royal-purple hover:bg-royal-dark">
                          Apply Filters
                        </Button>
                      </SheetClose>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Desktop sidebar filters */}
            <div className="hidden md:block w-full md:w-64 shrink-0">
              <ProductFilters onFilterChange={handleFilterChange} />
            </div>
            
            {/* Products grid */}
            <div className="flex-grow">
              <ProductGrid filters={filters} searchQuery={searchQuery} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
