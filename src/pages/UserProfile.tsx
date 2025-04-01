import { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { 
  User, 
  Package,
  Heart, 
  Settings,
  MapPin,
  CreditCard,
  LogOut,
  Menu,
  ChevronRight
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Profile Dashboard
const ProfileDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
      try {
        // Fetch profile data
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(data);
        }
        
        // Fetch recent orders
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (orderError) {
          console.error('Error fetching orders:', orderError);
        } else {
          setRecentOrders(orderData || []);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [user]);

  // Format price in INR with ₹ symbol
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
      <div className="p-6">
        <p className="text-gray-500">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover" 
              />
            ) : (
              <User className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {profile?.first_name && profile?.last_name 
                ? `${profile.first_name} ${profile.last_name}`
                : user?.email}
            </h1>
            <p className="text-gray-500">{user?.email}</p>
            <p className="text-gray-500">{profile?.phone || "No phone number added"}</p>
          </div>
          <div className="ml-auto mt-4 sm:mt-0">
            <Button asChild variant="outline">
              <Link to="/profile/settings">Edit Profile</Link>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Package className="w-5 h-5 mr-2 text-royal-purple" />
            <h2 className="text-lg font-semibold">Recent Orders</h2>
          </div>
          
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-3">You haven't placed any orders yet</p>
              <Button asChild variant="outline" size="sm">
                <Link to="/products">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <Link 
                  key={order.id} 
                  to={`/order-confirmation/${order.id}`}
                  className="block border rounded-md p-3 hover:border-royal-purple transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">Order #{order.id.split('-')[0].toUpperCase()}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.order_status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.order_status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {order.payment_method === 'card' ? 'Paid with Card' :
                       order.payment_method === 'upi' ? 'Paid with UPI' :
                       'Cash on Delivery'}
                    </span>
                    <span className="font-semibold">{formatPrice(order.total_amount)}</span>
                  </div>
                </Link>
              ))}
              
              <div className="text-center mt-4">
                <Button asChild variant="outline" size="sm">
                  <Link to="/profile/orders">View All Orders</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <MapPin className="w-5 h-5 mr-2 text-royal-purple" />
            <h2 className="text-lg font-semibold">Saved Addresses</h2>
          </div>
          
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-3">You haven't added any addresses yet</p>
            <Button asChild variant="outline" size="sm">
              <Link to="/profile/addresses">Add Address</Link>
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <CreditCard className="w-5 h-5 mr-2 text-royal-purple" />
            <h2 className="text-lg font-semibold">Payment Methods</h2>
          </div>
          
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-3">You haven't added any payment methods yet</p>
            <Button asChild variant="outline" size="sm">
              <Link to="/profile/payment-methods">Add Payment Method</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Orders List
