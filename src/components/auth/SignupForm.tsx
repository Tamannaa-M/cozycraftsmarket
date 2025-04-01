
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const SignupForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      toast.error("Please agree to terms and conditions");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate signup API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Account created successfully!");
      navigate("/login");
    }, 1500);
  };

  const handleSocialSignup = (provider: string) => {
    if (!agreeTerms) {
      toast.error("Please agree to terms and conditions");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate social signup
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Account created with ${provider}!`);
      navigate("/");
    }, 1500);
  };

  return (
    <div className="max-w-md w-full mx-auto space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Create your account</h1>
        <p className="text-gray-600 mt-2">Join our community of craft enthusiasts</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          type="button" 
          className="w-full" 
          onClick={() => handleSocialSignup("Google")}
          disabled={isLoading}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </Button>
        <Button 
          variant="outline" 
          type="button" 
          className="w-full" 
          onClick={() => handleSocialSignup("Facebook")}
          disabled={isLoading}
        >
          <svg className="w-5 h-5 mr-2 text-blue-600 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Facebook
        </Button>
      </div>
      
      <div className="flex items-center gap-4 text-sm">
        <div className="h-px bg-gray-300 flex-grow"></div>
        <span className="text-gray-500">or continue with</span>
        <div className="h-px bg-gray-300 flex-grow"></div>
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
          />
          <p className="text-xs text-gray-500">
            Password must be at least 8 characters long
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
