"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CornerDownRight } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { formatDate, cn } from "@/lib/utils";

interface CommentUser {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: CommentUser;
  replies: Comment[];
}

interface CommentsDrawerProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CommentsDrawer({ postId, isOpen, onClose }: CommentsDrawerProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchComments();
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, postId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment.trim(),
          parentId: replyingTo,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (replyingTo) {
          setComments((prev) =>
            prev.map((comment) =>
              comment.id === replyingTo
                ? { ...comment, replies: [...comment.replies, data.comment] }
                : comment
            )
          );
        } else {
          setComments((prev) => [...prev, data.comment]);
        }
        setNewComment("");
        setReplyingTo(null);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const CommentItem = ({
    comment,
    isReply = false,
  }: {
    comment: Comment;
    isReply?: boolean;
  }) => (
    <div className={cn("py-3", isReply && "pl-8")}>
      <div className="flex gap-3">
        <Avatar
          src={comment.user.avatarUrl}
          fallback={comment.user.displayName || comment.user.username}
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">
              {comment.user.displayName || comment.user.username}
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-1 whitespace-pre-wrap">
            {comment.content}
          </p>
          {!isReply && user && (
            <button
              onClick={() => setReplyingTo(comment.id)}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] mt-1"
            >
              Reply
            </button>
          )}
        </div>
      </div>
      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} isReply />
      ))}
    </div>
  );

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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] bg-[var(--bg-secondary)] rounded-t-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
              <h2 className="font-semibold">Comments</h2>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comments list */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : comments.length === 0 ? (
                <p className="text-center text-[var(--text-muted)] py-8">
                  No comments yet. Be the first!
                </p>
              ) : (
                <div className="divide-y divide-[var(--border)]">
                  {comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            {user ? (
              <form
                onSubmit={handleSubmit}
                className="p-4 border-t border-[var(--border)]"
              >
                {replyingTo && (
                  <div className="flex items-center gap-2 mb-2 text-sm text-[var(--text-muted)]">
                    <CornerDownRight className="w-4 h-4" />
                    <span>Replying to comment</span>
                    <button
                      type="button"
                      onClick={() => setReplyingTo(null)}
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                <div className="flex gap-3">
                  <Avatar
                    src={user.avatarUrl}
                    fallback={user.displayName || user.username}
                    size="sm"
                  />
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className={cn(
                        "flex-1 px-4 py-2 rounded-full",
                        "bg-[var(--bg-tertiary)] text-[var(--text-primary)]",
                        "border border-[var(--border)] focus:border-[var(--accent)]",
                        "placeholder:text-[var(--text-muted)]",
                        "focus:outline-none"
                      )}
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!newComment.trim() || submitting}
                      loading={submitting}
                      className="rounded-full px-4"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="p-4 border-t border-[var(--border)] text-center text-[var(--text-muted)]">
                Sign in to comment
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
