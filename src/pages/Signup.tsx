
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SignupForm from "@/components/auth/SignupForm";

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="hidden md:block bg-royal-light p-12 relative">
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <Link to="/" className="text-2xl font-bold text-royal-purple">
                      CozyMarket
                    </Link>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Join our community of craft enthusiasts</h2>
                    <p className="text-gray-600">
                      Create an account to discover unique handcrafted treasures, save your favorites, and connect with artisans.
                    </p>
                  </div>
                  <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-royal-purple opacity-10 rounded-full" />
                  <div className="absolute -top-16 -right-16 w-48 h-48 bg-royal-silver opacity-20 rounded-full" />
                </div>
              </div>
              <div className="p-8 md:p-12">
                <SignupForm />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Signup;
