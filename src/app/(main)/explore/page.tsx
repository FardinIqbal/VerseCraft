"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, BookOpen } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { PostsGrid } from "@/components/post/posts-grid";
import { PostModal } from "@/components/post/post-modal";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
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
  isLiked?: boolean;
  isSaved?: boolean;
  user?: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  } | null;
}

interface Author {
  id: string;
  name: string;
  slug: string;
  portraitUrl: string | null;
  era: string | null;
  worksCount: number;
  followersCount: number;
}

export default function ExplorePage() {
  const { user } = useAuth();
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"trending" | "authors">("trending");

  useEffect(() => {
    const fetchExplore = async () => {
      try {
        const [postsRes, authorsRes] = await Promise.all([
          fetch("/api/feed?limit=30&sort=popular"),
          fetch("/api/authors?limit=20"),
        ]);

        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setTrendingPosts(postsData.posts || []);
        }

        if (authorsRes.ok) {
          const authorsData = await authorsRes.json();
          setAuthors(authorsData.authors || []);
        }
      } catch (error) {
        console.error("Error fetching explore:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExplore();
  }, []);

  if (loading) {
    return (
      <div className="p-4 space-y-6">
        <div className="grid grid-cols-3 gap-0.5">
          {[...Array(9)].map((_, i) => (
            <Skeleton key={i} className="aspect-square" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Tabs */}
      <div className="sticky top-0 z-30 bg-bg-primary/80 backdrop-blur-lg border-b border-border">
        <div className="flex">
          <button
            onClick={() => setActiveTab("trending")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors relative",
              activeTab === "trending"
                ? "text-text-primary"
                : "text-text-muted"
            )}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Trending</span>
            {activeTab === "trending" && (
              <motion.div
                layoutId="exploreTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("authors")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors relative",
              activeTab === "authors"
                ? "text-text-primary"
                : "text-text-muted"
            )}
          >
            <Users className="w-4 h-4" />
            <span>Authors</span>
            {activeTab === "authors" && (
              <motion.div
                layoutId="exploreTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
              />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === "trending" ? (
        <PostsGrid
          posts={trendingPosts}
          onPostClick={(post) => setSelectedPost(post as Post)}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {authors.map((author, index) => (
            <motion.div
              key={author.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={`/author/${author.slug}`}
                className="block p-4 rounded-xl bg-bg-secondary hover:bg-bg-tertiary transition-colors text-center"
              >
                {author.portraitUrl ? (
                  <img
                    src={author.portraitUrl}
                    alt={author.name}
                    className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full mx-auto mb-3 bg-accent/20 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-accent" />
                  </div>
                )}
                <h3 className="font-semibold text-text-primary truncate">
                  {author.name}
                </h3>
                {author.era && (
                  <p className="text-xs text-text-muted mt-1">{author.era}</p>
                )}
                <div className="flex items-center justify-center gap-4 mt-2 text-xs text-text-secondary">
                  <span>{author.worksCount} works</span>
                  <span>{author.followersCount} followers</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Post Modal */}
      <PostModal
        post={selectedPost}
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        isAuthenticated={!!user}
        onAuthRequired={() => setShowAuthModal(true)}
        onUpdate={(postId, updates) => {
          setTrendingPosts((prev) =>
            prev.map((p) => (p.id === postId ? { ...p, ...updates } : p))
          );
        }}
      />

      {/* Auth Modal */}
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
            <Link
              href="/login"
              className="block w-full py-2 px-4 text-center rounded-lg bg-accent text-bg-primary font-medium hover:bg-accent-hover transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
}
