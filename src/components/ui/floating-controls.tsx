"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Type, AlignLeft } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const THEMES = [
  { id: "dark", label: "Dark", color: "#0a0a0a" },
  { id: "light", label: "Light", color: "#ffffff" },
  { id: "sepia", label: "Sepia", color: "#f4ecd8" },
  { id: "midnight", label: "Midnight", color: "#0d1117" },
  { id: "forest", label: "Forest", color: "#1a1f1a" },
] as const;

export function FloatingControls() {
  const {
    theme,
    fontSize,
    fontStyle,
    lineHeight,
    setTheme,
    setFontSize,
    setFontStyle,
    setLineHeight,
  } = useTheme();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollY = useRef(0);

  // Auto-hide - same pattern as mobile nav (show on any tap, scroll up, or swipe from edge)
  useEffect(() => {
    if (isExpanded) {
      setIsVisible(true);
      return;
    }

    const showControls = () => {
      setIsVisible(true);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    };

    // Show on any click
    const handleClick = () => showControls();

    // Show on scroll up
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY.current) {
        showControls();
      }
      lastScrollY.current = currentScrollY;
    };

    // Show on swipe from top edge
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      // Swipe down from top OR swipe up from bottom
      if ((touchStartY < 100 && touchEndY > touchStartY + 30) ||
          (touchStartY > window.innerHeight - 100 && touchEndY < touchStartY - 30)) {
        showControls();
      }
    };

    showControls();

    document.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      document.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isExpanded]);

  return (
    <>
      {/* Floating trigger */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(true);
            }}
            className="fixed top-6 right-4 z-40 group"
            aria-label="Reading settings"
          >
            <motion.div className="p-3 rounded-2xl bg-bg-primary/70 backdrop-blur-2xl border border-border/40 shadow-xl">
              <Settings className="w-5 h-5 text-text-muted group-hover:text-text-secondary transition-colors" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Settings Drawer */}
      <AnimatePresence>
        {isExpanded && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setIsExpanded(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50"
            />

            <motion.div
              initial={{ y: "100%", opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0.5 }}
              transition={{ type: "spring", damping: 35, stiffness: 400 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 80 || info.velocity.y > 400) {
                  setIsExpanded(false);
                }
              }}
              style={{ touchAction: "none" }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-b from-bg-secondary to-bg-primary border-t border-border/30 rounded-t-[2rem] max-h-[70vh] overflow-hidden"
            >
              {/* Drag handle - swipe down to close */}
              <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
                <div className="w-12 h-1 rounded-full bg-border/50" />
              </div>

              <div className="px-6 pb-10 pt-2 overflow-y-auto max-h-[calc(70vh-20px)]">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-text-primary">Reading</h3>
                    <p className="text-xs text-text-muted mt-0.5">Customize your experience</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsExpanded(false)}
                    className="p-2.5 rounded-xl bg-bg-tertiary/50 hover:bg-bg-tertiary transition-colors"
                  >
                    <X className="w-4 h-4 text-text-secondary" />
                  </motion.button>
                </div>

                {/* Theme Selection */}
                <div className="mb-6">
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-3 font-medium">Theme</p>
                  <div className="flex gap-2 flex-wrap">
                    {THEMES.map((t) => (
                      <motion.button
                        key={t.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setTheme(t.id)}
                        className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                          theme === t.id
                            ? "ring-2 ring-accent"
                            : "hover:bg-bg-tertiary/50"
                        }`}
                      >
                        <div
                          className="w-10 h-10 rounded-lg border border-border/50 shadow-sm"
                          style={{ backgroundColor: t.color }}
                        />
                        <span className={`text-[10px] font-medium ${theme === t.id ? "text-accent" : "text-text-muted"}`}>
                          {t.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div className="mb-6">
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-3 font-medium flex items-center gap-2">
                    <Type className="w-3.5 h-3.5" />
                    Text Size
                  </p>
                  <div className="flex gap-2">
                    {(["small", "medium", "large"] as const).map((size) => (
                      <motion.button
                        key={size}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFontSize(size)}
                        className={`flex-1 py-3 rounded-xl text-sm font-medium capitalize transition-all ${
                          fontSize === size
                            ? "bg-accent text-bg-primary"
                            : "bg-bg-tertiary/60 text-text-secondary hover:bg-bg-tertiary"
                        }`}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Font Style */}
                <div className="mb-6">
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-3 font-medium">Typeface</p>
                  <div className="flex gap-2">
                    {[
                      { value: "serif", label: "Serif", sample: "Aa" },
                      { value: "sans", label: "Sans", sample: "Aa" },
                    ].map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFontStyle(option.value as "serif" | "sans")}
                        className={`flex-1 py-3 px-4 rounded-xl transition-all ${
                          fontStyle === option.value
                            ? "bg-accent text-bg-primary"
                            : "bg-bg-tertiary/60 text-text-secondary hover:bg-bg-tertiary"
                        }`}
                      >
                        <span className={`text-lg ${option.value === "serif" ? "font-serif" : "font-sans"}`}>
                          {option.sample}
                        </span>
                        <p className="text-xs mt-1 opacity-80">{option.label}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Line Height */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xs text-text-muted uppercase tracking-wider font-medium flex items-center gap-2">
                      <AlignLeft className="w-3.5 h-3.5" />
                      Line Spacing
                    </p>
                    <p className="text-xs text-text-secondary tabular-nums">{lineHeight.toFixed(1)}</p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 h-2 bg-bg-tertiary rounded-full" />
                    <motion.div
                      className="absolute left-0 top-0 h-2 bg-accent rounded-full"
                      style={{ width: `${((lineHeight - 1.4) / 0.8) * 100}%` }}
                    />
                    <input
                      type="range"
                      min="1.4"
                      max="2.2"
                      step="0.1"
                      value={lineHeight}
                      onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                      className="relative w-full h-2 appearance-none bg-transparent cursor-pointer z-10
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-5
                        [&::-webkit-slider-thumb]:h-5
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-white
                        [&::-webkit-slider-thumb]:shadow-lg
                        [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:border-2
                        [&::-webkit-slider-thumb]:border-bg-primary"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
