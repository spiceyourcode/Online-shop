import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StarRating from "@/components/StarRating";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface Product {
  id: number;
  name: string;
  slug: string;
  brand: string;
  price: string;
  stock: number;
  image: string | null;
  rating: string;
  num_reviews: number;
  category: { id: number; name: string; slug: string };
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: number) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const stockBadge = product.stock === 0
    ? <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
    : product.stock <= 5
    ? <Badge className="bg-accent text-accent-foreground text-xs">Low Stock</Badge>
    : <Badge className="bg-success text-success-foreground text-xs">In Stock</Badge>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group overflow-hidden hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
        <Link to={`/products/${product.slug}`}>
          <div className="aspect-square overflow-hidden bg-muted relative">
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute top-2 right-2">{stockBadge}</div>
          </div>
        </Link>
        <CardContent className="p-4 space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.brand || product.category.name}</p>
          <Link to={`/products/${product.slug}`}>
            <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary transition-colors">{product.name}</h3>
          </Link>
          <div className="flex items-center gap-2">
            <StarRating rating={parseFloat(product.rating)} size={14} />
            <span className="text-xs text-muted-foreground">({product.num_reviews})</span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <p className="font-bold text-lg">{formatPrice(product.price)}</p>
            <Button
              size="sm"
              onClick={(e) => { e.preventDefault(); onAddToCart?.(product.id); }}
              disabled={product.stock === 0}
              className="active:scale-95 transition-transform"
            >
              <ShoppingCart className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
