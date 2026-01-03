"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { PoetryCard } from "../feed/poetry-card";
import { CommentsDrawer } from "../post/comments-drawer";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

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

export function HomePage() {
  const router = useRouter();
  const { user, supabaseUser, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"foryou" | "following">("foryou");
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  // Touch handling
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  useEffect(() => {
    if (!authLoading && !supabaseUser) {
      router.push("/welcome");
    }
  }, [authLoading, supabaseUser, router]);

  const fetchPosts = useCallback(
    async (nextCursor?: string | null) => {
      if (isFetching) return;
      setIsFetching(true);

      try {
        const params = new URLSearchParams();
        if (nextCursor) params.set("cursor", nextCursor);
        if (supabaseUser) params.set("userId", supabaseUser.id);

        const endpoint = `/api/feed?${params}`;
        const response = await fetch(endpoint);
        const data = await response.json();

        if (!nextCursor) {
          setPosts(data.posts);
          setCurrentIndex(0);
        } else {
          setPosts((prev) => [...prev, ...data.posts]);
        }

        setCursor(data.nextCursor);
        setHasMore(data.hasMore);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    },
    [supabaseUser, isFetching]
  );

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  // Load more when near the end
  useEffect(() => {
    if (currentIndex >= posts.length - 3 && hasMore && !isFetching && cursor) {
      fetchPosts(cursor);
    }
  }, [currentIndex, posts.length, hasMore, cursor, isFetching, fetchPosts]);

  const goNext = useCallback(() => {
    if (currentIndex < posts.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, posts.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Native touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const deltaY = e.changedTouches[0].clientY - touchStartY.current;

      // Only trigger if horizontal movement is dominant and significant
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
        if (deltaX < 0) {
          goNext();
        } else {
          goPrev();
        }
      }
    },
    [goNext, goPrev]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "l") goNext();
      if (e.key === "ArrowLeft" || e.key === "h") goPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  const updatePost = (postId: string, updates: Partial<Post>) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, ...updates } : p))
    );
  };

  if (authLoading || (!supabaseUser && !loading)) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-bg-primary">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-text-tertiary border-t-accent" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-bg-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-text-tertiary border-t-accent" />
          <p className="text-text-secondary font-serif italic">
            Loading verses...
          </p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-bg-primary">
        <div className="text-center p-8">
          <p className="text-text-secondary mb-4">
            {activeTab === "following"
              ? "Follow some poets to see their work here"
              : "No poems yet"}
          </p>
          {activeTab === "following" && (
            <Button onClick={() => setActiveTab("foryou")}>
              Explore For You
            </Button>
          )}
        </div>
      </div>
    );
  }

  const currentPost = posts[currentIndex];

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  return (
    <>
      <div className="fixed inset-0 bg-bg-primary overflow-hidden flex flex-col">
        {/* Minimal header */}
        <div className="relative z-50 border-b border-border/50 bg-bg-primary">
          <div className="flex items-center justify-center py-2.5">
            <button
              onClick={() => setActiveTab("foryou")}
              className={cn(
                "px-5 py-1.5 text-sm font-medium transition-colors relative",
                activeTab === "foryou" ? "text-text-primary" : "text-text-muted"
              )}
            >
              For You
              {activeTab === "foryou" && (
                <motion.div
                  layoutId="feedTab"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-text-primary rounded-full"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("following")}
              className={cn(
                "px-5 py-1.5 text-sm font-medium transition-colors relative",
                activeTab === "following"
                  ? "text-text-primary"
                  : "text-text-muted"
              )}
            >
              Following
              {activeTab === "following" && (
                <motion.div
                  layoutId="feedTab"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-text-primary rounded-full"
                />
              )}
            </button>
          </div>
        </div>

        {/* Swipe content */}
        <div
          className="flex-1 relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 500, damping: 40 },
                opacity: { duration: 0.15 },
              }}
              className="absolute inset-0"
            >
              <PoetryCard
                post={currentPost}
                isAuthenticated={!!user}
                onAuthRequired={() => setShowAuthModal(true)}
                onOpenComments={() => setShowComments(true)}
                onUpdate={(updates) => updatePost(currentPost.id, updates)}
              />
            </motion.div>
          </AnimatePresence>

          {/* Elegant progress indicator */}
          <div className="absolute top-0 left-0 right-0 h-[3px] z-40 overflow-hidden">
            {/* Background track */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border/10 to-transparent" />

            {/* Progress fill with glow */}
            <motion.div
              className="h-full relative"
              initial={false}
              animate={{
                width: `${((currentIndex + 1) / posts.length) * 100}%`,
              }}
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            >
              {/* Main bar */}
              <div className="absolute inset-0 bg-gradient-to-r from-text-tertiary/20 via-text-secondary/40 to-text-tertiary/20" />

              {/* Glowing tip */}
              <motion.div
                className="absolute right-0 top-0 w-8 h-full"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
                  backgroundSize: "200% 100%",
                }}
                animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      <CommentsDrawer
        postId={currentPost.id}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />

      <Modal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Sign in to continue"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            Sign in to like, save, and share poetry.
          </p>
          <div className="space-y-2">
            <Button onClick={() => router.push("/login")} className="w-full">
              Sign In
            </Button>
            <Button
              onClick={() => router.push("/signup")}
              variant="secondary"
              className="w-full"
            >
              Create Account
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
