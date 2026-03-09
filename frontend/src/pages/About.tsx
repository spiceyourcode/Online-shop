import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">About ShopHub</h1>
        
        <Card className="mb-8">
          <CardContent className="p-6 prose max-w-none">
            <p className="text-lg mb-4">
              Welcome to ShopHub, your trusted destination for premium electronics and lifestyle products.
            </p>
            <p className="mb-4">
              Founded in 2024, we've been committed to bringing you the latest technology and gadgets
              at competitive prices with exceptional customer service.
            </p>
            <h2 className="text-2xl font-semibold mt-6 mb-3">Our Mission</h2>
            <p className="mb-4">
              To provide customers with access to quality products, seamless shopping experience,
              and reliable delivery services.
            </p>
            <h2 className="text-2xl font-semibold mt-6 mb-3">Why Choose Us</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Authentic products from trusted brands</li>
              <li>Competitive pricing and regular deals</li>
              <li>Fast and reliable shipping</li>
              <li>24/7 customer support</li>
              <li>Easy returns and exchanges</li>
            </ul>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default About;
