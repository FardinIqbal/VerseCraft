"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
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

interface PostModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  onAuthRequired: () => void;
  onUpdate: (postId: string, updates: Partial<Post>) => void;
}

export function PostModal({
  post,
  isOpen,
  onClose,
  isAuthenticated,
  onAuthRequired,
  onUpdate,
}: PostModalProps) {
  const [isLiked, setIsLiked] = useState(post?.isLiked ?? false);
  const [isSaved, setIsSaved] = useState(post?.isSaved ?? false);
  const [likesCount, setLikesCount] = useState(post?.likesCount ?? 0);

  if (!post) return null;

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
      onUpdate(post.id, { isLiked: newLiked, likesCount: newLiked ? likesCount + 1 : likesCount - 1 });
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
      onUpdate(post.id, { isSaved: newSaved });
    } catch {
      setIsSaved(!newSaved);
    }
  };

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

  const formatContent = (content: string) => {
    return content.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        {i < content.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 flex flex-col md:flex-row bg-bg-primary rounded-xl overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-bg-tertiary hover:bg-border transition-colors z-10"
            >
              <X className="w-5 h-5 text-text-primary" />
            </button>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 flex items-center justify-center">
              <div className="max-w-lg w-full text-center">
                <p className={cn(
                  "text-text-primary leading-relaxed font-serif",
                  post.content.length > 800
                    ? "text-base md:text-lg"
                    : post.content.length > 400
                    ? "text-lg md:text-xl"
                    : "text-xl md:text-2xl"
                )}>
                  {formatContent(post.content)}
                </p>
              </div>
            </div>

            {/* Sidebar with actions and info */}
            <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-border bg-bg-secondary flex flex-col">
              {/* Author */}
              <div className="p-4 border-b border-border flex items-center gap-3">
                {post.user ? (
                  <>
                    <Avatar
                      src={post.user.avatarUrl}
                      alt={post.user.displayName || post.user.username}
                      size="md"
                    />
                    <div>
                      <p className="font-semibold text-text-primary">
                        {post.user.displayName || post.user.username}
                      </p>
                      <p className="text-sm text-text-muted">@{post.user.username}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-accent font-serif">
                        {post.author?.[0] || "?"}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">
                        {post.author || "Anonymous"}
                      </p>
                      {post.source && (
                        <p className="text-sm text-text-muted italic">{post.source}</p>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="p-4 flex items-center gap-4 border-b border-border">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLike}
                  className="flex items-center gap-2"
                >
                  <Heart
                    className={cn(
                      "w-6 h-6",
                      isLiked ? "text-red-500 fill-red-500" : "text-text-primary"
                    )}
                  />
                  <span className="text-text-primary">{likesCount}</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="w-6 h-6 text-text-primary" />
                  <span className="text-text-primary">{post.commentsCount}</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSave}
                  className="ml-auto"
                >
                  <Bookmark
                    className={cn(
                      "w-6 h-6",
                      isSaved ? "text-accent fill-accent" : "text-text-primary"
                    )}
                  />
                </motion.button>

                <motion.button whileTap={{ scale: 0.9 }} onClick={handleShare}>
                  <Share2 className="w-6 h-6 text-text-primary" />
                </motion.button>
              </div>

              {/* Comments placeholder */}
              <div className="flex-1 p-4 overflow-y-auto">
                <p className="text-text-muted text-sm">Comments coming soon...</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
