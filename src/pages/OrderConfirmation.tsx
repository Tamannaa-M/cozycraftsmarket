
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Truck, Package, Clock, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: string;
  created_at: string;
  order_status: string;
  payment_status: string;
  payment_method: string;
  total_amount: number;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  transaction_id: string;
}

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;
      
      try {
        // Fetch order details
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();
          
        if (orderError) {
          console.error('Error fetching order:', orderError);
          return;
        }
        
        setOrder(orderData);
        
        // Fetch order items
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', orderId);
          
        if (itemsError) {
          console.error('Error fetching order items:', itemsError);
          return;
        }
        
        setOrderItems(itemsData);
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId]);

  // Format price in INR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 py-16">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm">
              <div className="text-center py-12">
                <p className="text-gray-600">Loading order details...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 py-16">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
                <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
                <Button asChild>
                  <Link to="/">Return to Homepage</Link>
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
      <main className="flex-grow bg-gray-50 py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Order confirmation header */}
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="mb-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
              <p className="text-gray-600 mb-6">
                Your order has been received and is being processed.
              </p>
              <div className="bg-gray-50 p-4 rounded-md inline-block">
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-mono font-medium">{order.id.split('-')[0].toUpperCase()}</p>
              </div>
            </div>
            
            {/* Order status */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-6">Order Status</h2>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="bg-green-50 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="text-green-500 w-8 h-8" />
                  </div>
                  <p className="font-medium">Order Placed</p>
                  <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                </div>
                <div className="text-center">
                  <div className="bg-gray-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Package className="text-gray-400 w-8 h-8" />
                  </div>
                  <p className="font-medium">Processing</p>
                  <p className="text-sm text-gray-500">In progress</p>
                </div>
                <div className="text-center">
                  <div className="bg-gray-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Truck className="text-gray-400 w-8 h-8" />
                  </div>
                  <p className="font-medium">Shipping</p>
                  <p className="text-sm text-gray-500">Pending</p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md text-blue-700 text-sm mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>
                  Estimated delivery: {
                    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                      month: 'long',
                      day: 'numeric',
                    })
                  } - {
                    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                      month: 'long',
                      day: 'numeric',
                    })
                  }
                </span>
              </div>
              
              <div className="flex justify-between">
                <Button asChild variant="outline">
                  <Link to="/profile/orders">
                    Track Order
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/products">
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Order details */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-6">Order Details</h2>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-medium text-gray-500 mb-2">Order Information</h3>
                  <ul className="space-y-2 text-sm">
                    <li><span className="text-gray-500">Order ID:</span> {order.id.split('-')[0].toUpperCase()}</li>
                    <li><span className="text-gray-500">Date:</span> {formatDate(order.created_at)}</li>
                    <li>
                      <span className="text-gray-500">Payment Method:</span> {
                        order.payment_method === 'card' ? 'Credit/Debit Card' :
                        order.payment_method === 'upi' ? 'UPI' :
                        'Cash on Delivery'
                      }
                    </li>
                    <li>
                      <span className="text-gray-500">Payment Status:</span> {
                        order.payment_status === 'paid' ? 
                          <span className="text-green-600 font-medium">Paid</span> : 
                          <span className="text-amber-600 font-medium">Pending</span>
                      }
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500 mb-2">Customer Support</h3>
                  <ul className="space-y-2 text-sm">
                    <li><span className="text-gray-500">Email:</span> support@cozymarket.com</li>
                    <li><span className="text-gray-500">Phone:</span> +91 98765 43210</li>
                    <li><span className="text-gray-500">Hours:</span> Mon-Sat, 9:00 AM - 6:00 PM IST</li>
                  </ul>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <h3 className="font-medium mb-4">Order Items</h3>
              <div className="space-y-4 mb-6">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium">{item.product_name}</h4>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.total)}</p>
                      <p className="text-xs text-gray-500">
                        {formatPrice(item.price)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span>
                    {order.shipping_amount > 0 
                      ? formatPrice(order.shipping_amount) 
                      : "Free"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax (18% GST)</span>
                  <span>{formatPrice(order.tax_amount)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatPrice(order.total_amount)}</span>
                </div>
              </div>
            </div>
            
            {/* Recommendations */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">You might also like</h2>
                <Link to="/products" className="text-royal-purple flex items-center text-sm font-medium hover:underline">
                  View all <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* This would typically be populated from a recommendations API */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-md p-4 hover:border-royal-purple transition-colors">
                    <div className="aspect-square bg-gray-100 rounded-md mb-3"></div>
                    <h3 className="font-medium text-sm mb-1">Recommended Product {i}</h3>
                    <p className="text-royal-purple font-semibold">{formatPrice(999)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
