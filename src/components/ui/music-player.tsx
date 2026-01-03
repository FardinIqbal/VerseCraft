"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Music,
  CloudRain,
  Waves,
  Flame,
  Wind,
  TreePine,
  Coffee,
  Zap,
  Bird,
  Play,
} from "lucide-react";
import { useMusic } from "@/hooks/use-music";

// Reliable ambient sound sources
const AMBIENT_SOUNDS = [
  { id: "rain", name: "Rain", icon: CloudRain, url: "https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3" },
  { id: "waves", name: "Ocean", icon: Waves, url: "https://assets.mixkit.co/active_storage/sfx/2432/2432-preview.mp3" },
  { id: "fire", name: "Fire", icon: Flame, url: "https://assets.mixkit.co/active_storage/sfx/2574/2574-preview.mp3" },
  { id: "wind", name: "Wind", icon: Wind, url: "https://assets.mixkit.co/active_storage/sfx/2463/2463-preview.mp3" },
  { id: "forest", name: "Forest", icon: TreePine, url: "https://assets.mixkit.co/active_storage/sfx/2430/2430-preview.mp3" },
  { id: "coffee", name: "Cafe", icon: Coffee, url: "https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3" },
  { id: "thunder", name: "Storm", icon: Zap, url: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3" },
  { id: "birds", name: "Birds", icon: Bird, url: "https://assets.mixkit.co/active_storage/sfx/2431/2431-preview.mp3" },
];

interface AmbientState {
  volume: number;
  playing: boolean;
}

export function MusicPlayer() {
  const {
    genres,
    selectedGenre,
    musicPlaying,
    musicVolume,
    isLoading,
    setSelectedGenre,
    setMusicVolume,
    toggleMusic,
  } = useMusic();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [ambientStates, setAmbientStates] = useState<Record<string, AmbientState>>({});
  const [activeTab, setActiveTab] = useState<"music" | "ambient">("music");

  const ambientRefs = useRef<Record<string, HTMLAudioElement>>({});
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollY = useRef(0);

  // Auto-hide button
  useEffect(() => {
    if (isExpanded) {
      setIsVisible(true);
      return;
    }

    const showButton = () => {
      setIsVisible(true);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    };

    const handleClick = () => showButton();
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY.current) {
        showButton();
      }
      lastScrollY.current = currentScrollY;
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      if ((touchStartY < 100 && touchEndY > touchStartY + 30) ||
          (touchStartY > window.innerHeight - 100 && touchEndY < touchStartY - 30)) {
        showButton();
      }
    };

    showButton();

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

  const toggleAmbient = useCallback((sound: typeof AMBIENT_SOUNDS[0]) => {
    const current = ambientStates[sound.id];

    if (current?.playing) {
      ambientRefs.current[sound.id]?.pause();
      setAmbientStates(prev => ({ ...prev, [sound.id]: { ...prev[sound.id], playing: false } }));
    } else {
      let audio = ambientRefs.current[sound.id];
      if (!audio) {
        audio = new Audio(sound.url);
        audio.loop = true;
        audio.crossOrigin = "anonymous";
        ambientRefs.current[sound.id] = audio;
      }
      audio.volume = current?.volume ?? 0.5;
      audio.play().catch(console.error);
      setAmbientStates(prev => ({
        ...prev,
        [sound.id]: { volume: current?.volume ?? 0.5, playing: true }
      }));
    }
  }, [ambientStates]);

  const setAmbientVolume = useCallback((id: string, volume: number) => {
    if (ambientRefs.current[id]) {
      ambientRefs.current[id].volume = volume;
    }
    setAmbientStates(prev => ({ ...prev, [id]: { ...prev[id], volume } }));
  }, []);

  const isAnythingPlaying = musicPlaying || Object.values(ambientStates).some(s => s.playing);
  const activeAmbientCount = Object.values(ambientStates).filter(s => s.playing).length;

  return (
    <div className="md:hidden">
      {/* Floating trigger - mobile only */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(true);
            }}
            className="fixed top-6 left-4 z-40 group"
          >
            <motion.div
              className="p-3.5 rounded-2xl bg-bg-primary/70 backdrop-blur-2xl border border-border/40 shadow-2xl relative overflow-hidden"
              animate={isAnythingPlaying ? {
                boxShadow: ["0 0 20px rgba(255,255,255,0.05)", "0 0 30px rgba(255,255,255,0.1)", "0 0 20px rgba(255,255,255,0.05)"]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {isAnythingPlaying && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent/5"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              )}

              <div className="relative">
                {isAnythingPlaying ? (
                  <motion.div className="flex items-end justify-center gap-[3px] w-5 h-5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-[4px] rounded-full bg-gradient-to-t from-accent/60 to-accent"
                        animate={{
                          height: ["4px", "18px", "8px", "14px", "4px"],
                          opacity: [0.6, 1, 0.8, 1, 0.6]
                        }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay: i * 0.15,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Music className="w-5 h-5 text-text-muted group-hover:text-text-secondary transition-colors" />
                  </motion.div>
                )}
              </div>

              <AnimatePresence>
                {activeAmbientCount > 0 && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-[10px] font-bold flex items-center justify-center text-bg-primary shadow-lg"
                  >
                    {activeAmbientCount}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isExpanded && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50"
            />

            <motion.div
              initial={{ y: "100%", opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0.5 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100 || info.velocity.y > 500) {
                  setIsExpanded(false);
                }
              }}
              style={{ touchAction: "none" }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-b from-bg-secondary to-bg-primary border-t border-border/30 rounded-t-[2.5rem] max-h-[88vh] overflow-hidden"
            >
              <motion.div className="flex justify-center pt-4 pb-2 cursor-grab active:cursor-grabbing" whileHover={{ scale: 1.1 }}>
                <div className="w-14 h-1.5 rounded-full bg-border/50" />
              </motion.div>

              <div className="px-6 pb-12 pt-2 overflow-y-auto max-h-[calc(88vh-24px)]">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-text-primary tracking-tight">Soundscape</h3>
                    <p className="text-sm text-text-muted mt-1">Create your perfect atmosphere</p>
                  </div>
                  <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => setIsExpanded(false)} className="p-3 rounded-2xl bg-bg-tertiary/50 hover:bg-bg-tertiary transition-colors">
                    <X className="w-5 h-5 text-text-secondary" />
                  </motion.button>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex p-1.5 bg-bg-tertiary/50 rounded-2xl mb-8">
                  {(["music", "ambient"] as const).map((tab) => (
                    <motion.button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`relative flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-colors ${activeTab === tab ? "text-text-primary" : "text-text-muted"}`}
                      whileTap={{ scale: 0.98 }}
                    >
                      {activeTab === tab && (
                        <motion.div layoutId="activeTab" className="absolute inset-0 bg-bg-primary rounded-xl shadow-lg" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
                      )}
                      <span className="relative z-10 capitalize">{tab}</span>
                    </motion.button>
                  ))}
                </motion.div>

                <AnimatePresence mode="wait">
                  {activeTab === "music" ? (
                    <motion.div key="music" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.2 }}>
                      <div className="flex justify-center mb-10">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={toggleMusic} className="relative">
                          <motion.div
                            className="w-28 h-28 rounded-full bg-gradient-to-br from-bg-tertiary via-bg-secondary to-bg-tertiary border border-border/40 flex items-center justify-center shadow-2xl"
                            animate={musicPlaying ? { boxShadow: ["0 0 30px rgba(255,255,255,0.05)", "0 0 50px rgba(255,255,255,0.1)", "0 0 30px rgba(255,255,255,0.05)"] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {isLoading ? (
                              <motion.div className="w-8 h-8 border-2 border-text-muted border-t-accent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                            ) : musicPlaying ? (
                              <motion.div className="flex items-end gap-1.5">
                                {[0, 1, 2, 3, 4].map((i) => (
                                  <motion.div key={i} className="w-2.5 rounded-full bg-gradient-to-t from-accent/70 to-accent" animate={{ height: ["8px", "36px", "16px", "28px", "8px"] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.1 }} />
                                ))}
                              </motion.div>
                            ) : (
                              <Play className="w-12 h-12 text-text-secondary ml-1" />
                            )}
                          </motion.div>

                          {musicPlaying && (
                            <>
                              {[0, 1].map((i) => (
                                <motion.div key={i} className="absolute inset-0 rounded-full border border-accent/30" animate={{ scale: [1, 1.4], opacity: [0.5, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.8 }} />
                              ))}
                            </>
                          )}
                        </motion.button>
                      </div>

                      <motion.div className="text-center mb-8" animate={musicPlaying ? { opacity: 1 } : { opacity: 0.6 }}>
                        <p className="text-lg font-semibold text-text-primary">{selectedGenre.name}</p>
                        <p className="text-sm text-text-muted">{selectedGenre.desc}</p>
                      </motion.div>

                      <p className="text-xs text-text-muted uppercase tracking-[0.2em] mb-4 font-medium">Stations</p>
                      <div className="grid grid-cols-3 gap-3 mb-10">
                        {genres.map((genre, i) => (
                          <motion.button
                            key={genre.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.05 }}
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setSelectedGenre(genre)}
                            className={`relative py-4 px-3 rounded-2xl text-sm font-medium transition-all overflow-hidden ${selectedGenre.id === genre.id ? "bg-accent text-bg-primary shadow-lg" : "bg-bg-tertiary/60 text-text-secondary hover:bg-bg-tertiary"}`}
                          >
                            {selectedGenre.id === genre.id && (
                              <motion.div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" animate={{ opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 2, repeat: Infinity }} />
                            )}
                            <span className="relative z-10">{genre.name}</span>
                          </motion.button>
                        ))}
                      </div>

                      <div>
                        <div className="flex justify-between mb-4">
                          <p className="text-xs text-text-muted uppercase tracking-[0.2em] font-medium">Volume</p>
                          <p className="text-sm text-text-secondary font-medium tabular-nums">{Math.round(musicVolume * 100)}%</p>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-0 h-3 bg-bg-tertiary rounded-full" />
                          <motion.div className="absolute left-0 top-0 h-3 bg-gradient-to-r from-accent/80 to-accent rounded-full" style={{ width: `${musicVolume * 100}%` }} />
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={musicVolume}
                            onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                            className="relative w-full h-3 appearance-none bg-transparent cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-bg-primary"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="ambient" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>
                      <p className="text-xs text-text-muted uppercase tracking-[0.2em] mb-5 font-medium">Layer sounds together</p>

                      <div className="grid grid-cols-2 gap-3">
                        {AMBIENT_SOUNDS.map((sound, i) => {
                          const state = ambientStates[sound.id];
                          const isActive = state?.playing;
                          const Icon = sound.icon;

                          return (
                            <motion.div
                              key={sound.id}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 + i * 0.04 }}
                              whileHover={{ scale: 1.02 }}
                              className={`relative p-5 rounded-2xl border transition-all overflow-hidden ${isActive ? "bg-accent/10 border-accent/30" : "bg-bg-tertiary/40 border-transparent hover:bg-bg-tertiary/60"}`}
                            >
                              {isActive && (
                                <motion.div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
                              )}

                              <div className="relative z-10">
                                <div className="flex items-center justify-between mb-3">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => toggleAmbient(sound)}
                                    className={`p-3 rounded-xl transition-all ${isActive ? "bg-accent text-bg-primary shadow-lg" : "bg-bg-secondary text-text-muted hover:text-text-secondary"}`}
                                  >
                                    <Icon className="w-5 h-5" />
                                  </motion.button>

                                  {isActive && (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex gap-[3px]">
                                      {[0, 1, 2].map((j) => (
                                        <motion.div key={j} className="w-1 bg-accent rounded-full" animate={{ height: ["4px", "14px", "6px"] }} transition={{ duration: 0.7, repeat: Infinity, delay: j * 0.12 }} />
                                      ))}
                                    </motion.div>
                                  )}
                                </div>

                                <p className={`text-sm font-medium mb-2 ${isActive ? "text-text-primary" : "text-text-secondary"}`}>{sound.name}</p>

                                <AnimatePresence>
                                  {isActive && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                                      <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={state?.volume ?? 0.5}
                                        onChange={(e) => setAmbientVolume(sound.id, parseFloat(e.target.value))}
                                        className="w-full h-1.5 bg-bg-secondary rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:shadow-md"
                                      />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
