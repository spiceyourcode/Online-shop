import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cartAPI } from "@/api/services";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { toast } from "sonner";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Cart = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  const fetchCart = async () => {
    try {
      const { data } = await cartAPI.get();
      setCart(data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchCart();
    else setLoading(false);
  }, [isAuthenticated]);

  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    if (quantity < 1) return handleRemoveItem(itemId);
    setUpdating(itemId);
    try {
      const { data } = await cartAPI.updateItem(itemId, quantity);
      setCart(data);
    } catch {
      toast.error("Failed to update quantity");
      await fetchCart();
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    setUpdating(itemId);
    try {
      const { data } = await cartAPI.removeItem(itemId);
      setCart(data);
      toast.success("Item removed");
    } catch {
      toast.error("Failed to remove item");
    } finally {
      setUpdating(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold">Sign in to view your cart</h2>
            <Button asChild><Link to="/login">Sign In</Link></Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const items = cart?.items || [];
  const totalPrice = cart?.total_price || "0";

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={items.length} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {loading ? (
          <div className="space-y-4">{Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-32 w-full" />)}</div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold">Your cart is empty</h2>
            <p className="text-muted-foreground">Start shopping to add items to your cart</p>
            <Button asChild><Link to="/">Continue Shopping</Link></Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item: any) => (
                <Card key={item.id} className={updating === item.id ? "opacity-50" : ""}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Link to={`/products/${item.product.slug}`} className="shrink-0">
                        <img src={getImageUrl(item.product.image)} alt={item.product.name} className="w-24 h-24 object-cover rounded-md" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/products/${item.product.slug}`} className="font-semibold hover:text-primary line-clamp-2">{item.product.name}</Link>
                        <p className="text-sm text-muted-foreground mt-1">{item.product.brand}</p>
                        <p className="font-bold mt-1">{formatPrice(item.product.price)}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleRemoveItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center border rounded-md">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm font-semibold">{formatPrice(item.subtotal)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-bold">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-success">Free</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <Button className="w-full" size="lg" onClick={() => navigate("/checkout")}>
                    Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/">Continue Shopping</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
