"use client";

import { motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Post {
  id: string;
  content: string;
  author: string | null;
  source?: string | null;
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

interface PostsGridProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
}

export function PostsGrid({ posts, onPostClick }: PostsGridProps) {
  if (posts.length === 0) {
    return (
      <div className="p-8 text-center text-text-muted">
        No posts yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-0.5">
      {posts.map((post, index) => (
        <motion.button
          key={post.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onPostClick(post)}
          className={cn(
            "relative aspect-square overflow-hidden",
            "bg-bg-secondary hover:bg-bg-tertiary transition-colors",
            "group cursor-pointer"
          )}
        >
          {/* Content Preview */}
          <div className="absolute inset-0 p-3 flex items-center justify-center">
            <p className={cn(
              "text-center font-serif text-text-primary line-clamp-4",
              "text-[10px] sm:text-xs md:text-sm leading-tight"
            )}>
              {post.content.slice(0, 100)}
              {post.content.length > 100 ? "..." : ""}
            </p>
          </div>

          {/* Type indicator */}
          <div className="absolute top-2 right-2">
            <span className={cn(
              "text-[8px] font-medium px-1.5 py-0.5 rounded-full",
              "bg-bg-tertiary/80 text-text-secondary"
            )}>
              {post.type}
            </span>
          </div>

          {/* Hover overlay with stats */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
            <div className="flex items-center gap-1 text-white">
              <Heart className="w-5 h-5 fill-white" />
              <span className="font-semibold">{post.likesCount}</span>
            </div>
            <div className="flex items-center gap-1 text-white">
              <MessageCircle className="w-5 h-5 fill-white" />
              <span className="font-semibold">{post.commentsCount}</span>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
