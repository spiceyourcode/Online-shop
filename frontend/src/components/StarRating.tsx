import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

const StarRating = ({ rating, maxStars = 5, size = 16, interactive = false, onRate }: StarRatingProps) => {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxStars }, (_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(i + 1)}
            className={cn("transition-colors", interactive && "cursor-pointer hover:scale-110")}
          >
            <Star
              size={size}
              className={cn(
                filled ? "fill-accent text-accent" :
                half ? "fill-accent/50 text-accent" :
                "text-muted-foreground/30"
              )}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
