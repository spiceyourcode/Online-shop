import { Search, ShoppingCart, User, Menu, LogOut, Package, Store, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useDebounce } from "@/hooks/useDebounce";

interface HeaderProps {
  cartCount?: number;
  onSearch?: (query: string) => void;
}

const Header = ({ cartCount = 0, onSearch }: HeaderProps) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains("dark"));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/?search=${encodeURIComponent(searchInput.trim())}`);
      onSearch?.(searchInput.trim());
    }
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  return (
    <header className="sticky top-0 z-50 w-full glass">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link to="/" className="text-lg font-medium hover:text-primary transition-colors">Home</Link>
                  {isAuthenticated && (
                    <>
                      <Link to="/profile" className="text-lg font-medium hover:text-primary transition-colors">Profile</Link>
                      <Link to="/orders" className="text-lg font-medium hover:text-primary transition-colors">My Orders</Link>
                      <Link to="/cart" className="text-lg font-medium hover:text-primary transition-colors">Cart</Link>
                      {(user?.is_seller || user?.is_staff) && (
                        <Link to="/seller/dashboard" className="text-lg font-medium hover:text-primary transition-colors">Seller Dashboard</Link>
                      )}
                    </>
                  )}
                  {!isAuthenticated && (
                    <>
                      <Link to="/login" className="text-lg font-medium hover:text-primary transition-colors">Sign In</Link>
                      <Link to="/register" className="text-lg font-medium hover:text-primary transition-colors">Register</Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
            <Link to="/" className="flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">ShopHub</span>
            </Link>
          </div>

          <form onSubmit={handleSearch} className="hidden flex-1 max-w-2xl md:flex">
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Search for products, brands and more..."
                className="w-full pl-4 pr-12 h-10"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Button type="submit" size="sm" className="absolute right-0 top-0 h-10 px-4 rounded-l-none">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="hidden sm:flex">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden md:flex gap-2">
                    <User className="h-5 w-5" />
                    <span className="max-w-24 truncate">{user?.name || "Account"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2"><User className="h-4 w-4" /> Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="flex items-center gap-2"><Package className="h-4 w-4" /> My Orders</Link>
                  </DropdownMenuItem>
                  {(user?.is_seller || user?.is_staff) && (
                    <DropdownMenuItem asChild>
                      <Link to="/seller/dashboard" className="flex items-center gap-2"><Store className="h-4 w-4" /> Seller Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { logout(); navigate("/"); }} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" className="hidden md:flex gap-2" asChild>
                <Link to="/login"><User className="h-5 w-5" /><span>Sign In</span></Link>
              </Button>
            )}

            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-semibold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
