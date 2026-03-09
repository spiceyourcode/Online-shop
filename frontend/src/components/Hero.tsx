import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl space-y-6"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-white/20 text-sm font-medium backdrop-blur-sm">
            🔥 New Arrivals
          </span>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Discover Premium Products at Unbeatable Prices
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-lg">
            Shop the latest electronics, fashion, and lifestyle products with free delivery across Kenya.
          </p>
          <div className="flex gap-3">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
              <Link to="/?ordering=-created_at">
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link to="/?ordering=price">View Deals</Link>
            </Button>
          </div>
        </motion.div>
      </div>
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-10 mix-blend-overlay" />
    </section>
  );
};

export default Hero;
