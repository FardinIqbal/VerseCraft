"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, ChevronUp, X } from "lucide-react";

const GENRES = [
  { id: "lofi", name: "Lofi", url: "https://play.streamafrica.net/lofiradio" },
  { id: "classical", name: "Classical", url: "https://live.musopen.org:8085/streamvbr0" },
  { id: "jazz", name: "Jazz", url: "https://streaming.radio.co/s774887f7b/listen" },
  { id: "ambient", name: "Ambient", url: "https://streams.fluxfm.de/Chillhop/mp3-128/streams.fluxfm.de/" },
];

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [genre, setGenre] = useState(GENRES[0]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-play on first page interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        setIsPlaying(true);
      }
    };

    document.addEventListener("click", handleFirstInteraction, { once: true });
    document.addEventListener("touchstart", handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, [hasInteracted]);

  // Load saved preferences
  useEffect(() => {
    const savedVolume = localStorage.getItem("musicVolume");
    const savedGenre = localStorage.getItem("musicGenre");

    if (savedVolume) setVolume(parseFloat(savedVolume));
    if (savedGenre) {
      const found = GENRES.find(g => g.id === savedGenre);
      if (found) setGenre(found);
    }
  }, []);

  // Audio control
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(genre.url);
      audioRef.current.loop = true;
    }

    audioRef.current.volume = volume;

    if (isPlaying && hasInteracted) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [isPlaying, hasInteracted, volume, genre.url]);

  // Change genre
  const changeGenre = useCallback((newGenre: typeof GENRES[0]) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = newGenre.url;
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
    setGenre(newGenre);
    localStorage.setItem("musicGenre", newGenre.id);
  }, [isPlaying]);

  // Volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    localStorage.setItem("musicVolume", String(newVolume));
  };

  const togglePlay = () => {
    setHasInteracted(true);
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      {/* Minimal floating button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsExpanded(true)}
        className="fixed top-4 left-4 z-50 p-2.5 rounded-full bg-bg-primary/40 backdrop-blur-xl border border-border/20 shadow-lg"
      >
        <div className="relative">
          {isPlaying ? (
            <div className="flex items-end justify-center gap-[2px] w-5 h-5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-[3px] bg-text-secondary rounded-full"
                  animate={{ height: ["6px", "14px", "8px", "12px", "6px"] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          ) : (
            <VolumeX className="w-5 h-5 text-text-muted" />
          )}
        </div>
      </motion.button>

      {/* Expanded player drawer */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Player panel */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-bg-primary border-t border-border/30 rounded-t-3xl overflow-hidden"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-border/50" />
              </div>

              <div className="px-6 pb-8 pt-2">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-lg font-medium text-text-primary">Ambient Music</h3>
                    <p className="text-sm text-text-muted">Set the mood for reading</p>
                  </div>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="p-2 rounded-full hover:bg-bg-tertiary transition-colors"
                  >
                    <X className="w-5 h-5 text-text-secondary" />
                  </button>
                </div>

                {/* Play/Pause with visualizer */}
                <div className="flex items-center justify-center mb-8">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={togglePlay}
                    className="relative w-20 h-20 rounded-full bg-bg-tertiary border border-border/50 flex items-center justify-center"
                  >
                    {isPlaying ? (
                      <div className="flex items-end justify-center gap-1 w-10 h-10">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 bg-accent rounded-full"
                            animate={{ height: ["12px", "28px", "16px", "32px", "12px"] }}
                            transition={{
                              duration: 0.7,
                              repeat: Infinity,
                              delay: i * 0.1,
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <Volume2 className="w-8 h-8 text-text-secondary" />
                    )}

                    {isPlaying && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-accent/30"
                        animate={{ scale: [1, 1.2], opacity: [0.5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </motion.button>
                </div>

                {/* Genre selection */}
                <div className="mb-8">
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-3">Genre</p>
                  <div className="flex gap-2 flex-wrap">
                    {GENRES.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => changeGenre(g)}
                        className={`px-4 py-2 rounded-full text-sm transition-all ${
                          genre.id === g.id
                            ? "bg-text-primary text-bg-primary"
                            : "bg-bg-tertiary text-text-secondary hover:bg-bg-secondary"
                        }`}
                      >
                        {g.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Volume slider */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-text-muted uppercase tracking-wider">Volume</p>
                    <p className="text-xs text-text-muted">{Math.round(volume * 100)}%</p>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1 bg-bg-tertiary rounded-full appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-4
                      [&::-webkit-slider-thumb]:h-4
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-text-primary
                      [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-webkit-slider-thumb]:transition-transform
                      [&::-webkit-slider-thumb]:hover:scale-110"
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
