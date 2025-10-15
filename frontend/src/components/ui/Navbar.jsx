import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Navbar() {
  const { items } = useSelector((state) => state.cart);

  return (
    <header className="w-full bg-background border-b border-border">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-primary">
          MyStore
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex gap-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <Link to="/products" className="hover:text-primary">Products</Link>
          <Link to="/login" className="hover:text-primary">login</Link>
        </nav>

        {/* Cart */}
        <Link to="/cart" className="relative">
          <span className="material-icons text-2xl">shopping_cart</span>
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
