"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ReelCard } from "./reel-card";
import { CommentsDrawer } from "../post/comments-drawer";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/use-auth";

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

export function ReelsFeed() {
  const { user, signInWithGoogle, signInWithGithub } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch posts
  const fetchPosts = useCallback(async (offset = 0) => {
    try {
      const response = await fetch(`/api/feed?limit=20&offset=${offset}`);
      const data = await response.json();
      if (offset === 0) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Load more when near the end
  useEffect(() => {
    if (currentIndex >= posts.length - 3 && posts.length > 0) {
      fetchPosts(posts.length);
    }
  }, [currentIndex, posts.length, fetchPosts]);

  // Navigate between posts
  const goToNext = useCallback(() => {
    if (currentIndex < posts.length - 1 && !isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => prev + 1);
      setTimeout(() => setIsAnimating(false), 400);
    }
  }, [currentIndex, posts.length, isAnimating]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => prev - 1);
      setTimeout(() => setIsAnimating(false), 400);
    }
  }, [currentIndex, isAnimating]);

  // Handle swipe gestures
  const handleDragEnd = (_: never, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.y < -threshold) {
      goToNext();
    } else if (info.offset.y > threshold) {
      goToPrev();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "j") goToNext();
      if (e.key === "ArrowUp" || e.key === "k") goToPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev]);

  // Mouse wheel navigation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let wheelTimeout: NodeJS.Timeout;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        if (e.deltaY > 30) goToNext();
        else if (e.deltaY < -30) goToPrev();
      }, 50);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [goToNext, goToPrev]);

  // Handle like/save requiring auth
  const handleAuthRequired = () => {
    setShowAuthModal(true);
  };

  // Update post in state after like/save
  const updatePost = (postId: string, updates: Partial<Post>) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, ...updates } : p))
    );
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
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
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <p className="text-text-secondary">No poems yet</p>
      </div>
    );
  }

  const currentPost = posts[currentIndex];

  return (
    <>
      <div
        ref={containerRef}
        className="fixed inset-0 bg-background overflow-hidden touch-none"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={currentPost.id}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="absolute inset-0"
          >
            <ReelCard
              post={currentPost}
              isAuthenticated={!!user}
              onAuthRequired={handleAuthRequired}
              onOpenComments={() => setShowComments(true)}
              onUpdate={(updates) => updatePost(currentPost.id, updates)}
            />
          </motion.div>
        </AnimatePresence>

        {/* Progress indicator */}
        <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1 z-50">
          {posts.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((_, i) => {
            const actualIndex = Math.max(0, currentIndex - 2) + i;
            return (
              <div
                key={actualIndex}
                className={`w-1 rounded-full transition-all duration-300 ${
                  actualIndex === currentIndex
                    ? "h-6 bg-accent"
                    : "h-2 bg-text-tertiary/30"
                }`}
              />
            );
          })}
        </div>

        {/* Swipe hint for first-time users */}
        {currentIndex === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 2 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 text-text-tertiary text-sm flex flex-col items-center gap-2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.div>
            <span>Swipe to explore</span>
          </motion.div>
        )}
      </div>

      {/* Comments drawer */}
      <CommentsDrawer
        postId={currentPost.id}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />

      {/* Auth modal */}
      <Modal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Sign in to continue"
      >
        <div className="space-y-4">
          <p className="text-[var(--text-secondary)]">
            Sign in to like, save, and share your favorite literature.
          </p>
          <div className="space-y-2">
            <Button
              onClick={signInWithGoogle}
              variant="secondary"
              className="w-full"
            >
              Continue with Google
            </Button>
            <Button
              onClick={signInWithGithub}
              variant="secondary"
              className="w-full"
            >
              Continue with GitHub
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
