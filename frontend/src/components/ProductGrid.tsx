import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { productsAPI, cartAPI } from "@/api/services";
import ProductCard from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";

interface Product {
  id: number; name: string; slug: string; brand: string; price: string;
  stock: number; image: string | null; rating: string; num_reviews: number;
  category: { id: number; name: string; slug: string };
}

const ProductGrid = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const { isAuthenticated } = useAuth();

  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const categorySlug = searchParams.get("category__slug") || "";
  const ordering = searchParams.get("ordering") || "";
  const priceMin = searchParams.get("price__gte") || "";
  const priceMax = searchParams.get("price__lte") || "";
  const brand = searchParams.get("brand__icontains") || "";

  const [localSearch, setLocalSearch] = useState(search);
  const [localBrand, setLocalBrand] = useState(brand);
  const [localPriceMin, setLocalPriceMin] = useState(priceMin);
  const [localPriceMax, setLocalPriceMax] = useState(priceMax);

  const debouncedSearch = useDebounce(localSearch, 300);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page };
      if (debouncedSearch) params.search = debouncedSearch;
      if (categorySlug) params.category__slug = categorySlug;
      if (ordering) params.ordering = ordering;
      if (localPriceMin) params.price__gte = localPriceMin;
      if (localPriceMax) params.price__lte = localPriceMax;
      if (localBrand) params.brand__icontains = localBrand;

      const { data } = await productsAPI.list(params);
      setProducts(data.results || []);
      setTotalCount(data.count || 0);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, categorySlug, ordering, localPriceMin, localPriceMax, localBrand]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    if (debouncedSearch !== search) {
      const newParams = new URLSearchParams(searchParams);
      if (debouncedSearch) newParams.set("search", debouncedSearch);
      else newParams.delete("search");
      newParams.set("page", "1");
      setSearchParams(newParams, { replace: true });
    }
  }, [debouncedSearch]);

  const handleAddToCart = async (productId: number) => {
    if (!isAuthenticated) { toast.error("Please sign in to add items to cart"); return; }
    try {
      await cartAPI.addItem(productId);
      await cartAPI.get();
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const totalPages = Math.ceil(totalCount / 12);

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value); else newParams.delete(key);
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">
            {search ? `Results for "${search}"` : categorySlug ? `Category: ${categorySlug}` : "All Products"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{totalCount} products found</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
            <SlidersHorizontal className="h-4 w-4 mr-1" /> Filters
          </Button>
          <Select value={ordering} onValueChange={(v) => updateParam("ordering", v)}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="-name">Name Z-A</SelectItem>
              <SelectItem value="price">Price: Low to High</SelectItem>
              <SelectItem value="-price">Price: High to Low</SelectItem>
              <SelectItem value="-created_at">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-6">
        <aside className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-64 shrink-0 space-y-4`}>
          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <Input placeholder="Search products..." value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Brand</label>
            <Input placeholder="Filter by brand..." value={localBrand} onChange={(e) => { setLocalBrand(e.target.value); updateParam("brand__icontains", e.target.value); }} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Price Range (KSH)</label>
            <div className="flex gap-2">
              <Input type="number" placeholder="Min" value={localPriceMin} onChange={(e) => { setLocalPriceMin(e.target.value); updateParam("price__gte", e.target.value); }} />
              <Input type="number" placeholder="Max" value={localPriceMax} onChange={(e) => { setLocalPriceMax(e.target.value); updateParam("price__lte", e.target.value); }} />
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={() => { setLocalSearch(""); setLocalBrand(""); setLocalPriceMin(""); setLocalPriceMax(""); setSearchParams({}); }}>
            Clear Filters
          </Button>
        </aside>

        <div className="flex-1">
          {loading ? (
            <ProductGridSkeleton />
          ) : products.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <p className="text-4xl">🔍</p>
              <h3 className="text-xl font-semibold">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => updateParam("page", String(page - 1))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const p = i + 1;
                    return (
                      <Button key={p} variant={p === page ? "default" : "outline"} size="sm" onClick={() => updateParam("page", String(p))}>
                        {p}
                      </Button>
                    );
                  })}
                  <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => updateParam("page", String(page + 1))}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
