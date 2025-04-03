
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const SignupForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      toast.error("Please agree to terms and conditions");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (error) {
        throw error;
      }

      console.log("Signup success:", data);
      toast.success("Account created successfully! Please check your email for verification.");
      navigate("/login");
      
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Create your account</h1>
        <p className="text-gray-600 mt-2">Join our community of craft enthusiasts</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first-name">First Name</Label>
            <Input
              id="first-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last-name">Last Name</Label>
            <Input
              id="last-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <p className="text-xs text-gray-500">
            Password must be at least 6 characters long
          </p>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="terms" 
            checked={agreeTerms}
            onCheckedChange={(checked) => setAgreeTerms(checked === true)}
          />
          <Label htmlFor="terms" className="text-sm cursor-pointer">
            I agree to the{" "}
            <Link to="/terms" className="text-royal-purple hover:underline">
              Terms of Service
            </Link>
            {" "}and{" "}
            <Link to="/privacy" className="text-royal-purple hover:underline">
              Privacy Policy
            </Link>
          </Label>
        </div>
        
        <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>
      
      <div className="text-center text-sm">
        <span className="text-gray-600">Already have an account?</span>{" "}
        <Link to="/login" className="text-royal-purple font-medium hover:underline">
          Log in
        </Link>
      </div>
    </div>
  );
};

export default SignupForm;
