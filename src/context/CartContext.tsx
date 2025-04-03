
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useAuth } from "@/context/AuthContext";

export interface CartItem {
  id: number | string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  customizations?: Record<string, any>;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number, customizations?: Record<string, any>) => void;
  removeFromCart: (itemId: number | string) => void;
  updateQuantity: (itemId: number | string, quantity: number) => void;
  updateItemCustomizations: (itemId: number | string, customizations: Record<string, any>) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  syncCartWithUser: (user: User | null) => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useAuth();

  // Load cart from localStorage on initial render
  useEffect(() => {
    if (user) {
      // If user is logged in, try to get their saved cart
      const userCartKey = `cart-${user.id}`;
      const savedCart = localStorage.getItem(userCartKey);
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error("Failed to parse user cart from localStorage:", error);
          localStorage.removeItem(userCartKey);
        }
      }
    } else {
      // If no user, try to load anonymous cart
      const savedCart = localStorage.getItem("anonymous-cart");
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error("Failed to parse anonymous cart from localStorage:", error);
          localStorage.removeItem("anonymous-cart");
        }
      }
    }
  }, [user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart-${user.id}`, JSON.stringify(cartItems));
    } else {
      localStorage.setItem("anonymous-cart", JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  // Set up auth state listener to sync cart when user logs in/out
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        if (event === 'SIGNED_IN' && session?.user) {
          // Defer to avoid circular dependency issues
          setTimeout(() => {
            syncCartWithUser(session.user);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          // Clear cart when user signs out
          setCartItems([]);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const addToCart = (item: Omit<CartItem, "quantity">, quantity = 1, customizations = {}) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Item already in cart, increment quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
          customizations: customizations || updatedItems[existingItemIndex].customizations
        };
        return updatedItems;
      } else {
        // Add new item to cart
        return [...prevItems, { ...item, quantity, customizations }];
      }
    });
    
    toast.success(`${item.name} added to cart`);
  };

  const removeFromCart = (itemId: number | string) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === itemId);
      if (itemToRemove) {
        toast.info(`${itemToRemove.name} removed from cart`);
      }
      return prevItems.filter(item => item.id !== itemId);
    });
  };

  const updateQuantity = (itemId: number | string, quantity: number) => {
    if (quantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const updateItemCustomizations = (itemId: number | string, customizations: Record<string, any>) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, customizations } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info("Cart cleared");
  };

  // Calculate total items and subtotal
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Sync cart with user
  const syncCartWithUser = async (user: User | null) => {
    if (!user) return;
    
    // When user logs in, merge anonymous cart with user's saved cart
    const userCartKey = `cart-${user.id}`;
    const savedUserCart = localStorage.getItem(userCartKey);
    
    if (savedUserCart) {
      try {
        const parsedUserCart = JSON.parse(savedUserCart);
        
        // If we have both anonymous items and saved user items, merge them
        if (cartItems.length > 0 && parsedUserCart.length > 0) {
          const mergedCart = [...parsedUserCart];
          
          // Add items from anonymous cart that don't exist in user cart
          cartItems.forEach(anonItem => {
            const existingItemIndex = mergedCart.findIndex(item => item.id === anonItem.id);
            
            if (existingItemIndex >= 0) {
              // Item exists, update quantity
              mergedCart[existingItemIndex].quantity += anonItem.quantity;
            } else {
              // Item doesn't exist, add it
              mergedCart.push(anonItem);
            }
          });
          
          setCartItems(mergedCart);
        } else if (cartItems.length === 0 && parsedUserCart.length > 0) {
          // If we only have saved user items, use those
          setCartItems(parsedUserCart);
        }
        // If we only have anonymous items, they're already in the state
      } catch (error) {
        console.error("Failed to parse or merge carts:", error);
      }
    }
    
    // Save the current cart state to the user's cart in localStorage
    localStorage.setItem(userCartKey, JSON.stringify(cartItems));
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateItemCustomizations,
      clearCart,
      totalItems,
      subtotal,
      isCartOpen,
      setIsCartOpen,
      syncCartWithUser
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
