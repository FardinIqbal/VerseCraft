"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Heart, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface DailyPoem {
  id: string;
  content: string;
  author: string;
  source?: string;
  theme: string;
  color: string;
}

const dailyPoems: DailyPoem[] = [
  {
    id: "1",
    content: "Hope is the thing with feathers\nThat perches in the soul,\nAnd sings the tune without the words,\nAnd never stops at all.",
    author: "Emily Dickinson",
    theme: "Hope",
    color: "from-amber-500/20 to-orange-500/20",
  },
  {
    id: "2",
    content: "Two roads diverged in a wood, and I—\nI took the one less traveled by,\nAnd that has made all the difference.",
    author: "Robert Frost",
    source: "The Road Not Taken",
    theme: "Journey",
    color: "from-emerald-500/20 to-teal-500/20",
  },
  {
    id: "3",
    content: "Out of the night that covers me,\nBlack as the pit from pole to pole,\nI thank whatever gods may be\nFor my unconquerable soul.",
    author: "William Ernest Henley",
    source: "Invictus",
    theme: "Strength",
    color: "from-violet-500/20 to-purple-500/20",
  },
  {
    id: "4",
    content: "The wound is the place where the Light enters you.",
    author: "Rumi",
    theme: "Wisdom",
    color: "from-rose-500/20 to-pink-500/20",
  },
  {
    id: "5",
    content: "I carry your heart with me (I carry it in\nmy heart) I am never without it",
    author: "E.E. Cummings",
    theme: "Love",
    color: "from-red-500/20 to-rose-500/20",
  },
];

interface DailyVerseProps {
  onAuthRequired?: () => void;
}

export function DailyVerse({ onAuthRequired }: DailyVerseProps) {
  const [selectedPoem, setSelectedPoem] = useState<DailyPoem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewed, setViewed] = useState<Set<string>>(new Set());

  const handlePoemClick = (poem: DailyPoem) => {
    setSelectedPoem(poem);
    setCurrentIndex(dailyPoems.findIndex((p) => p.id === poem.id));
    setViewed((prev) => new Set([...prev, poem.id]));
  };

  const goNext = () => {
    if (currentIndex < dailyPoems.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedPoem(dailyPoems[nextIndex]);
      setViewed((prev) => new Set([...prev, dailyPoems[nextIndex].id]));
    } else {
      setSelectedPoem(null);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setSelectedPoem(dailyPoems[prevIndex]);
    }
  };

  // Auto-advance timer
  useEffect(() => {
    if (!selectedPoem) return;

    const timer = setTimeout(() => {
      goNext();
    }, 8000);

    return () => clearTimeout(timer);
  }, [selectedPoem, currentIndex]);

  return (
    <>
      {/* Stories Row */}
      <div className="px-4 py-3 border-b border-border overflow-x-auto scrollbar-hide">
        <div className="flex gap-3">
          {dailyPoems.map((poem) => (
            <button
              key={poem.id}
              onClick={() => handlePoemClick(poem)}
              className="flex-shrink-0 flex flex-col items-center gap-1"
            >
              <div
                className={cn(
                  "w-16 h-16 rounded-full p-0.5",
                  viewed.has(poem.id)
                    ? "bg-border"
                    : "bg-gradient-to-tr from-accent via-purple-500 to-pink-500"
                )}
              >
                <div
                  className={cn(
                    "w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br",
                    poem.color
                  )}
                >
                  <span className="text-xs font-medium text-text-primary">
                    {poem.theme.slice(0, 2)}
                  </span>
                </div>
              </div>
              <span className="text-xs text-text-muted truncate max-w-16">
                {poem.theme}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Full-screen Story View */}
      <AnimatePresence>
        {selectedPoem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
          >
            {/* Progress bars */}
            <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-10">
              {dailyPoems.map((poem, i) => (
                <div
                  key={poem.id}
                  className="flex-1 h-0.5 rounded-full bg-white/30 overflow-hidden"
                >
                  <motion.div
                    initial={{ width: i < currentIndex ? "100%" : "0%" }}
                    animate={{
                      width:
                        i < currentIndex
                          ? "100%"
                          : i === currentIndex
                          ? "100%"
                          : "0%",
                    }}
                    transition={{
                      duration: i === currentIndex ? 8 : 0,
                      ease: "linear",
                    }}
                    className="h-full bg-white"
                  />
                </div>
              ))}
            </div>

            {/* Close button */}
            <button
              onClick={() => setSelectedPoem(null)}
              className="absolute top-8 right-4 p-2 z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation areas */}
            <button
              onClick={goPrev}
              className="absolute left-0 top-0 bottom-0 w-1/4 z-10"
              disabled={currentIndex === 0}
            />
            <button
              onClick={goNext}
              className="absolute right-0 top-0 bottom-0 w-1/4 z-10"
            />

            {/* Content */}
            <motion.div
              key={selectedPoem.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br",
                selectedPoem.color
              )}
            >
              <div className="max-w-lg text-center">
                <p className="text-white font-serif text-xl md:text-2xl leading-relaxed whitespace-pre-line">
                  {selectedPoem.content}
                </p>
                <div className="mt-8 pt-4 border-t border-white/20">
                  <p className="text-white/80 font-medium">
                    {selectedPoem.author}
                  </p>
                  {selectedPoem.source && (
                    <p className="text-white/60 text-sm italic mt-1">
                      {selectedPoem.source}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-6">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAuthRequired?.();
                  }}
                  className="p-3 rounded-full bg-white/10 backdrop-blur-sm"
                >
                  <Heart className="w-6 h-6 text-white" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAuthRequired?.();
                  }}
                  className="p-3 rounded-full bg-white/10 backdrop-blur-sm"
                >
                  <Bookmark className="w-6 h-6 text-white" />
                </motion.button>
              </div>

              {/* Theme label */}
              <div className="absolute top-16 left-4">
                <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">
                  Daily {selectedPoem.theme}
                </span>
              </div>
            </motion.div>

            {/* Navigation hints */}
            {currentIndex > 0 && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                <ChevronLeft className="w-8 h-8" />
              </div>
            )}
            {currentIndex < dailyPoems.length - 1 && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50">
                <ChevronRight className="w-8 h-8" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
