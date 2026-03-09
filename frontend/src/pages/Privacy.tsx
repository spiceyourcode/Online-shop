import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        
        <Card>
          <CardContent className="p-6 prose max-w-none">
            <p className="text-sm text-muted-foreground mb-4">Last updated: 2024</p>
            
            <h2 className="text-2xl font-semibold mt-6 mb-3">Information We Collect</h2>
            <p className="mb-4">
              We collect information you provide directly to us, including name, email address,
              shipping address, and payment information when you make a purchase.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-3">How We Use Your Information</h2>
            <p className="mb-4">
              We use the information we collect to process your orders, communicate with you,
              and improve our services.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-3">Data Security</h2>
            <p className="mb-4">
              We implement appropriate security measures to protect your personal information
              from unauthorized access and disclosure.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-3">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at
              privacy@shophub.com
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
