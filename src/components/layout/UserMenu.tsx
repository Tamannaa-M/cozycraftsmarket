
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, 
  Package, 
  Heart, 
  LogOut, 
  LogIn, 
  UserPlus,
  Settings,
  ShoppingBag
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          {user ? (
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={user.user_metadata?.avatar_url} 
                alt={user.user_metadata?.name || "User avatar"} 
              />
              <AvatarFallback>
                {getInitials(user.user_metadata?.name)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <User size={22} />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {user ? (
          <>
            <div className="px-4 py-3 border-b">
              <p className="text-sm font-medium">
                {user.user_metadata?.name || user.email}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer flex gap-2 items-center">
                <User size={16} />
                <span>My Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/profile/orders" className="cursor-pointer flex gap-2 items-center">
                <Package size={16} />
                <span>My Orders</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/profile/wishlist" className="cursor-pointer flex gap-2 items-center">
                <Heart size={16} />
                <span>Wishlist</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/profile/settings" className="cursor-pointer flex gap-2 items-center">
                <Settings size={16} />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-red-600 flex gap-2 items-center" 
              onClick={handleSignOut}
              disabled={isLoading}
            >
              <LogOut size={16} />
              <span>{isLoading ? "Signing out..." : "Sign Out"}</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link to="/login" className="cursor-pointer flex gap-2 items-center">
                <LogIn size={16} />
                <span>Sign In</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/signup" className="cursor-pointer flex gap-2 items-center">
                <UserPlus size={16} />
                <span>Create Account</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/products" className="cursor-pointer flex gap-2 items-center">
                <ShoppingBag size={16} />
                <span>Browse Products</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
