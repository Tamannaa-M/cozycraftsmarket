
import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock testimonial data
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Parent",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    text: "The wooden train set I purchased for my son has become his favorite toy. The quality and craftsmanship are exceptional, and I love that it's made from sustainable materials.",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Grandfather",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    text: "I've been looking for toys that remind me of my own childhood, and CozyMarket's collection is perfect. The wooden puzzle I bought for my granddaughter is beautifully made and will last for generations.",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Interior Designer",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
    text: "As someone who values aesthetics, I appreciate that these toys aren't just functional but also beautiful. They complement my home decor while providing endless entertainment for my kids.",
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((current) => 
      current === 0 ? testimonials.length - 1 : current - 1
    );
  };

  return (
    <section className="section-padding bg-royal-light">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Customer Stories</h2>
          <p className="text-gray-600">What our customers are saying about our handcrafted items</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className={`
                transition-all duration-500 absolute top-0 left-0 w-full
                ${index === activeIndex ? "opacity-100 translate-x-0 z-10" : "opacity-0 translate-x-20 -z-10"}
              `}
              style={{ position: index === activeIndex ? 'relative' : 'absolute' }}
            >
              <div className="bg-white rounded-lg shadow-md p-8 relative">
                <Quote className="absolute top-4 left-4 text-royal-purple/20" size={40} />
                <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-6">
                  <div className="flex-shrink-0">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-royal-purple/20" 
                    />
                  </div>
                  <div>
                    <p className="text-gray-700 italic mb-4 relative z-10">"{testimonial.text}"</p>
                    <div>
                      <h4 className="font-bold text-royal-purple">{testimonial.name}</h4>
                      <p className="text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center gap-2 mt-8">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prevTestimonial}
              className="rounded-full hover:bg-royal-purple hover:text-white"
            >
              <ChevronLeft size={20} />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextTestimonial}
              className="rounded-full hover:bg-royal-purple hover:text-white"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
