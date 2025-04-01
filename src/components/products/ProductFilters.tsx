
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ProductFiltersProps {
  onFilterChange: (filters: any) => void;
}

const categories = [
  { id: "toys", name: "Toys" },
  { id: "accessories", name: "Accessories" },
  { id: "gift-sets", name: "Gift Sets" },
  { id: "baby", name: "Baby Items" },
  { id: "decor", name: "Home Decor" },
];

const materials = [
  { id: "wood", name: "Wood" },
  { id: "cotton", name: "Organic Cotton" },
  { id: "wool", name: "Wool" },
  { id: "felt", name: "Felt" },
  { id: "bamboo", name: "Bamboo" },
];

const ages = [
  { id: "0-1", name: "0-1 years" },
  { id: "1-3", name: "1-3 years" },
  { id: "3-5", name: "3-5 years" },
  { id: "5-7", name: "5-7 years" },
  { id: "7+", name: "7+ years" },
];

const ProductFilters = ({ onFilterChange }: ProductFiltersProps) => {
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [selectedAge, setSelectedAge] = useState<string | null>(null);

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    }
  };

  const handleMaterialChange = (material: string, checked: boolean) => {
    if (checked) {
      setSelectedMaterials([...selectedMaterials, material]);
    } else {
      setSelectedMaterials(selectedMaterials.filter((m) => m !== material));
    }
  };

  const handleAgeChange = (age: string) => {
    setSelectedAge(age === selectedAge ? null : age);
  };

  const applyFilters = () => {
    onFilterChange({
      priceRange,
      categories: selectedCategories,
      materials: selectedMaterials,
      sortBy,
      age: selectedAge,
    });
  };

  const clearFilters = () => {
    setPriceRange([0, 100]);
    setSelectedCategories([]);
    setSelectedMaterials([]);
    setSortBy("featured");
    setSelectedAge(null);
    
    onFilterChange({
      priceRange: [0, 100],
      categories: [],
      materials: [],
      sortBy: "featured",
      age: null,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-4">Filters</h3>
        <div className="flex justify-between">
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
          <Button size="sm" className="bg-royal-purple hover:bg-royal-dark" onClick={applyFilters}>
            Apply
          </Button>
        </div>
      </div>

      <Accordion type="multiple" defaultValue={["price", "category", "sort"]}>
        <AccordionItem value="price">
          <AccordionTrigger className="text-md font-medium">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                value={priceRange}
                min={0}
                max={100}
                step={5}
                onValueChange={handlePriceChange}
                className="mt-6"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}+</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="category">
          <AccordionTrigger className="text-md font-medium">Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category.id}`} 
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) => 
                      handleCategoryChange(category.id, checked === true)
                    }
                  />
                  <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="material">
          <AccordionTrigger className="text-md font-medium">Material</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {materials.map((material) => (
                <div key={material.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`material-${material.id}`} 
                    checked={selectedMaterials.includes(material.id)}
                    onCheckedChange={(checked) => 
                      handleMaterialChange(material.id, checked === true)
                    }
                  />
                  <Label htmlFor={`material-${material.id}`}>{material.name}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="age">
          <AccordionTrigger className="text-md font-medium">Age Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {ages.map((age) => (
                <div key={age.id} className="flex items-center space-x-2">
                  <RadioGroup value={selectedAge || ""} className="flex flex-col gap-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={age.id} 
                        id={`age-${age.id}`} 
                        onClick={() => handleAgeChange(age.id)}
                      />
                      <Label htmlFor={`age-${age.id}`}>{age.name}</Label>
                    </div>
                  </RadioGroup>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sort">
          <AccordionTrigger className="text-md font-medium">Sort By</AccordionTrigger>
          <AccordionContent>
            <RadioGroup 
              defaultValue="featured" 
              value={sortBy}
              className="flex flex-col gap-2"
              onValueChange={setSortBy}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="featured" id="sort-featured" />
                <Label htmlFor="sort-featured">Featured</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="newest" id="sort-newest" />
                <Label htmlFor="sort-newest">Newest</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price-low" id="sort-price-low" />
                <Label htmlFor="sort-price-low">Price: Low to High</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price-high" id="sort-price-high" />
                <Label htmlFor="sort-price-high">Price: High to Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rating" id="sort-rating" />
                <Label htmlFor="sort-rating">Highest Rated</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProductFilters;
