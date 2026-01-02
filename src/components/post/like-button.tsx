"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";

interface LikeButtonProps {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
  onLike: (postId: string) => Promise<void>;
  disabled?: boolean;
}

export function LikeButton({
  postId,
  initialLiked,
  initialCount,
  onLike,
  disabled,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = async () => {
    if (disabled) return;

    // Optimistic update
    setLiked(!liked);
    setCount((prev) => (liked ? prev - 1 : prev + 1));
    setIsAnimating(true);

    try {
      await onLike(postId);
    } catch {
      // Revert on error
      setLiked(liked);
      setCount(initialCount);
    }

    setTimeout(() => setIsAnimating(false), 400);
  };

  return (
    <button
      onClick={handleLike}
      disabled={disabled}
      className={cn(
        "flex items-center gap-1.5 text-sm transition-colors",
        liked
          ? "text-[var(--like)]"
          : "text-[var(--text-muted)] hover:text-[var(--like)]",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className="relative">
        <motion.div
          animate={isAnimating ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart
            className={cn("w-5 h-5", liked && "fill-current")}
          />
        </motion.div>
        <AnimatePresence>
          {isAnimating && liked && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [1, 1, 0],
                    x: Math.cos((i * Math.PI) / 3) * 20,
                    y: Math.sin((i * Math.PI) / 3) * 20 - 10,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute top-1/2 left-1/2 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--like)]"
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>
      <span className="min-w-[1.5rem]">{formatNumber(count)}</span>
    </button>
  );
}
