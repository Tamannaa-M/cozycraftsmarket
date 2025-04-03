
import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";

export const CartDrawer = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    totalItems, 
    subtotal,
    isCartOpen,
    setIsCartOpen,
    clearCart
  } = useCart();
  
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          onClick={() => setIsCartOpen(true)}
        >
          <ShoppingCart size={22} />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5 min-w-[1.2rem] h-5 flex items-center justify-center bg-royal-purple">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md w-full flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold flex items-center">
            <ShoppingCart className="mr-2" size={22} />
            Your Cart
            {totalItems > 0 && <span className="ml-2 text-sm text-gray-500">({totalItems} items)</span>}
          </SheetTitle>
        </SheetHeader>
        
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-grow py-10">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <ShoppingCart size={40} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
            <p className="text-gray-500 text-center mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button 
              onClick={() => {
                setIsCartOpen(false);
                navigate("/products");
              }}
            >
              Browse Products
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-grow overflow-auto py-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-start gap-4 mb-4 pb-4 border-b">
                  <div className="h-20 w-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-royal-purple font-semibold my-1">
                      {formatPrice(item.price)}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-red-500"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-gray-500">Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax</span>
                  <span className="text-gray-500">Calculated at checkout</span>
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button className="w-full" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate("/products");
                  }}
                >
                  Continue Shopping
                </Button>
                {cartItems.length > 0 && (
                  <Button
                    variant="outline"
                    className="w-full text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
