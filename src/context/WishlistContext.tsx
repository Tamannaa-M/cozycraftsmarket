
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export interface WishlistItem {
  id: number | string;
  name: string;
  price: number;
  image: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (itemId: number | string) => void;
  isInWishlist: (itemId: number | string) => boolean;
  clearWishlist: () => void;
  syncWishlistWithUser: (user: User | null) => Promise<void>;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error("Failed to parse wishlist from localStorage:", error);
        localStorage.removeItem("wishlist");
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Set up auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          // Defer to avoid circular dependency issues
          setTimeout(() => {
            syncWishlistWithUser(session.user);
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        syncWishlistWithUser(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const addToWishlist = (item: WishlistItem) => {
    if (isInWishlist(item.id)) {
      toast.info(`${item.name} is already in your wishlist`);
      return;
    }
    
    setWishlistItems(prev => [...prev, item]);
    toast.success(`${item.name} added to wishlist`);
  };

  const removeFromWishlist = (itemId: number | string) => {
    setWishlistItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === itemId);
      if (itemToRemove) {
        toast.info(`${itemToRemove.name} removed from wishlist`);
      }
      return prevItems.filter(item => item.id !== itemId);
    });
  };

  const isInWishlist = (itemId: number | string): boolean => {
    return wishlistItems.some(item => item.id === itemId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    toast.info("Wishlist cleared");
  };

  // Sync wishlist with user (for future implementation)
  const syncWishlistWithUser = async (user: User | null) => {
    if (!user) return;
    
    // Here you would implement logic to sync the wishlist with a user's saved wishlist in the database
    // This is a placeholder for future implementation
    console.log("Syncing wishlist with user:", user.id);
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
      syncWishlistWithUser
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
