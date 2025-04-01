
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">About CozyMarket</h1>
            
            <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <p className="mb-4 text-gray-700">
                CozyMarket was founded in 2020 with a simple mission: to bring handcrafted quality products 
                to people's homes while supporting local artisans and traditional craftsmanship. 
              </p>
              <p className="mb-4 text-gray-700">
                What started as a small collection of handmade toys has grown into a marketplace featuring 
                a variety of artisanal products, each with its own unique story and made with love and care.
              </p>
              <p className="text-gray-700">
                We believe in sustainable practices, fair trade, and preserving traditional crafts that have 
                been passed down through generations. Every product in our store is carefully selected to 
                ensure it meets our high standards for quality, authenticity, and ethical production.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">Our Values</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-royal-light rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-royal-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <h3 className="font-bold mb-2">Sustainability</h3>
                  <p className="text-gray-600">We prioritize eco-friendly materials and sustainable production methods.</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-royal-light rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-royal-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  </div>
                  <h3 className="font-bold mb-2">Artisan Support</h3>
                  <p className="text-gray-600">We ensure fair compensation and support for artisans and their communities.</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-royal-light rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-royal-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="font-bold mb-2">Quality</h3>
                  <p className="text-gray-600">Every product is crafted with attention to detail and built to last.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Our Team</h2>
              <p className="mb-6 text-gray-700">
                We're a small, dedicated team passionate about handcrafted goods and ethical commerce. 
                Our team members work directly with artisans around the country to bring their creations 
                to a wider audience while preserving their cultural significance.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <h3 className="font-bold">Priya Sharma</h3>
                  <p className="text-gray-600">Founder & CEO</p>
                </div>
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <h3 className="font-bold">Raj Patel</h3>
                  <p className="text-gray-600">Head of Artisan Relations</p>
                </div>
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <h3 className="font-bold">Ananya Gupta</h3>
                  <p className="text-gray-600">Creative Director</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
