import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { cartAPI, ordersAPI, paymentsAPI } from "@/api/services";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { ArrowLeft, ArrowRight, Check, CreditCard, MapPin, ShoppingBag } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_placeholder");

interface ShippingData {
  full_name: string; address: string; city: string; postal_code: string; country: string; phone: string;
}

const CheckoutContent = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<{ clientSecret: string; paymentId: number } | null>(null);
  const [shipping, setShipping] = useState<ShippingData>({
    full_name: "", address: "", city: "", postal_code: "", country: "Kenya", phone: "",
  });

  useEffect(() => {
    cartAPI.get().then(({ data }) => setCart(data)).catch(() => toast.error("Failed to load cart")).finally(() => setLoading(false));
  }, []);

  const items = cart?.items || [];

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipping.full_name || !shipping.address || !shipping.city || !shipping.phone) {
      toast.error("Please fill all required fields"); return;
    }
    setStep(2);
  };

  const handleCreateOrder = async () => {
    setProcessing(true);
    try {
      const orderData = {
        address: shipping.address, city: shipping.city,
        postal_code: shipping.postal_code, country: shipping.country,
        items: items.map((i: any) => ({ product_id: i.product.id, quantity: i.quantity })),
      };
      const { data: order } = await ordersAPI.create(orderData);
      setOrderId(order.id);
      await ordersAPI.addShipping(order.id, shipping);
      const { data: payment } = await paymentsAPI.create(order.id);
      setPaymentInfo({ clientSecret: payment.client_secret, paymentId: payment.payment.id });
      setStep(3);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to create order");
    } finally {
      setProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!stripe || !elements || !paymentInfo) return;
    setProcessing(true);
    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");
      const { error } = await stripe.confirmCardPayment(paymentInfo.clientSecret, {
        payment_method: { card: cardElement, billing_details: { name: shipping.full_name } },
      });
      if (error) { toast.error(error.message); return; }
      await paymentsAPI.updateStatus(paymentInfo.paymentId, "succeeded");
      toast.success("Payment successful! 🎉");
      navigate(`/orders/${orderId}`);
    } catch { toast.error("Payment failed"); } finally { setProcessing(false); }
  };

  if (loading) return <div className="text-center py-16 text-muted-foreground">Loading checkout...</div>;
  if (items.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <Button asChild><Link to="/">Start Shopping</Link></Button>
      </div>
    );
  }

  const steps = [
    { num: 1, label: "Shipping", icon: MapPin },
    { num: 2, label: "Review", icon: Check },
    { num: 3, label: "Payment", icon: CreditCard },
  ];

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center justify-center mb-8 gap-2">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              step >= s.num ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              <s.icon className="h-4 w-4" /> {s.label}
            </div>
            {i < steps.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card>
          <CardHeader><CardTitle>Shipping Address</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleShippingSubmit} className="space-y-4 max-w-lg">
              <div className="space-y-2"><Label>Full Name *</Label><Input value={shipping.full_name} onChange={(e) => setShipping({ ...shipping, full_name: e.target.value })} required /></div>
              <div className="space-y-2"><Label>Address *</Label><Input value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>City *</Label><Input value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} required /></div>
                <div className="space-y-2"><Label>Postal Code</Label><Input value={shipping.postal_code} onChange={(e) => setShipping({ ...shipping, postal_code: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Country</Label><Input value={shipping.country} onChange={(e) => setShipping({ ...shipping, country: e.target.value })} /></div>
                <div className="space-y-2"><Label>Phone *</Label><Input value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} required /></div>
              </div>
              <Button type="submit" className="w-full">Continue to Review <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </form>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Order Review</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {items.map((item: any) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <img src={getImageUrl(item.product.image)} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1"><p className="font-medium">{item.product.name}</p><p className="text-sm text-muted-foreground">Qty: {item.quantity}</p></div>
                  <p className="font-semibold">{formatPrice(item.subtotal)}</p>
                </div>
              ))}
              <Separator />
              <div className="space-y-1 text-sm">
                <p><strong>Ship to:</strong> {shipping.full_name}</p>
                <p>{shipping.address}, {shipping.city} {shipping.postal_code}, {shipping.country}</p>
                <p>Phone: {shipping.phone}</p>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold"><span>Total</span><span>{formatPrice(cart.total_price)}</span></div>
            </CardContent>
          </Card>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
            <Button className="flex-1" onClick={handleCreateOrder} disabled={processing}>{processing ? "Creating Order..." : "Continue to Payment"}</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <Card>
          <CardHeader><CardTitle>Payment</CardTitle></CardHeader>
          <CardContent className="space-y-6 max-w-lg">
            <div className="p-4 border rounded-lg">
              <CardElement options={{ style: { base: { fontSize: "16px", color: "#1e293b", "::placeholder": { color: "#94a3b8" } } } }} />
            </div>
            <div className="flex justify-between text-lg font-bold"><span>Total</span><span>{formatPrice(cart.total_price)}</span></div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
              <Button className="flex-1" onClick={handlePayment} disabled={processing || !stripe}>
                {processing ? "Processing..." : `Pay ${formatPrice(cart.total_price)}`}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const Checkout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <Elements stripe={stripePromise}>
          <CheckoutContent />
        </Elements>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
