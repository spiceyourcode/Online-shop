import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { productsAPI, cartAPI, reviewsAPI } from "@/api/services";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StarRating from "@/components/StarRating";
import { ProductDetailSkeleton } from "@/components/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { toast } from "sonner";
import { ShoppingCart, Minus, Plus, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    productsAPI.getBySlug(slug).then(({ data }) => {
      setProduct(data);
      return reviewsAPI.list(data.id);
    }).then(({ data }) => {
      setReviews(Array.isArray(data) ? data : data.results || []);
    }).catch(() => toast.error("Product not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error("Please sign in first"); return; }
    try {
      await cartAPI.addItem(product.id, quantity);
      toast.success(`${product.name} added to cart!`);
    } catch { toast.error("Failed to add to cart"); }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user?.is_customer) { toast.error("Only customers can leave reviews"); return; }
    setSubmittingReview(true);
    try {
      await reviewsAPI.create({ product: product.id, rating: reviewRating, comment: reviewComment });
      toast.success("Review submitted!");
      setReviewComment("");
      setReviewRating(5);
      const { data } = await reviewsAPI.list(product.id);
      setReviews(Array.isArray(data) ? data : data.results || []);
      const { data: updated } = await productsAPI.getBySlug(slug!);
      setProduct(updated);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "You may have already reviewed this product");
    } finally { setSubmittingReview(false); }
  };

  const stockBadge = !product ? null : product.stock === 0
    ? <Badge variant="destructive">Out of Stock</Badge>
    : product.stock <= 5
    ? <Badge className="bg-accent text-accent-foreground">Only {product.stock} left</Badge>
    : <Badge className="bg-success text-success-foreground">In Stock ({product.stock})</Badge>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>

        {loading ? <ProductDetailSkeleton /> : !product ? (
          <div className="text-center py-16"><h2 className="text-2xl font-bold">Product not found</h2></div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">{product.brand}</p>
                  <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
                </div>
                <div className="flex items-center gap-3">
                  <StarRating rating={parseFloat(product.rating)} size={20} />
                  <span className="text-muted-foreground">({product.num_reviews} reviews)</span>
                </div>
                <Separator />
                <p className="text-4xl font-bold text-primary">{formatPrice(product.price)}</p>
                <div>{stockBadge}</div>
                <p className="text-muted-foreground leading-relaxed">{product.description || "No description available."}</p>
                <Separator />
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Category: <Link to={`/?category__slug=${product.category.slug}`} className="text-primary hover:underline">{product.category.name}</Link></p>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Quantity:</span>
                    <div className="flex items-center border rounded-md">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="h-4 w-4" /></Button>
                      <span className="w-10 text-center font-medium">{quantity}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}><Plus className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <Button size="lg" className="w-full active:scale-95 transition-transform" onClick={handleAddToCart} disabled={product.stock === 0}>
                    <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart — {formatPrice(Number(product.price) * quantity)}
                  </Button>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Customer Reviews ({reviews.length})</h2>
              {isAuthenticated && user?.is_customer && (
                <Card>
                  <CardHeader><CardTitle className="text-lg">Leave a Review</CardTitle></CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Rating</label>
                        <StarRating rating={reviewRating} interactive onRate={setReviewRating} size={24} />
                      </div>
                      <Textarea placeholder="Share your experience..." value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} />
                      <Button type="submit" disabled={submittingReview}>{submittingReview ? "Submitting..." : "Submit Review"}</Button>
                    </form>
                  </CardContent>
                </Card>
              )}
              {reviews.length === 0 ? (
                <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review: any) => (
                    <Card key={review.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <StarRating rating={review.rating} size={14} />
                            <span className="text-sm font-medium">{review.user}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                        {review.comment && <p className="text-muted-foreground">{review.comment}</p>}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
