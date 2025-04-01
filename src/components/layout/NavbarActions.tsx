import * as React from "react";
import { Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserMenu from "./UserMenu";
import CartDrawer from "@/components/cart/CartDrawer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
const NavbarActions = () => {
  return <div className="flex items-center gap-2">
      <Link to="/search">
        
      </Link>
      <CartDrawer />
      <UserMenu />
    </div>;
};
export default NavbarActions;