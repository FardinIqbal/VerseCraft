"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Feather,
  Send,
  X,
  ChevronDown,
  Sparkles,
  Clock,
  Type,
  AlignLeft,
  Quote,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const WRITING_PROMPTS = [
  "Write about a moment that changed everything...",
  "What does silence sound like to you?",
  "Describe the space between two heartbeats...",
  "Write to someone who will never read this...",
  "What would you say to your past self?",
  "Capture a fleeting emotion before it fades...",
  "Write about something you're afraid to forget...",
  "What does home feel like?",
];

const POST_TYPES = [
  { value: "poetry", label: "Poetry", icon: Feather, desc: "Verse and rhythm" },
  { value: "prose", label: "Prose", icon: AlignLeft, desc: "Flowing narrative" },
  { value: "quote", label: "Quote", icon: Quote, desc: "Words to remember" },
] as const;

export default function CreatePage() {
  const router = useRouter();
  const { user } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [source, setSource] = useState("");
  const [type, setType] = useState<"poetry" | "prose" | "quote">("poetry");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPublishDrawer, setShowPublishDrawer] = useState(false);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Get random prompt on mount
  useEffect(() => {
    setPrompt(WRITING_PROMPTS[Math.floor(Math.random() * WRITING_PROMPTS.length)]);
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    const draft = { content, author, source, type };
    localStorage.setItem("versecraft-draft", JSON.stringify(draft));
    if (content.length > 0) {
      setLastSaved(new Date());
    }
  }, [content, author, source, type]);

  // Load draft on mount
  useEffect(() => {
    const saved = localStorage.getItem("versecraft-draft");
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        if (draft.content) setContent(draft.content);
        if (draft.author) setAuthor(draft.author);
        if (draft.source) setSource(draft.source);
        if (draft.type) setType(draft.type);
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  // Focus textarea on mount
  useEffect(() => {
    if (textareaRef.current && user) {
      textareaRef.current.focus();
    }
  }, [user]);

  // Auto-resize textarea
  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, []);

  const handlePublish = async () => {
    if (!content.trim()) {
      setError("Your verse is empty");
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
        throw new Error(data.error || "Failed to publish");
      }

      // Clear draft
      localStorage.removeItem("versecraft-draft");
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to publish";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const clearDraft = () => {
    setContent("");
    setAuthor("");
    setSource("");
    localStorage.removeItem("versecraft-draft");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
  };

  // Stats
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const lineCount = content.split("\n").filter((l) => l.trim()).length;
  const charCount = content.length;

  // Not signed in
  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 flex items-center justify-center bg-bg-primary p-8"
      >
        <div className="text-center max-w-md">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-accent/10 flex items-center justify-center"
          >
            <Feather className="w-8 h-8 text-accent" />
          </motion.div>
          <h1 className="text-2xl font-serif text-text-primary mb-3">
            Your words await
          </h1>
          <p className="text-text-secondary mb-8">
            Sign in to share your poetry with the world.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="px-8 py-3 rounded-xl bg-accent text-bg-primary font-medium hover:bg-accent-hover transition-colors"
          >
            Sign In to Write
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      {/* Main Editor */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-bg-primary flex flex-col"
      >
        {/* Top Bar - subtle, fades when writing */}
        <motion.header
          animate={{ opacity: isFocused && content.length > 0 ? 0.4 : 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between px-4 py-3 z-10"
        >
          {/* Type Selector */}
          <button
            onClick={() => setShowTypeSelector(!showTypeSelector)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-secondary/50 hover:bg-bg-secondary transition-colors"
          >
            {POST_TYPES.find((t) => t.value === type)?.icon && (
              <span className="text-accent">
                {(() => {
                  const Icon = POST_TYPES.find((t) => t.value === type)!.icon;
                  return <Icon className="w-4 h-4" />;
                })()}
              </span>
            )}
            <span className="text-sm text-text-secondary capitalize">{type}</span>
            <ChevronDown className="w-3 h-3 text-text-muted" />
          </button>

          {/* Publish Button */}
          <button
            onClick={() => content.trim() && setShowPublishDrawer(true)}
            disabled={!content.trim()}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all",
              content.trim()
                ? "bg-accent text-bg-primary hover:bg-accent-hover"
                : "bg-bg-secondary text-text-muted cursor-not-allowed"
            )}
          >
            <Send className="w-4 h-4" />
            <span className="text-sm">Publish</span>
          </button>
        </motion.header>

        {/* Type Selector Dropdown */}
        <AnimatePresence>
          {showTypeSelector && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowTypeSelector(false)}
                className="fixed inset-0 z-20"
              />
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 400 }}
                className="absolute top-16 left-4 z-30 bg-bg-secondary/95 backdrop-blur-xl rounded-2xl border border-border/30 overflow-hidden shadow-2xl"
              >
                {POST_TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => {
                      setType(t.value);
                      setShowTypeSelector(false);
                    }}
                    className={cn(
                      "flex items-center gap-3 w-full px-4 py-3 transition-colors",
                      type === t.value
                        ? "bg-accent/10 text-accent"
                        : "text-text-secondary hover:bg-bg-tertiary"
                    )}
                  >
                    <t.icon className="w-4 h-4" />
                    <div className="text-left">
                      <p className="text-sm font-medium">{t.label}</p>
                      <p className="text-xs text-text-muted">{t.desc}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Writing Area */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8 lg:px-16 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Empty State */}
            <AnimatePresence>
              {!content && !isFocused && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute inset-x-0 top-1/3 px-6 pointer-events-none"
                >
                  <div className="max-w-2xl mx-auto text-center">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Sparkles className="w-8 h-8 text-accent/40 mx-auto mb-4" />
                    </motion.div>
                    <p className="font-serif text-xl text-text-muted italic leading-relaxed">
                      {prompt}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={type === "quote" ? '"' : ""}
              className={cn(
                "w-full min-h-[60vh] bg-transparent resize-none outline-none",
                "font-serif text-xl md:text-2xl leading-relaxed",
                "text-text-primary placeholder:text-text-muted/30",
                type === "quote" && "italic"
              )}
              style={{ caretColor: "var(--accent)" }}
            />
          </div>
        </div>

        {/* Bottom Stats Bar */}
        <motion.footer
          animate={{ opacity: isFocused && content.length > 0 ? 0.4 : 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between px-4 py-3 border-t border-border/10"
        >
          <div className="flex items-center gap-4 text-xs text-text-muted">
            {content.length > 0 && (
              <>
                <span>{wordCount} words</span>
                <span>{lineCount} lines</span>
                <span>{charCount} chars</span>
              </>
            )}
            {lastSaved && content.length > 0 && (
              <span className="flex items-center gap-1 text-text-muted/60">
                <Clock className="w-3 h-3" />
                Draft saved
              </span>
            )}
          </div>

          {content.length > 0 && (
            <button
              onClick={clearDraft}
              className="text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              Clear
            </button>
          )}
        </motion.footer>
      </motion.div>

      {/* Publish Drawer */}
      <AnimatePresence>
        {showPublishDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPublishDrawer(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.3 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100 || info.velocity.y > 500) {
                  setShowPublishDrawer(false);
                }
              }}
              style={{ touchAction: "none" }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-bg-primary border-t border-border/20 rounded-t-3xl max-h-[80vh] overflow-hidden"
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-border/40" />
              </div>

              <div className="px-6 pb-8 pt-2 overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-text-primary">Ready to share?</h3>
                  <button
                    onClick={() => setShowPublishDrawer(false)}
                    className="p-2 rounded-xl hover:bg-bg-secondary transition-colors"
                  >
                    <X className="w-4 h-4 text-text-muted" />
                  </button>
                </div>

                {/* Preview */}
                <div className="p-5 rounded-2xl bg-bg-secondary/50 border border-border/20 mb-6">
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-3">Preview</p>
                  <div
                    className={cn(
                      "font-serif text-lg leading-relaxed text-text-primary",
                      type === "quote" && "italic"
                    )}
                  >
                    {type === "quote" && <span className="text-2xl text-text-muted mr-1">&ldquo;</span>}
                    {content.split("\n").slice(0, 4).map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < Math.min(content.split("\n").length - 1, 3) && <br />}
                      </span>
                    ))}
                    {content.split("\n").length > 4 && (
                      <span className="text-text-muted">...</span>
                    )}
                    {type === "quote" && <span className="text-2xl text-text-muted ml-1">&rdquo;</span>}
                  </div>
                </div>

                {/* Attribution */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs text-text-muted uppercase tracking-wider mb-2">
                      Author (optional)
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Who wrote this?"
                      className="w-full px-4 py-3 rounded-xl bg-bg-secondary/50 border border-border/20 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted uppercase tracking-wider mb-2">
                      Source (optional)
                    </label>
                    <input
                      type="text"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      placeholder="Book, collection, or work title"
                      className="w-full px-4 py-3 rounded-xl bg-bg-secondary/50 border border-border/20 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-sm text-center mb-4"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Publish Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePublish}
                  disabled={loading}
                  className={cn(
                    "w-full py-4 rounded-2xl font-medium text-lg flex items-center justify-center gap-2 transition-all",
                    loading
                      ? "bg-accent/50 text-bg-primary/50 cursor-not-allowed"
                      : "bg-accent text-bg-primary hover:bg-accent-hover"
                  )}
                >
                  {loading ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-bg-primary/30 border-t-bg-primary rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <>
                      <Feather className="w-5 h-5" />
                      <span>Publish to VerseCraft</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
