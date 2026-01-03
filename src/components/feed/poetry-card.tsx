"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";
import Link from "next/link";

interface Post {
  id: string;
  content: string;
  author: string | null;
  source: string | null;
  type: "poetry" | "prose" | "quote";
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  isLiked?: boolean;
  isSaved?: boolean;
  user?: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  } | null;
}

interface PoetryCardProps {
  post: Post;
  isAuthenticated: boolean;
  onAuthRequired: () => void;
  onOpenComments: () => void;
  onUpdate: (updates: Partial<Post>) => void;
}

export function PoetryCard({
  post,
  isAuthenticated,
  onAuthRequired,
  onOpenComments,
  onUpdate,
}: PoetryCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked ?? false);
  const [isSaved, setIsSaved] = useState(post.isSaved ?? false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [showHeart, setShowHeart] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const lastTapRef = useRef<number>(0);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsLiked(post.isLiked ?? false);
    setIsSaved(post.isSaved ?? false);
    setLikesCount(post.likesCount);
    setShowActions(false);
  }, [post.id, post.isLiked, post.isSaved, post.likesCount]);

  useEffect(() => {
    if (showActions) {
      hideTimeoutRef.current = setTimeout(() => {
        setShowActions(false);
      }, 4000);
    }
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [showActions]);

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    // Don't trigger on link clicks
    if ((e.target as HTMLElement).closest('a')) return;

    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;

    if (timeSinceLastTap < 300) {
      if (!isLiked) {
        handleLike();
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 800);
      }
    } else {
      setShowActions((prev) => !prev);
    }
    lastTapRef.current = now;
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }

    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikesCount((prev) => (newLiked ? prev + 1 : prev - 1));

    try {
      await fetch(`/api/posts/${post.id}/like`, {
        method: newLiked ? "POST" : "DELETE",
      });
      onUpdate({
        isLiked: newLiked,
        likesCount: newLiked ? likesCount + 1 : likesCount - 1,
      });
    } catch {
      setIsLiked(!newLiked);
      setLikesCount((prev) => (newLiked ? prev - 1 : prev + 1));
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }

    const newSaved = !isSaved;
    setIsSaved(newSaved);

    try {
      await fetch(`/api/posts/${post.id}/save`, {
        method: newSaved ? "POST" : "DELETE",
      });
      onUpdate({ isSaved: newSaved });
    } catch {
      setIsSaved(!newSaved);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/post/${post.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.author || "Poetry",
          text: post.content.slice(0, 100),
          url,
        });
      } catch {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  const lines = post.content.split("\n");

  // Fast, clean animation for lines
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.015,
        delayChildren: 0,
      },
    },
  };

  const lineVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className="h-full w-full flex flex-col select-none">
      {/* Double-tap heart animation */}
      <AnimatePresence>
        {showHeart && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <Heart className="w-20 h-20 text-red-500 fill-red-500 drop-shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable content */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide touch-pan-y"
        onClick={handleTap}
      >
        <div className="min-h-full flex items-center justify-center px-8 py-16 pb-40">
          <div className="max-w-md w-full">
            {/* The poem with staggered animation */}
            <motion.div
              key={post.id}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center poetry-content"
            >
              {lines.map((line, i) => {
                if (line.trim() === "") {
                  return (
                    <motion.div
                      key={i}
                      variants={lineVariants}
                      className="h-6"
                      aria-hidden="true"
                    />
                  );
                }
                return (
                  <motion.p
                    key={i}
                    variants={lineVariants}
                    className="text-text-primary tracking-wide"
                    style={{
                      textShadow: "0 0 40px rgba(255,255,255,0.03)",
                    }}
                  >
                    {line}
                  </motion.p>
                );
              })}

              {/* Attribution with fade */}
              <motion.div
                variants={lineVariants}
                className="mt-12 pt-8 border-t border-border/30"
              >
                {post.user ? (
                  <Link
                    href={`/${post.user.username}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-text-muted text-xs font-light tracking-[0.3em] uppercase hover:text-text-secondary transition-colors duration-300"
                  >
                    {post.user.displayName || `@${post.user.username}`}
                  </Link>
                ) : post.author ? (
                  <Link
                    href={`/author/${encodeURIComponent(post.author.toLowerCase().replace(/\s+/g, "-"))}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-text-muted text-xs font-light tracking-[0.3em] uppercase hover:text-text-secondary transition-colors duration-300"
                  >
                    {post.author}
                  </Link>
                ) : (
                  <span className="text-text-muted text-xs font-light tracking-[0.3em] uppercase">
                    Unknown
                  </span>
                )}
                {post.source && (
                  <p className="text-text-muted/60 text-xs italic mt-2 tracking-wide">
                    {post.source}
                  </p>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating action bar */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-30"
          >
            <div className="flex items-center gap-8 px-8 py-4 rounded-2xl bg-bg-primary/90 backdrop-blur-xl border border-border/30 shadow-2xl">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
                className="flex items-center gap-2.5 group"
              >
                <Heart
                  className={`w-5 h-5 transition-all duration-200 ${
                    isLiked
                      ? "text-red-500 fill-red-500 scale-110"
                      : "text-text-secondary group-hover:text-text-primary"
                  }`}
                />
                <span className="text-sm text-text-muted tabular-nums">
                  {likesCount > 999
                    ? `${(likesCount / 1000).toFixed(1)}k`
                    : likesCount}
                </span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenComments();
                }}
                className="flex items-center gap-2.5 group"
              >
                <MessageCircle className="w-5 h-5 text-text-secondary group-hover:text-text-primary transition-colors" />
                <span className="text-sm text-text-muted tabular-nums">
                  {post.commentsCount}
                </span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
                className="group"
              >
                <Bookmark
                  className={`w-5 h-5 transition-all duration-200 ${
                    isSaved
                      ? "text-accent fill-accent scale-110"
                      : "text-text-secondary group-hover:text-text-primary"
                  }`}
                />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare();
                }}
                className="group"
              >
                <Share2 className="w-5 h-5 text-text-secondary group-hover:text-text-primary transition-colors" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
