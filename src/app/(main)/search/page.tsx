"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PostCard, type PostData } from "@/components/post/post-card";
import { Avatar } from "@/components/ui/avatar";
import { PostCardSkeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface UserResult {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}

export default function SearchPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"posts" | "users">("posts");
  const [posts, setPosts] = useState<PostData[]>([]);
  const [users, setUsers] = useState<UserResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setPosts([]);
      setUsers([]);
      return;
    }

    const search = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&type=${activeTab}`
        );
        if (res.ok) {
          const data = await res.json();
          if (activeTab === "posts") {
            setPosts(data.results);
          } else {
            setUsers(data.results);
          }
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query, activeTab]);

  const handleLike = async (postId: string) => {
    const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    if (res.ok) {
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
    }
  };

  const handleSave = async (postId: string) => {
    const res = await fetch(`/api/posts/${postId}/save`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, isSaved: data.saved } : post
        )
      );
    }
  };

  return (
    <div>
      {/* Search Input */}
      <div className="sticky top-14 z-30 bg-[var(--bg-primary)]/80 backdrop-blur-lg p-4 border-b border-[var(--border)]">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts, authors, or users..."
            className={cn(
              "w-full pl-10 pr-10 py-3 rounded-full",
              "bg-[var(--bg-secondary)] text-[var(--text-primary)]",
              "border border-[var(--border)] focus:border-[var(--accent)]",
              "placeholder:text-[var(--text-muted)]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-0"
            )}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setActiveTab("posts")}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
              activeTab === "posts"
                ? "bg-[var(--accent)] text-[var(--bg-primary)]"
                : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
            )}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
              activeTab === "users"
                ? "bg-[var(--accent)] text-[var(--bg-primary)]"
                : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
            )}
          >
            Users
          </button>
        </div>
      </div>

      {/* Results */}
      <div>
        {!query && (
          <div className="p-8 text-center text-[var(--text-muted)]">
            Search for poetry, prose, authors, or users
          </div>
        )}

        {loading && query && (
          <div>
            {[...Array(3)].map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && query && activeTab === "posts" && posts.length === 0 && (
          <div className="p-8 text-center text-[var(--text-muted)]">
            No posts found
          </div>
        )}

        {!loading && query && activeTab === "users" && users.length === 0 && (
          <div className="p-8 text-center text-[var(--text-muted)]">
            No users found
          </div>
        )}

        {!loading && activeTab === "posts" && (
          <motion.div layout>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onSave={handleSave}
                isAuthenticated={!!user}
              />
            ))}
          </motion.div>
        )}

        {!loading && activeTab === "users" && (
          <motion.div layout className="divide-y divide-[var(--border)]">
            {users.map((userResult) => (
              <Link
                key={userResult.id}
                href={`/${userResult.username}`}
                className="flex items-center gap-3 p-4 hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <Avatar
                  src={userResult.avatarUrl}
                  fallback={userResult.displayName || userResult.username}
                  size="md"
                />
                <div>
                  <p className="font-medium">
                    {userResult.displayName || userResult.username}
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">
                    @{userResult.username}
                  </p>
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
