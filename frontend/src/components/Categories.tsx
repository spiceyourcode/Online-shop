import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { categoriesAPI } from "@/api/services";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: number;
  name: string;
  slug: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const activeSlug = searchParams.get("category__slug");

  useEffect(() => {
    categoriesAPI.list().then(({ data }) => {
      setCategories(Array.isArray(data) ? data : data.results || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex gap-3 overflow-x-auto">
          {Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-8 w-24 rounded-full shrink-0" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="border-b bg-card">
      <div className="container mx-auto px-4 py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <Link
            to="/"
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              !activeSlug ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80 text-foreground"
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/?category__slug=${cat.slug}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeSlug === cat.slug ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80 text-foreground"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
