"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const postTypes = [
  { value: "poetry", label: "Poetry" },
  { value: "prose", label: "Prose" },
  { value: "quote", label: "Quote" },
] as const;

export default function CreatePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [source, setSource] = useState("");
  const [type, setType] = useState<"poetry" | "prose" | "quote">("poetry");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          author: author.trim() || null,
          source: source.trim() || null,
          type,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create post");
      }

      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create post";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-[var(--text-secondary)]">
          Please sign in to create a post.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4"
    >
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/"
          className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-semibold">Create Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type selector */}
        <div className="flex gap-2">
          {postTypes.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setType(t.value)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                type === t.value
                  ? "bg-[var(--accent)] text-[var(--bg-primary)]"
                  : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              type === "poetry"
                ? "Enter your poem..."
                : type === "prose"
                ? "Enter a passage..."
                : "Enter a quote..."
            }
            rows={10}
            className={cn(
              "w-full px-4 py-3 rounded-lg resize-none",
              "bg-[var(--bg-secondary)] text-[var(--text-primary)]",
              "border border-[var(--border)] focus:border-[var(--accent)]",
              "placeholder:text-[var(--text-muted)]",
              "font-[family-name:var(--font-libre-baskerville)] text-lg leading-relaxed",
              "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-0"
            )}
          />
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {content.length} / 5000 characters
          </p>
        </div>

        {/* Attribution */}
        <div className="space-y-4">
          <Input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author (optional)"
          />
          <Input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Source / Work title (optional)"
          />
        </div>

        {/* Preview */}
        {content && (
          <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
            <p className="text-sm text-[var(--text-muted)] mb-4">Preview</p>
            <div
              className={cn(
                "font-[family-name:var(--font-libre-baskerville)] text-lg leading-relaxed",
                type === "quote" && "italic"
              )}
            >
              {type === "quote" && (
                <span className="text-3xl text-[var(--text-muted)] mr-1">
                  &ldquo;
                </span>
              )}
              {content.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i < content.split("\n").length - 1 && <br />}
                </span>
              ))}
              {type === "quote" && (
                <span className="text-3xl text-[var(--text-muted)] ml-1">
                  &rdquo;
                </span>
              )}
            </div>
            {(author || source) && (
              <div className="mt-4 pt-4 border-t border-[var(--border)]">
                {author && (
                  <p className="text-sm font-medium text-[var(--text-secondary)]">
                    {author}
                  </p>
                )}
                {source && (
                  <p className="text-sm text-[var(--text-muted)] italic">
                    {source}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" className="w-full" loading={loading}>
          Publish
        </Button>
      </form>
    </motion.div>
  );
}
