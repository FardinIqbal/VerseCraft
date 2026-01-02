"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Bookmark, Share2, ChevronDown } from "lucide-react";
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
  onScrollBoundary: (atTop: boolean, atBottom: boolean) => void;
}

export function ReelCard({
  post,
  isAuthenticated,
  onAuthRequired,
  onOpenComments,
  onUpdate,
  onScrollBoundary,
}: ReelCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked ?? false);
  const [isSaved, setIsSaved] = useState(post.isSaved ?? false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [showHeart, setShowHeart] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const lastTapRef = useRef<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Check if content is scrollable and update boundaries
  const checkScrollPosition = useCallback(() => {
    const el = contentRef.current;
    if (!el) {
      onScrollBoundary(true, true);
      return;
    }

    const atTop = el.scrollTop <= 5;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5;
    const isScrollable = el.scrollHeight > el.clientHeight;

    setCanScrollDown(isScrollable && !atBottom);
    onScrollBoundary(atTop, atBottom || !isScrollable);
  }, [onScrollBoundary]);

  // Initial check and on content change
  useEffect(() => {
    checkScrollPosition();
    // Reset scroll position when post changes
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [post.id, checkScrollPosition]);

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

  return (
    <div
      className="h-full w-full flex flex-col bg-background"
      onClick={handleDoubleTap}
    >
      {/* Scrollable content area */}
      <div
        ref={contentRef}
        onScroll={checkScrollPosition}
        className="flex-1 overflow-y-auto overflow-x-hidden px-6 pb-36 pt-16 scroll-smooth"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* Double-tap heart animation */}
        {showHeart && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
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

        {/* Main content - centered */}
        <div className="min-h-full flex items-center justify-center">
          <div className="max-w-lg w-full text-center py-8">
            <p
              className={`text-text-primary leading-relaxed font-serif ${
                post.content.length > 800
                  ? "text-base md:text-lg"
                  : post.content.length > 400
                  ? "text-lg md:text-xl"
                  : "text-xl md:text-2xl"
              }`}
            >
              {formatContent(post.content)}
            </p>
          </div>
        </div>
      </div>

      {/* Scroll indicator for long poems */}
      {canScrollDown && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-44 left-1/2 -translate-x-1/2 z-40"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="flex flex-col items-center text-text-tertiary"
          >
            <ChevronDown className="w-5 h-5" />
            <span className="text-xs">Scroll to read more</span>
          </motion.div>
        </motion.div>
      )}

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
              isLiked ? "bg-red-500/20" : "bg-bg-tertiary/80"
            } backdrop-blur-sm`}
          >
            <Heart
              className={`w-7 h-7 ${
                isLiked ? "text-red-500 fill-red-500" : "text-text-primary"
              }`}
            />
          </div>
          <span className="text-text-primary text-xs font-medium">
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
          <div className="p-3 rounded-full bg-bg-tertiary/80 backdrop-blur-sm">
            <MessageCircle className="w-7 h-7 text-text-primary" />
          </div>
          <span className="text-text-primary text-xs font-medium">
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
              isSaved ? "bg-accent/20" : "bg-bg-tertiary/80"
            } backdrop-blur-sm`}
          >
            <Bookmark
              className={`w-7 h-7 ${
                isSaved ? "text-accent fill-accent" : "text-text-primary"
              }`}
            />
          </div>
          <span className="text-text-primary text-xs font-medium">Save</span>
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
          <div className="p-3 rounded-full bg-bg-tertiary/80 backdrop-blur-sm">
            <Share2 className="w-7 h-7 text-text-primary" />
          </div>
          <span className="text-text-primary text-xs font-medium">Share</span>
        </motion.button>
      </div>

      {/* Bottom info overlay */}
      <div className="fixed bottom-0 left-0 right-16 p-6 bg-gradient-to-t from-bg-primary via-bg-primary/80 to-transparent z-30">
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
            <h3 className="text-text-primary font-semibold text-lg truncate">
              {post.user
                ? post.user.displayName || `@${post.user.username}`
                : post.author || "Anonymous"}
            </h3>
            {post.source && (
              <p className="text-text-secondary text-sm truncate italic">
                {post.source}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
