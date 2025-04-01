import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import * as React from "react";

// Define form schemas
const addressSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  addressLine1: z.string().min(1, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(6, "Postal code is required"),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email("Invalid email address"),
});

const checkoutSchema = z.object({
  shippingAddress: addressSchema,
  billingAddress: addressSchema,
  sameAsShipping: z.boolean().default(true),
  paymentMethod: z.enum(["card", "upi", "cod"]),
  saveAddressForLater: z.boolean().default(false),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState("address");

  // Format price in INR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Calculate order totals
  const shippingCost = subtotal > 1000 ? 0 : 100;
  const taxRate = 0.18; // 18% GST
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + shippingCost + taxAmount;

  // Set up form
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingAddress: {
        firstName: "",
        lastName: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        phone: "",
        email: user?.email || "",
      },
      billingAddress: {
        firstName: "",
        lastName: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        phone: "",
        email: user?.email || "",
      },
      sameAsShipping: true,
      paymentMethod: "card",
      saveAddressForLater: false,
    },
  });

  // Watch the sameAsShipping value to sync billing address
  const sameAsShipping = form.watch("sameAsShipping");
  const shippingValues = form.watch("shippingAddress");

  // Set billing address equal to shipping address when sameAsShipping is true
  React.useEffect(() => {
    if (sameAsShipping) {
      Object.keys(shippingValues).forEach((key) => {
        form.setValue(`billingAddress.${key}` as any, shippingValues[key as keyof typeof shippingValues]);
      });
    }
  }, [sameAsShipping, shippingValues, form]);

  const onSubmit = async (data: CheckoutFormValues) => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      // Creating an order would normally involve communication with a server
      // This is a simplified client-side simulation
      
      // First, create shipping address in database if user is logged in
      let shippingAddressId = null;
      let billingAddressId = null;
      
      if (user && data.saveAddressForLater) {
        // Save shipping address
        const { data: shippingAddr, error: shippingError } = await supabase
          .from('addresses')
          .insert({
            user_id: user.id,
            address_type: 'shipping',
            address_line1: data.shippingAddress.addressLine1,
            address_line2: data.shippingAddress.addressLine2 || null,
            city: data.shippingAddress.city,
            state: data.shippingAddress.state,
            postal_code: data.shippingAddress.postalCode,
            is_default: true
          })
          .select()
          .single();
          
        if (shippingError) {
          console.error('Error saving shipping address:', shippingError);
          toast.error('Failed to save shipping address');
        } else {
          shippingAddressId = shippingAddr.id;
        }
        
        // Save billing address if different
        if (!data.sameAsShipping) {
          const { data: billingAddr, error: billingError } = await supabase
            .from('addresses')
            .insert({
              user_id: user.id,
              address_type: 'billing',
              address_line1: data.billingAddress.addressLine1,
              address_line2: data.billingAddress.addressLine2 || null,
              city: data.billingAddress.city,
              state: data.billingAddress.state,
              postal_code: data.billingAddress.postalCode,
              is_default: true
            })
            .select()
            .single();
            
          if (billingError) {
            console.error('Error saving billing address:', billingError);
            toast.error('Failed to save billing address');
          } else {
            billingAddressId = billingAddr.id;
          }
        } else {
          billingAddressId = shippingAddressId;
        }
      }
      
      // Create the order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null,
          order_status: 'pending',
          payment_status: data.paymentMethod === 'cod' ? 'pending' : 'paid',
          payment_method: data.paymentMethod,
          subtotal: subtotal,
          tax_amount: taxAmount,
          shipping_amount: shippingCost,
          total_amount: totalAmount,
          shipping_address_id: shippingAddressId,
          billing_address_id: billingAddressId,
          transaction_id: `TXN${Date.now()}`,
          notes: 'Order placed through website checkout'
        })
        .select()
        .single();
        
      if (orderError) {
        console.error('Error creating order:', orderError);
        toast.error('Failed to create order');
        setIsProcessing(false);
        return;
      }
      
      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        product_id: String(item.id),
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
        
      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        toast.error('Failed to create order items');
        setIsProcessing(false);
        return;
      }

      // Simulate payment processing
      setTimeout(() => {
        // Clear the cart after successful order
        clearCart();
        
        // Navigate to confirmation page
        navigate(`/order-confirmation/${orderData.id}`);
        
        toast.success("Order placed successfully!");
        setIsProcessing(false);
      }, 2000);
    } catch (error) {
      console.error("Error processing order:", error);
      toast.error("Failed to process your order. Please try again.");
      setIsProcessing(false);
    }
  };

  // If cart is empty, redirect to products
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 py-12">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">Add some products to your cart before checking out.</p>
                <Button onClick={() => navigate("/products")}>
                  Browse Products
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main checkout form */}
            <div className="flex-grow">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h1 className="text-2xl font-bold mb-6">Checkout</h1>
                
                <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
                  <TabsList className="w-full grid grid-cols-3 mb-8">
                    <TabsTrigger value="address" className="justify-start text-left">
                      <div className="flex">
                        <div className="mr-3 flex h-7 w-7 items-center justify-center rounded-full border-2 border-muted-foreground">
                          <span>1</span>
                        </div>
                        <div className="text-left">
                          <p className="font-medium">Address</p>
                          <p className="text-xs text-muted-foreground">Shipping & Billing</p>
                        </div>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="payment" className="justify-start text-left">
                      <div className="flex">
                        <div className="mr-3 flex h-7 w-7 items-center justify-center rounded-full border-2 border-muted-foreground">
                          <span>2</span>
                        </div>
                        <div className="text-left">
                          <p className="font-medium">Payment</p>
                          <p className="text-xs text-muted-foreground">Payment method</p>
                        </div>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="review" className="justify-start text-left">
                      <div className="flex">
                        <div className="mr-3 flex h-7 w-7 items-center justify-center rounded-full border-2 border-muted-foreground">
                          <span>3</span>
                        </div>
                        <div className="text-left">
                          <p className="font-medium">Review</p>
                          <p className="text-xs text-muted-foreground">Order summary</p>
                        </div>
                      </div>
                    </TabsTrigger>
                  </TabsList>
                
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <TabsContent value="address" className="space-y-8">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="shippingAddress.firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>First Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="First name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="shippingAddress.lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Last Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Last name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="shippingAddress.email"
                              render={({ field }) => (
                                <FormItem className="col-span-2">
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input type="email" placeholder="Email address" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="shippingAddress.phone"
                              render={({ field }) => (
                                <FormItem className="col-span-2">
                                  <FormLabel>Phone</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Phone number" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="shippingAddress.addressLine1"
                              render={({ field }) => (
                                <FormItem className="col-span-2">
                                  <FormLabel>Address Line 1</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Street address" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="shippingAddress.addressLine2"
                              render={({ field }) => (
                                <FormItem className="col-span-2">
                                  <FormLabel>Address Line 2 (Optional)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Apartment, suite, etc." {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="shippingAddress.city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>City</FormLabel>
                                  <FormControl>
                                    <Input placeholder="City" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="shippingAddress.state"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>State</FormLabel>
                                  <FormControl>
                                    <Input placeholder="State" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="shippingAddress.postalCode"
                              render={({ field }) => (
                                <FormItem className="col-span-2">
                                  <FormLabel>Postal Code</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Postal code" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <FormField
                          control={form.control}
                          name="sameAsShipping"
                          render={({ field }) => (
                            <FormItem className="flex items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Billing address same as shipping address
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                        
                        {!sameAsShipping && (
                          <div>
                            <h3 className="text-lg font-medium mb-4">Billing Address</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="billingAddress.firstName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="First name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="billingAddress.lastName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Last name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="billingAddress.email"
                                render={({ field }) => (
                                  <FormItem className="col-span-2">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input type="email" placeholder="Email address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="billingAddress.phone"
                                render={({ field }) => (
                                  <FormItem className="col-span-2">
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Phone number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="billingAddress.addressLine1"
                                render={({ field }) => (
                                  <FormItem className="col-span-2">
                                    <FormLabel>Address Line 1</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Street address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="billingAddress.addressLine2"
                                render={({ field }) => (
                                  <FormItem className="col-span-2">
                                    <FormLabel>Address Line 2 (Optional)</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Apartment, suite, etc." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="billingAddress.city"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                      <Input placeholder="City" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="billingAddress.state"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                      <Input placeholder="State" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="billingAddress.postalCode"
                                render={({ field }) => (
                                  <FormItem className="col-span-2">
                                    <FormLabel>Postal Code</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Postal code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        )}
                        
                        {user && (
                          <FormField
                            control={form.control}
                            name="saveAddressForLater"
                            render={({ field }) => (
                              <FormItem className="flex items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Save address for future orders
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        )}
                        
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            onClick={() => setCurrentStep("payment")}
                          >
                            Continue to Payment
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="payment" className="space-y-8">
                        <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                        
                        <FormField
                          control={form.control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-3"
                                >
                                  <div className="flex items-center space-x-3 border p-4 rounded-md">
                                    <RadioGroupItem value="card" id="payment-card" />
                                    <Label htmlFor="payment-card" className="cursor-pointer flex-grow">
                                      <div className="flex justify-between items-center">
                                        <span>Credit / Debit Card</span>
                                        <div className="flex space-x-2">
                                          <div className="w-10 h-6 bg-gray-200 rounded"></div>
                                          <div className="w-10 h-6 bg-gray-200 rounded"></div>
                                          <div className="w-10 h-6 bg-gray-200 rounded"></div>
                                        </div>
                                      </div>
                                    </Label>
                                  </div>
                                  
                                  <div className="flex items-center space-x-3 border p-4 rounded-md">
                                    <RadioGroupItem value="upi" id="payment-upi" />
                                    <Label htmlFor="payment-upi" className="cursor-pointer flex-grow">
                                      <div className="flex justify-between items-center">
                                        <span>UPI</span>
                                        <div className="w-10 h-6 bg-gray-200 rounded"></div>
                                      </div>
                                    </Label>
                                  </div>
                                  
                                  <div className="flex items-center space-x-3 border p-4 rounded-md">
                                    <RadioGroupItem value="cod" id="payment-cod" />
                                    <Label htmlFor="payment-cod" className="cursor-pointer flex-grow">
                                      Cash on Delivery
                                    </Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-between">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCurrentStep("address")}
                          >
                            Back to Address
                          </Button>
                          <Button
                            type="button"
                            onClick={() => setCurrentStep("review")}
                          >
                            Review Order
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="review" className="space-y-8">
                        <h3 className="text-lg font-medium mb-4">Review Your Order</h3>
                        
                        <div className="space-y-6">
                          <div className="border rounded-md p-4">
                            <h4 className="font-medium mb-2">Shipping Address</h4>
                            <div className="text-sm text-gray-600">
                              <p>{form.getValues("shippingAddress.firstName")} {form.getValues("shippingAddress.lastName")}</p>
                              <p>{form.getValues("shippingAddress.addressLine1")}</p>
                              {form.getValues("shippingAddress.addressLine2") && <p>{form.getValues("shippingAddress.addressLine2")}</p>}
                              <p>
                                {form.getValues("shippingAddress.city")}, {form.getValues("shippingAddress.state")} {form.getValues("shippingAddress.postalCode")}
                              </p>
                              <p>Phone: {form.getValues("shippingAddress.phone")}</p>
                              <p>Email: {form.getValues("shippingAddress.email")}</p>
                            </div>
                          </div>
                          
                          {!sameAsShipping && (
                            <div className="border rounded-md p-4">
                              <h4 className="font-medium mb-2">Billing Address</h4>
                              <div className="text-sm text-gray-600">
                                <p>{form.getValues("billingAddress.firstName")} {form.getValues("billingAddress.lastName")}</p>
                                <p>{form.getValues("billingAddress.addressLine1")}</p>
                                {form.getValues("billingAddress.addressLine2") && <p>{form.getValues("billingAddress.addressLine2")}</p>}
                                <p>
                                  {form.getValues("billingAddress.city")}, {form.getValues("billingAddress.state")} {form.getValues("billingAddress.postalCode")}
                                </p>
                                <p>Phone: {form.getValues("billingAddress.phone")}</p>
                                <p>Email: {form.getValues("billingAddress.email")}</p>
                              </div>
                            </div>
                          )}
                          
                          <div className="border rounded-md p-4">
                            <h4 className="font-medium mb-2">Payment Method</h4>
                            <p className="text-sm text-gray-600">
                              {form.getValues("paymentMethod") === "card" && "Credit / Debit Card"}
                              {form.getValues("paymentMethod") === "upi" && "UPI"}
                              {form.getValues("paymentMethod") === "cod" && "Cash on Delivery"}
                            </p>
                          </div>
                          
                          <div className="border rounded-md p-4">
                            <h4 className="font-medium mb-4">Order Items</h4>
                            <div className="space-y-4">
                              {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                  <div className="h-16 w-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-grow">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                                    <p className="text-sm text-gray-600">{formatPrice(item.price)} each</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCurrentStep("payment")}
                          >
                            Back to Payment
                          </Button>
                          <Button
                            type="submit"
                            disabled={isProcessing}
                          >
                            {isProcessing ? "Processing..." : "Place Order"}
                          </Button>
                        </div>
                      </TabsContent>
                    </form>
                  </Form>
                </Tabs>
              </div>
            </div>
            
            {/* Order summary */}
            <div className="w-full lg:w-96">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="h-14 w-14 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>
                      {shippingCost > 0
                        ? formatPrice(shippingCost)
                        : "Free"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (18% GST)</span>
                    <span>{formatPrice(taxAmount)}</span>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                </div>
                
                {shippingCost === 0 && (
                  <div className="mt-4 bg-green-50 p-3 rounded-md text-green-700 text-sm">
                    You've qualified for free shipping!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
