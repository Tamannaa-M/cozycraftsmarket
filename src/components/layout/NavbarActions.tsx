
import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserMenu from "./UserMenu";
import CartDrawer from "@/components/cart/CartDrawer";

const NavbarActions = () => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="hidden md:flex">
        <Search size={22} />
      </Button>
      <CartDrawer />
      <UserMenu />
    </div>
  );
};

export default NavbarActions;
