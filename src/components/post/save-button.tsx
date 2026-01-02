"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface SaveButtonProps {
  postId: string;
  initialSaved: boolean;
  onSave: (postId: string) => Promise<void>;
  disabled?: boolean;
}

export function SaveButton({
  postId,
  initialSaved,
  onSave,
  disabled,
}: SaveButtonProps) {
  const [saved, setSaved] = useState(initialSaved);

  const handleSave = async () => {
    if (disabled) return;

    // Optimistic update
    setSaved(!saved);

    try {
      await onSave(postId);
    } catch {
      // Revert on error
      setSaved(saved);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={disabled}
      className={cn(
        "flex items-center gap-1.5 text-sm transition-colors",
        saved
          ? "text-[var(--save)]"
          : "text-[var(--text-muted)] hover:text-[var(--save)]",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <motion.div
        animate={saved ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.2 }}
      >
        <Bookmark
          className={cn("w-5 h-5", saved && "fill-current")}
        />
      </motion.div>
    </button>
  );
}