const OrdersList = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching orders:', error);
        } else {
          setOrders(data || []);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]);

  // Format price in INR with ₹ symbol
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
      <div className="p-6">
        <p className="text-gray-500">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No Orders Yet</h2>
          <p className="text-gray-500 mb-6">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <Button asChild>
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6">Your Orders</h2>
        
        <div className="space-y-6">
          {orders.map((order) => (
            <Link 
              key={order.id} 
              to={`/order-confirmation/${order.id}`}
              className="block border rounded-lg p-4 hover:border-royal-purple transition-colors"
            >
              <div className="flex flex-col md:flex-row justify-between mb-4">
                <div>
                  <div className="flex items-center">
                    <h3 className="font-semibold text-lg">Order #{order.id.split('-')[0].toUpperCase()}</h3>
                    <span className={`ml-3 text-xs px-2 py-1 rounded-full ${
                      order.order_status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.order_status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-500">{formatDate(order.created_at)}</p>
                </div>
                <div className="mt-2 md:mt-0 md:text-right">
                  <p className="font-bold text-lg">{formatPrice(order.total_amount)}</p>
                  <p className="text-gray-500">
                    {order.payment_method === 'card' ? 'Paid with Card' :
                     order.payment_method === 'upi' ? 'Paid with UPI' :
                     'Cash on Delivery'}
                  </p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">
                    {order.payment_status === 'paid' ? 
                      <span className="text-green-600">Payment completed</span> : 
                      <span className="text-amber-600">Payment pending</span>
                    }
                  </p>
                </div>
                <Button variant="outline" size="sm" className="gap-1">
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

// Wishlist
const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Format price in INR with ₹ symbol
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image
    });
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Your Wishlist is Empty</h2>
          <p className="text-gray-500 mb-6">
            You haven't added any items to your wishlist yet.
          </p>
          <Button asChild>
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6">Your Wishlist</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 hover:border-royal-purple transition-colors">
              <div 
                className="aspect-square bg-gray-100 rounded-md mb-4 overflow-hidden cursor-pointer"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
              <h3 
                className="font-semibold cursor-pointer hover:text-royal-purple"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                {item.name}
              </h3>
              <p className="text-royal-purple font-bold my-2">{formatPrice(item.price)}</p>
              <div className="flex space-x-2">
                <Button 
                  variant="default" 
                  size="sm"
                  className="flex-grow"
                  onClick={() => handleAddToCart(item)}
                >
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Account Settings
const AccountSettings = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(data);
          setFormData({
            firstName: data?.first_name || "",
            lastName: data?.last_name || "",
            email: user.email || "",
            phone: data?.phone || ""
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone
        })
        .eq('id', user.id);
        
      if (error) {
        console.error('Error updating profile:', error);
        toast.error("Failed to update profile");
      } else {
        toast.success("Profile updated successfully");
        setProfile({
          ...profile,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("An error occurred while updating your profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Account Settings</h2>
          <Button 
            variant={isEditing ? "outline" : "default"}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full p-2 border rounded-md bg-gray-50"
                />
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Personal Information</h3>
                <div className="mt-3 space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Name</span>
                    <p className="font-medium">
                      {profile?.first_name && profile?.last_name 
                        ? `${profile.first_name} ${profile.last_name}`
                        : "Not set"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Email</span>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Phone</span>
                    <p className="font-medium">{profile?.phone || "Not set"}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Security</h3>
                <div className="mt-3 space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Password</span>
                    <p className="font-medium">••••••••</p>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-4">Account Actions</h3>
              <div className="space-y-3">
                <Button 
                  variant="destructive"
                  size="sm"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
                <p className="text-xs text-gray-500">
                  By signing out, you'll need to sign in again to access your account.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Profile Component
const UserProfile = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 py-8">
          <div className="container-custom">
            <p className="text-center">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Get current active tab from URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/orders')) return 'orders';
    if (path.includes('/wishlist')) return 'wishlist';
    if (path.includes('/settings')) return 'settings';
    return 'dashboard';
  };
  
  const activeTab = getActiveTab();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container-custom">
          <div className="flex gap-2 items-center mb-6">
            <h1 className="text-2xl font-bold">My Account</h1>
            
            {/* Mobile menu trigger */}
            <div className="md:hidden ml-auto">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu size={18} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <div className="py-6 space-y-2">
                    <h2 className="text-lg font-bold mb-4">My Account</h2>
                    <nav className="space-y-1">
                      <Link 
                        to="/profile" 
                        className={`block p-3 rounded-md ${activeTab === 'dashboard' ? 'bg-royal-light text-royal-purple font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <User className="w-5 h-5 mr-3" />
                          Dashboard
                        </div>
                      </Link>
                      <Link 
                        to="/profile/orders" 
                        className={`block p-3 rounded-md ${activeTab === 'orders' ? 'bg-royal-light text-royal-purple font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <Package className="w-5 h-5 mr-3" />
                          Orders
                        </div>
                      </Link>
                      <Link 
                        to="/profile/wishlist" 
                        className={`block p-3 rounded-md ${activeTab === 'wishlist' ? 'bg-royal-light text-royal-purple font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <Heart className="w-5 h-5 mr-3" />
                          Wishlist
                        </div>
                      </Link>
                      <Link 
                        to="/profile/settings" 
                        className={`block p-3 rounded-md ${activeTab === 'settings' ? 'bg-royal-light text-royal-purple font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <Settings className="w-5 h-5 mr-3" />
                          Settings
                        </div>
                      </Link>
                      <div 
                        className="block p-3 rounded-md text-red-600 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center">
                          <LogOut className="w-5 h-5 mr-3" />
                          Sign Out
                        </div>
                      </div>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Desktop sidebar */}
            <div className="hidden md:block">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <nav className="space-y-1">
                  <Link 
                    to="/profile" 
                    className={`block p-3 rounded-md ${activeTab === 'dashboard' ? 'bg-royal-light text-royal-purple font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <div className="flex items-center">
                      <User className="w-5 h-5 mr-3" />
                      Dashboard
                    </div>
                  </Link>
                  <Link 
                    to="/profile/orders" 
                    className={`block p-3 rounded-md ${activeTab === 'orders' ? 'bg-royal-light text-royal-purple font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <div className="flex items-center">
                      <Package className="w-5 h-5 mr-3" />
                      Orders
                    </div>
                  </Link>
                  <Link 
                    to="/profile/wishlist" 
                    className={`block p-3 rounded-md ${activeTab === 'wishlist' ? 'bg-royal-light text-royal-purple font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <div className="flex items-center">
                      <Heart className="w-5 h-5 mr-3" />
                      Wishlist
                    </div>
                  </Link>
                  <Link 
                    to="/profile/settings" 
                    className={`block p-3 rounded-md ${activeTab === 'settings' ? 'bg-royal-light text-royal-purple font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <div className="flex items-center">
                      <Settings className="w-5 h-5 mr-3" />
                      Settings
                    </div>
                  </Link>
                </nav>
              </div>
            </div>
            
            {/* Main content */}
            <div className="md:col-span-3">
              <Tabs value={activeTab} className="w-full">
                <TabsContent value="dashboard">
                  <ProfileDashboard />
                </TabsContent>
                <TabsContent value="orders">
                  <OrdersList />
                </TabsContent>
                <TabsContent value="wishlist">
                  <WishlistPage />
                </TabsContent>
                <TabsContent value="settings">
                  <AccountSettings />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;
