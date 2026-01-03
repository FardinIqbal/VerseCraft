"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Volume2, VolumeX } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const LOFI_STREAM = "https://play.streamafrica.net/lofiradio";

export function FloatingControls() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const musicPref = localStorage.getItem("musicPlaying");
    if (musicPref === "true") {
      setHasInteracted(true);
    }
  }, []);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(LOFI_STREAM);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }

    if (isPlaying && hasInteracted) {
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
      localStorage.setItem("musicPlaying", "true");
    } else {
      audioRef.current.pause();
      localStorage.setItem("musicPlaying", "false");
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [isPlaying, hasInteracted]);

  const toggleMusic = () => {
    setHasInteracted(true);
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-28 right-4 z-50 flex flex-col items-center gap-3">
      {/* Theme toggle */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        whileHover={{ scale: 1.05 }}
        onClick={toggleTheme}
        className="p-3 rounded-full bg-bg-primary/60 backdrop-blur-xl border border-border/30 shadow-lg"
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        <AnimatePresence mode="wait">
          {theme === "dark" ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="w-5 h-5 text-text-secondary" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="w-5 h-5 text-text-secondary" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Music toggle */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        whileHover={{ scale: 1.05 }}
        onClick={toggleMusic}
        className="relative p-3 rounded-full bg-bg-primary/60 backdrop-blur-xl border border-border/30 shadow-lg overflow-hidden"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {/* Animated background when playing */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 bg-accent/10"
            />
          )}
        </AnimatePresence>

        {/* Sound bars animation when playing */}
        <AnimatePresence>
          {isPlaying ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-end justify-center gap-[3px] w-5 h-5"
            >
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-[3px] bg-accent rounded-full"
                  animate={{
                    height: ["8px", "16px", "10px", "20px", "8px"],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <VolumeX className="w-5 h-5 text-text-muted" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulsing ring when playing */}
        {isPlaying && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-accent/40"
              animate={{ scale: [1, 1.4, 1.4], opacity: [0.6, 0, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-accent/40"
              animate={{ scale: [1, 1.4, 1.4], opacity: [0.6, 0, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
            />
          </>
        )}
      </motion.button>
    </div>
  );
}
