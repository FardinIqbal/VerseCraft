"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PostCard, type PostData } from "@/components/post/post-card";
import { PostCardSkeleton } from "@/components/ui/skeleton";
import { CommentsDrawer } from "@/components/post/comments-drawer";
import { useAuth } from "@/hooks/use-auth";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface FeedProps {
  initialPosts?: PostData[];
}

export function Feed({ initialPosts = [] }: FeedProps) {
  const router = useRouter();
  const { user, supabaseUser } = useAuth();
  const [posts, setPosts] = useState<PostData[]>(initialPosts);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(initialPosts.length === 0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [commentsPostId, setCommentsPostId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchPosts = useCallback(
    async (cursorParam?: string) => {
      try {
        const params = new URLSearchParams();
        if (cursorParam) params.set("cursor", cursorParam);
        if (supabaseUser) params.set("userId", supabaseUser.id);

        const res = await fetch(`/api/feed?${params}`);
        const data = await res.json();

        if (cursorParam) {
          setPosts((prev) => [...prev, ...data.posts]);
        } else {
          setPosts(data.posts);
        }

        setCursor(data.nextCursor);
        setHasMore(data.hasMore);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    },
    [supabaseUser]
  );

  useEffect(() => {
    if (initialPosts.length === 0) {
      fetchPosts().finally(() => setLoading(false));
    }
  }, [fetchPosts, initialPosts.length]);

  useEffect(() => {
    if (!hasMore || loadingMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setLoadingMore(true);
          fetchPosts(cursor || undefined).finally(() => setLoadingMore(false));
        }
      },
      { rootMargin: "200px" }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [hasMore, loadingMore, cursor, fetchPosts]);

  const handleLike = async (postId: string) => {
    const res = await fetch(`/api/posts/${postId}/like`, {
      method: "POST",
    });

    if (!res.ok) throw new Error("Failed to like post");

    const data = await res.json();

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: data.liked,
              likesCount: data.liked
                ? post.likesCount + 1
                : post.likesCount - 1,
            }
          : post
      )
    );
  };

  const handleSave = async (postId: string) => {
    const res = await fetch(`/api/posts/${postId}/save`, {
      method: "POST",
    });

    if (!res.ok) throw new Error("Failed to save post");

    const data = await res.json();

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, isSaved: data.saved } : post
      )
    );
  };

  if (loading) {
    return (
      <div className="divide-y divide-[var(--border)]">
        {[...Array(5)].map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="divide-y divide-[var(--border)]">
        <AnimatePresence mode="popLayout">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <PostCard
                post={post}
                onLike={handleLike}
                onSave={handleSave}
                onComment={(postId) => setCommentsPostId(postId)}
                isAuthenticated={!!user}
                onAuthRequired={() => setShowAuthModal(true)}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {hasMore && (
          <div ref={loadMoreRef} className="p-8 flex justify-center">
            {loadingMore && (
              <Loader2 className="w-6 h-6 animate-spin text-[var(--text-muted)]" />
            )}
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <div className="p-8 text-center text-[var(--text-muted)]">
            You&apos;ve reached the end
          </div>
        )}
      </div>

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
              onClick={() => router.push("/login")}
              className="w-full"
            >
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

      <CommentsDrawer
        postId={commentsPostId || ""}
        isOpen={!!commentsPostId}
        onClose={() => setCommentsPostId(null)}
      />
    </>
  );
}
