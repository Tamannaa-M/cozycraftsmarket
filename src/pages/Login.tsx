
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoginForm from "@/components/auth/LoginForm";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/"); // Redirect to home if already logged in
      }
    };
    
    checkSession();
  }, [navigate]);

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
                    <h2 className="text-2xl font-bold mb-4">Welcome back to our handcrafted world</h2>
                    <p className="text-gray-600">
                      Log in to your account to access your wishlist, track orders, and explore our curated collection.
                    </p>
                  </div>
                  <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-royal-purple opacity-10 rounded-full" />
                  <div className="absolute -top-16 -right-16 w-48 h-48 bg-royal-silver opacity-20 rounded-full" />
                </div>
              </div>
              <div className="p-8 md:p-12">
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
