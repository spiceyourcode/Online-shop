import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ordersAPI } from "@/api/services";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { ArrowLeft, MapPin, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

const statusColors: Record<string, string> = {
  PENDING: "bg-accent text-accent-foreground",
  PAID: "bg-primary text-primary-foreground",
  SHIPPED: "bg-blue-500 text-white",
  DELIVERED: "bg-success text-success-foreground",
};

const statusSteps = ["PENDING", "PAID", "SHIPPED", "DELIVERED"];

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    ordersAPI.get(Number(id)).then(({ data }) => setOrder(data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col"><Header /><main className="flex-1 container mx-auto px-4 py-8"><Skeleton className="h-96 w-full" /></main><Footer /></div>
  );

  if (!order) return (
    <div className="min-h-screen flex flex-col"><Header /><main className="flex-1 flex items-center justify-center"><div className="text-center space-y-4"><h2 className="text-2xl font-bold">Order not found</h2><Button asChild><Link to="/orders">Back to Orders</Link></Button></div></main><Footer /></div>
  );

  const currentStepIndex = statusSteps.indexOf(order.status || "PENDING");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Order #{order.id}</h1>
          <Badge className={statusColors[order.status] || statusColors.PENDING}>{order.status || "PENDING"}</Badge>
        </div>

        {/* Status timeline */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between">
              {statusSteps.map((step, i) => (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    i <= currentStepIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>{i + 1}</div>
                  <p className={`text-xs mt-1 ${i <= currentStepIndex ? "font-medium" : "text-muted-foreground"}`}>{step}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order items */}
        <Card className="mb-6">
          <CardHeader><CardTitle>Order Items</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex gap-3 items-center">
                <img src={getImageUrl(item.product?.image)} alt={item.product?.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-medium">{item.product?.name || "Product"}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                </div>
                <p className="font-semibold">{formatPrice(item.subtotal)}</p>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between text-lg font-bold"><span>Total</span><span>{formatPrice(order.total_price)}</span></div>
          </CardContent>
        </Card>

        {/* Shipping & Payment info */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center gap-2 mb-2"><MapPin className="h-4 w-4 text-primary" /><h3 className="font-semibold">Shipping Address</h3></div>
              <p className="text-sm">{order.address}</p>
              <p className="text-sm">{order.city}, {order.postal_code}</p>
              <p className="text-sm">{order.country}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center gap-2 mb-2"><CreditCard className="h-4 w-4 text-primary" /><h3 className="font-semibold">Payment</h3></div>
              <p className="text-sm">Status: {order.is_paid ? "Paid ✅" : "Unpaid"}</p>
              <p className="text-sm text-muted-foreground">Order placed: {new Date(order.created_at).toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetail;
