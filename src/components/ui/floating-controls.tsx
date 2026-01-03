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
    <div className="fixed top-4 right-4 z-50 flex items-center gap-1.5">
      {/* Music toggle */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={toggleMusic}
        className="relative p-2.5 rounded-full bg-bg-secondary/80 backdrop-blur-xl border border-border/50 hover:border-border transition-colors group"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? (
          <Volume2 className="w-4 h-4 text-accent" />
        ) : (
          <VolumeX className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" />
        )}

        {isPlaying && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent"
          >
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-full h-full rounded-full bg-accent"
            />
          </motion.div>
        )}
      </motion.button>

      {/* Theme toggle */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className="p-2.5 rounded-full bg-bg-secondary/80 backdrop-blur-xl border border-border/50 hover:border-border transition-colors group"
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        <AnimatePresence mode="wait">
          {theme === "dark" ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Moon className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Sun className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
