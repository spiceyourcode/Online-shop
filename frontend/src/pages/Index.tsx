import Header from "@/components/Header";
import Categories from "@/components/Categories";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { useSearchParams } from "react-router-dom";

const Index = () => {
  const [searchParams] = useSearchParams();
  const hasFilters = searchParams.toString().length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Categories />
      <main className="flex-1">
        {!hasFilters && <Hero />}
        <ProductGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
