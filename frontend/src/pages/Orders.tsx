import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ordersAPI } from "@/api/services";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import { Package, ArrowRight } from "lucide-react";

const statusColors: Record<string, string> = {
  PENDING: "bg-accent text-accent-foreground",
  PAID: "bg-primary text-primary-foreground",
  SHIPPED: "bg-blue-500 text-white",
  DELIVERED: "bg-success text-success-foreground",
};

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersAPI.myOrders().then(({ data }) => {
      setOrders(Array.isArray(data) ? data : data.results || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {loading ? (
          <div className="space-y-4">{Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-28 w-full" />)}</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <Package className="h-16 w-16 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold">No orders yet</h2>
            <p className="text-muted-foreground">Start shopping to place your first order</p>
            <Button asChild><Link to="/">Browse Products</Link></Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <Card key={order.id} className="hover:shadow-card-hover transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">Order #{order.id}</h3>
                        <Badge className={statusColors[order.status] || statusColors.PENDING}>{order.status || "PENDING"}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}</p>
                      <p className="text-sm text-muted-foreground">{order.items?.length || 0} items • {formatPrice(order.total_price)}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/orders/${order.id}`}>View Details <ArrowRight className="ml-1 h-4 w-4" /></Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
