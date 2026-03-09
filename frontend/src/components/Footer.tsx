import { ShoppingCart, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <ShoppingCart className="h-6 w-6" />
              <span className="text-xl font-bold">ShopHub</span>
            </Link>
            <p className="text-sm text-secondary-foreground/80">
              Your trusted online shopping destination for electronics, gadgets, and lifestyle products across Kenya.
            </p>
            <div className="flex gap-3">
              <a href="#" className="hover:text-accent transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-accent transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-accent transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="hover:text-accent transition-colors"><Youtube className="h-5 w-5" /></a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-secondary-foreground/80">
              <li><Link to="/" className="hover:text-accent transition-colors">All Products</Link></li>
              <li><Link to="/?ordering=-created_at" className="hover:text-accent transition-colors">New Arrivals</Link></li>
              <li><Link to="/?ordering=price" className="hover:text-accent transition-colors">Best Deals</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-sm text-secondary-foreground/80">
              <li><Link to="/profile" className="hover:text-accent transition-colors">My Profile</Link></li>
              <li><Link to="/orders" className="hover:text-accent transition-colors">My Orders</Link></li>
              <li><Link to="/cart" className="hover:text-accent transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-secondary-foreground/80">
              <li><Link to="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link to="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-secondary-foreground/20 mt-8 pt-8 text-center text-sm text-secondary-foreground/60">
          <p>&copy; {new Date().getFullYear()} ShopHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
