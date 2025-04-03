
import * as React from "react";
import { Search, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserMenu from "./UserMenu";
import CartDrawer from "@/components/cart/CartDrawer";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

const NavbarActions = () => {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to="/search">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-royal-light">
                <Search size={22} className="text-royal-purple" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Search</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link to="/profile/wishlist">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-royal-light">
                <Heart size={22} className="text-royal-purple" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Wishlist</p>
          </TooltipContent>
        </Tooltip>

        <CartDrawer />
        <UserMenu />
      </div>
    </TooltipProvider>
  );
};

export default NavbarActions;
