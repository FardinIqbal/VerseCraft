"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Bookmark, Share2, Volume2, VolumeX } from "lucide-react";
import { Avatar } from "../ui/avatar";

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

interface ReelCardProps {
  post: Post;
  isAuthenticated: boolean;
  onAuthRequired: () => void;
  onOpenComments: () => void;
  onUpdate: (updates: Partial<Post>) => void;
}

export function ReelCard({
  post,
  isAuthenticated,
  onAuthRequired,
  onOpenComments,
  onUpdate,
}: ReelCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked ?? false);
  const [isSaved, setIsSaved] = useState(post.isSaved ?? false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [showHeart, setShowHeart] = useState(false);
  const lastTapRef = useRef<number>(0);

  // Double tap to like
  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      handleLike();
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 1000);
    }
    lastTapRef.current = now;
  };

  // Like action
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
      onUpdate({ isLiked: newLiked, likesCount: newLiked ? likesCount + 1 : likesCount - 1 });
    } catch {
      setIsLiked(!newLiked);
      setLikesCount((prev) => (newLiked ? prev - 1 : prev + 1));
    }
  };

  // Save action
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

  // Share action
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${post.author || "Anonymous"} - VerseCraft`,
          text: post.content.slice(0, 100) + "...",
          url: window.location.origin + `/post/${post.id}`,
        });
      } catch {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.origin + `/post/${post.id}`);
    }
  };

  // Format content with line breaks
  const formatContent = (content: string) => {
    return content.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        {i < content.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  // Get background gradient based on post type
  const getBackground = () => {
    switch (post.type) {
      case "poetry":
        return "bg-gradient-to-b from-background via-background to-background-secondary";
      case "prose":
        return "bg-gradient-to-b from-background via-background-secondary/50 to-background";
      case "quote":
        return "bg-gradient-to-b from-background to-accent/5";
      default:
        return "bg-background";
    }
  };

  return (
    <div
      className={`h-full w-full flex flex-col ${getBackground()}`}
      onClick={handleDoubleTap}
    >
      {/* Content area */}
      <div className="flex-1 flex items-center justify-center px-6 pb-32 pt-20 relative">
        {/* Double-tap heart animation */}
        {showHeart && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: [0.5, 1.2, 1] }}
              transition={{ duration: 0.4 }}
            >
              <Heart className="w-32 h-32 text-red-500 fill-red-500 drop-shadow-lg" />
            </motion.div>
          </motion.div>
        )}

        {/* Quote marks for quotes */}
        {post.type === "quote" && (
          <div className="absolute top-24 left-8 text-accent/20 text-[120px] font-serif leading-none select-none">
            &ldquo;
          </div>
        )}

        {/* Main content */}
        <div className="max-w-lg w-full text-center">
          <p
            className={`text-text-primary leading-relaxed ${
              post.type === "quote"
                ? "text-xl md:text-2xl font-medium"
                : "text-lg md:text-xl font-serif"
            } ${post.content.length > 500 ? "text-base md:text-lg" : ""}`}
          >
            {formatContent(post.content)}
          </p>
        </div>
      </div>

      {/* Side actions (Reels-style) */}
      <div className="fixed right-4 bottom-48 flex flex-col items-center gap-6 z-40">
        {/* Like button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
          className="flex flex-col items-center gap-1"
        >
          <div
            className={`p-3 rounded-full ${
              isLiked ? "bg-red-500/20" : "bg-white/10"
            } backdrop-blur-sm`}
          >
            <Heart
              className={`w-7 h-7 ${
                isLiked ? "text-red-500 fill-red-500" : "text-white"
              }`}
            />
          </div>
          <span className="text-white text-xs font-medium">
            {likesCount > 999 ? `${(likesCount / 1000).toFixed(1)}k` : likesCount}
          </span>
        </motion.button>

        {/* Comments button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onOpenComments();
          }}
          className="flex flex-col items-center gap-1"
        >
          <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm">
            <MessageCircle className="w-7 h-7 text-white" />
          </div>
          <span className="text-white text-xs font-medium">
            {post.commentsCount}
          </span>
        </motion.button>

        {/* Save button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            handleSave();
          }}
          className="flex flex-col items-center gap-1"
        >
          <div
            className={`p-3 rounded-full ${
              isSaved ? "bg-accent/20" : "bg-white/10"
            } backdrop-blur-sm`}
          >
            <Bookmark
              className={`w-7 h-7 ${
                isSaved ? "text-accent fill-accent" : "text-white"
              }`}
            />
          </div>
          <span className="text-white text-xs font-medium">Save</span>
        </motion.button>

        {/* Share button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            handleShare();
          }}
          className="flex flex-col items-center gap-1"
        >
          <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm">
            <Share2 className="w-7 h-7 text-white" />
          </div>
          <span className="text-white text-xs font-medium">Share</span>
        </motion.button>
      </div>

      {/* Bottom info overlay */}
      <div className="fixed bottom-0 left-0 right-16 p-6 bg-gradient-to-t from-background via-background/80 to-transparent z-30">
        <div className="flex items-end gap-4">
          {/* Author avatar or icon */}
          <div className="flex-shrink-0">
            {post.user ? (
              <Avatar
                src={post.user.avatarUrl}
                alt={post.user.displayName || post.user.username}
                size="lg"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-accent font-serif text-xl">
                  {post.author?.[0] || "?"}
                </span>
              </div>
            )}
          </div>

          {/* Author info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-lg truncate">
              {post.user
                ? post.user.displayName || `@${post.user.username}`
                : post.author || "Anonymous"}
            </h3>
            {post.source && (
              <p className="text-text-secondary text-sm truncate italic">
                {post.source}
              </p>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  post.type === "poetry"
                    ? "bg-purple-500/20 text-purple-300"
                    : post.type === "prose"
                    ? "bg-blue-500/20 text-blue-300"
                    : "bg-amber-500/20 text-amber-300"
                }`}
              >
                {post.type}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
