"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useRouter } from "next/navigation";
import { ReelCard } from "../feed/reel-card";
import { DailyVerse } from "../feed/daily-verse";
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
  const { user, supabaseUser, loading: authLoading, signInWithGoogle, signInWithGithub } = useAuth();
  const [activeTab, setActiveTab] = useState<"foryou" | "following">("foryou");
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [canNavigateUp, setCanNavigateUp] = useState(true);
  const [canNavigateDown, setCanNavigateDown] = useState(true);

  // Redirect to welcome page if not authenticated
  useEffect(() => {
    if (!authLoading && !supabaseUser) {
      router.push("/welcome");
    }
  }, [authLoading, supabaseUser, router]);

  // Fetch posts based on active tab
  const fetchPosts = useCallback(async (offset = 0) => {
    try {
      const endpoint = activeTab === "following" && user
        ? `/api/feed?limit=20&offset=${offset}&following=true`
        : `/api/feed?limit=20&offset=${offset}`;

      const response = await fetch(endpoint);
      const data = await response.json();

      if (offset === 0) {
        setPosts(data.posts);
        setCurrentIndex(0);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, user]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Load more when near the end
  useEffect(() => {
    if (currentIndex >= posts.length - 3 && posts.length > 0) {
      fetchPosts(posts.length);
    }
  }, [currentIndex, posts.length, fetchPosts]);

  // Handle scroll boundary updates from ReelCard
  const handleScrollBoundary = useCallback((atTop: boolean, atBottom: boolean) => {
    setCanNavigateUp(atTop);
    setCanNavigateDown(atBottom);
  }, []);

  // Navigate between posts
  const goToNext = useCallback(() => {
    if (currentIndex < posts.length - 1 && !isAnimating && canNavigateDown) {
      setIsAnimating(true);
      setCurrentIndex((prev) => prev + 1);
      setTimeout(() => setIsAnimating(false), 400);
    }
  }, [currentIndex, posts.length, isAnimating, canNavigateDown]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0 && !isAnimating && canNavigateUp) {
      setIsAnimating(true);
      setCurrentIndex((prev) => prev - 1);
      setTimeout(() => setIsAnimating(false), 400);
    }
  }, [currentIndex, isAnimating, canNavigateUp]);

  // Handle swipe gestures
  const handleDragEnd = (_: never, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.y < -threshold && canNavigateDown) {
      goToNext();
    } else if (info.offset.y > threshold && canNavigateUp) {
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

  // Update post in state after like/save
  const updatePost = (postId: string, updates: Partial<Post>) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, ...updates } : p))
    );
  };

  if (authLoading || (!supabaseUser && !loading)) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-bg-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-text-tertiary border-t-accent" />
        </div>
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

  return (
    <>
      <div className="fixed inset-0 bg-bg-primary overflow-hidden touch-none flex flex-col">
        {/* Header with tabs */}
        <div className="relative z-50 pt-safe">
          {/* Daily Verse Stories */}
          <DailyVerse onAuthRequired={() => setShowAuthModal(true)} />

          {/* Feed Tabs */}
          <div className="flex items-center justify-center border-b border-border bg-bg-primary/80 backdrop-blur-lg">
            <button
              onClick={() => setActiveTab("foryou")}
              className={cn(
                "px-6 py-3 text-sm font-medium transition-colors relative",
                activeTab === "foryou"
                  ? "text-text-primary"
                  : "text-text-muted"
              )}
            >
              For You
              {activeTab === "foryou" && (
                <motion.div
                  layoutId="feedTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-text-primary"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("following")}
              className={cn(
                "px-6 py-3 text-sm font-medium transition-colors relative",
                activeTab === "following"
                  ? "text-text-primary"
                  : "text-text-muted"
              )}
            >
              Following
              {activeTab === "following" && (
                <motion.div
                  layoutId="feedTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-text-primary"
                />
              )}
            </button>
          </div>
        </div>

        {/* Reels Content */}
        <div className="flex-1 relative">
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
                onAuthRequired={() => setShowAuthModal(true)}
                onOpenComments={() => setShowComments(true)}
                onUpdate={(updates) => updatePost(currentPost.id, updates)}
                onScrollBoundary={handleScrollBoundary}
              />
            </motion.div>
          </AnimatePresence>

          {/* Progress indicator */}
          <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1 z-40">
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
              className="fixed bottom-24 left-1/2 -translate-x-1/2 text-text-tertiary text-sm flex flex-col items-center gap-2 z-40"
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
          <p className="text-text-secondary">
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
