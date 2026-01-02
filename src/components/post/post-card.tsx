"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { MessageCircle, MoreHorizontal, Heart } from "lucide-react";
import { cn, formatDate, formatNumber } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { LikeButton } from "./like-button";
import { SaveButton } from "./save-button";

export interface PostData {
  id: string;
  content: string;
  author: string | null;
  source: string | null;
  type: "poetry" | "prose" | "quote";
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  isLiked: boolean;
  isSaved: boolean;
  user: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  } | null;
}

interface PostCardProps {
  post: PostData;
  onLike: (postId: string) => Promise<void>;
  onSave: (postId: string) => Promise<void>;
  onComment?: (postId: string) => void;
  isAuthenticated: boolean;
  onAuthRequired?: () => void;
}

export function PostCard({
  post,
  onLike,
  onSave,
  onComment,
  isAuthenticated,
  onAuthRequired,
}: PostCardProps) {
  const [showFullContent, setShowFullContent] = useState(false);
  const [showDoubleTapHeart, setShowDoubleTapHeart] = useState(false);
  const lastTapRef = useRef<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const isLongContent = post.content.length > 500;
  const displayContent =
    isLongContent && !showFullContent
      ? post.content.slice(0, 500) + "..."
      : post.content;

  const handleDoubleTap = async () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      if (!isAuthenticated) {
        onAuthRequired?.();
        return;
      }
      if (!post.isLiked) {
        setShowDoubleTapHeart(true);
        await onLike(post.id);
        setTimeout(() => setShowDoubleTapHeart(false), 800);
      }
    }
    lastTapRef.current = now;
  };

  const handleLike = async (postId: string) => {
    if (!isAuthenticated) {
      onAuthRequired?.();
      return;
    }
    await onLike(postId);
  };

  const handleSave = async (postId: string) => {
    if (!isAuthenticated) {
      onAuthRequired?.();
      return;
    }
    await onSave(postId);
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
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="border-b border-[var(--border)] relative"
    >
      <div
        onClick={handleDoubleTap}
        className="p-6 cursor-default select-text"
      >
        {/* Content */}
        <div
          ref={contentRef}
          className={cn(
            "font-[family-name:var(--font-libre-baskerville)] text-lg leading-relaxed text-[var(--text-primary)]",
            post.type === "quote" && "italic"
          )}
        >
          {post.type === "quote" && (
            <span className="text-3xl text-[var(--text-muted)] mr-1">&ldquo;</span>
          )}
          {formatContent(displayContent)}
          {post.type === "quote" && (
            <span className="text-3xl text-[var(--text-muted)] ml-1">&rdquo;</span>
          )}
        </div>

        {isLongContent && (
          <button
            onClick={() => setShowFullContent(!showFullContent)}
            className="mt-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            {showFullContent ? "Show less" : "Read more"}
          </button>
        )}

        {/* Attribution */}
        {(post.author || post.source) && (
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            {post.author && (
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                {post.author}
              </p>
            )}
            {post.source && (
              <p className="text-sm text-[var(--text-muted)] italic">
                {post.source}
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            {post.user ? (
              <>
                <Avatar
                  src={post.user.avatarUrl}
                  fallback={post.user.displayName || post.user.username}
                  size="sm"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-[var(--text-secondary)]">
                    {post.user.displayName || post.user.username}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {formatDate(post.createdAt)}
                  </span>
                </div>
              </>
            ) : (
              <span className="text-xs text-[var(--text-muted)]">
                {formatDate(post.createdAt)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <LikeButton
              postId={post.id}
              initialLiked={post.isLiked}
              initialCount={post.likesCount}
              onLike={handleLike}
              disabled={!isAuthenticated}
            />
            <button
              onClick={() => onComment?.(post.id)}
              className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{formatNumber(post.commentsCount)}</span>
            </button>
            <SaveButton
              postId={post.id}
              initialSaved={post.isSaved}
              onSave={handleSave}
              disabled={!isAuthenticated}
            />
          </div>
        </div>
      </div>

      {/* Double-tap heart animation */}
      {showDoubleTapHeart && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <Heart className="w-24 h-24 fill-[var(--like)] text-[var(--like)]" />
        </motion.div>
      )}
    </motion.article>
  );
}
