"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  VolumeX,
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
} from "lucide-react";

const MUSIC_GENRES = [
  { id: "lofi", name: "Lofi", url: "https://play.streamafrica.net/lofiradio" },
  { id: "chillhop", name: "Chillhop", url: "https://streams.fluxfm.de/Chillhop/mp3-128/streams.fluxfm.de/" },
  { id: "classical", name: "Classical", url: "https://live.musopen.org:8085/streamvbr0" },
  { id: "jazz", name: "Jazz", url: "https://streaming.radio.co/s774887f7b/listen" },
  { id: "ambient", name: "Ambient", url: "https://ice1.somafm.com/dronezone-128-mp3" },
  { id: "piano", name: "Piano", url: "https://ice1.somafm.com/sonicuniverse-128-mp3" },
];

const AMBIENT_SOUNDS = [
  { id: "rain", name: "Rain", icon: CloudRain, url: "https://cdn.pixabay.com/audio/2022/05/13/audio_257112181b.mp3" },
  { id: "waves", name: "Waves", icon: Waves, url: "https://cdn.pixabay.com/audio/2022/06/07/audio_b9bd4170e4.mp3" },
  { id: "fire", name: "Fireplace", icon: Flame, url: "https://cdn.pixabay.com/audio/2021/08/04/audio_bb630cc098.mp3" },
  { id: "wind", name: "Wind", icon: Wind, url: "https://cdn.pixabay.com/audio/2022/03/15/audio_8cb749d484.mp3" },
  { id: "forest", name: "Forest", icon: TreePine, url: "https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3" },
  { id: "coffee", name: "Cafe", icon: Coffee, url: "https://cdn.pixabay.com/audio/2022/10/18/audio_69a61cd6d6.mp3" },
  { id: "thunder", name: "Thunder", icon: Zap, url: "https://cdn.pixabay.com/audio/2022/03/10/audio_4dedf5bf94.mp3" },
  { id: "birds", name: "Birds", icon: Bird, url: "https://cdn.pixabay.com/audio/2022/02/07/audio_5f1e2618c5.mp3" },
];

interface AmbientState {
  id: string;
  volume: number;
  playing: boolean;
  audio?: HTMLAudioElement;
}

export function MusicPlayer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [selectedGenre, setSelectedGenre] = useState(MUSIC_GENRES[0]);
  const [ambientStates, setAmbientStates] = useState<Record<string, AmbientState>>({});
  const [hasInteracted, setHasInteracted] = useState(false);
  const [activeTab, setActiveTab] = useState<"music" | "ambient">("music");
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const ambientRefs = useRef<Record<string, HTMLAudioElement>>({});

  // Auto-play music on first interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        setMusicPlaying(true);
      }
    };

    document.addEventListener("click", handleFirstInteraction, { once: true });
    document.addEventListener("touchstart", handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, [hasInteracted]);

  // Load preferences
  useEffect(() => {
    const savedVolume = localStorage.getItem("musicVolume");
    const savedGenre = localStorage.getItem("musicGenre");
    if (savedVolume) setMusicVolume(parseFloat(savedVolume));
    if (savedGenre) {
      const found = MUSIC_GENRES.find((g) => g.id === savedGenre);
      if (found) setSelectedGenre(found);
    }
  }, []);

  // Music audio control
  useEffect(() => {
    if (!musicRef.current) {
      musicRef.current = new Audio(selectedGenre.url);
      musicRef.current.loop = true;
    }
    musicRef.current.volume = musicVolume;

    if (musicPlaying && hasInteracted) {
      musicRef.current.play().catch(() => setMusicPlaying(false));
    } else {
      musicRef.current.pause();
    }
  }, [musicPlaying, hasInteracted, musicVolume, selectedGenre.url]);

  const changeGenre = useCallback(
    (genre: (typeof MUSIC_GENRES)[0]) => {
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current.src = genre.url;
        if (musicPlaying) musicRef.current.play().catch(() => {});
      }
      setSelectedGenre(genre);
      localStorage.setItem("musicGenre", genre.id);
    },
    [musicPlaying]
  );

  const toggleAmbient = useCallback((sound: (typeof AMBIENT_SOUNDS)[0]) => {
    setAmbientStates((prev) => {
      const current = prev[sound.id];
      if (current?.playing) {
        current.audio?.pause();
        return { ...prev, [sound.id]: { ...current, playing: false } };
      } else {
        let audio = ambientRefs.current[sound.id];
        if (!audio) {
          audio = new Audio(sound.url);
          audio.loop = true;
          audio.volume = current?.volume ?? 0.5;
          ambientRefs.current[sound.id] = audio;
        }
        audio.play().catch(() => {});
        return {
          ...prev,
          [sound.id]: {
            id: sound.id,
            volume: current?.volume ?? 0.5,
            playing: true,
            audio,
          },
        };
      }
    });
  }, []);

  const setAmbientVolume = useCallback((id: string, volume: number) => {
    setAmbientStates((prev) => {
      const current = prev[id];
      if (current?.audio) current.audio.volume = volume;
      return { ...prev, [id]: { ...current, id, volume, playing: current?.playing ?? false } };
    });
  }, []);

  const isAnythingPlaying = musicPlaying || Object.values(ambientStates).some((s) => s.playing);
  const activeAmbientCount = Object.values(ambientStates).filter((s) => s.playing).length;

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(true)}
        className="fixed top-6 left-4 z-40 p-3 rounded-2xl bg-bg-primary/60 backdrop-blur-2xl border border-border/30 shadow-2xl"
      >
        <div className="relative">
          {isAnythingPlaying ? (
            <motion.div className="flex items-end justify-center gap-[3px] w-5 h-5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-[4px] rounded-full bg-gradient-to-t from-text-secondary to-text-primary"
                  animate={{ height: ["5px", "16px", "8px", "14px", "5px"] }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    delay: i * 0.12,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          ) : (
            <Music className="w-5 h-5 text-text-muted" />
          )}

          {/* Active ambient indicator */}
          {activeAmbientCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-[10px] font-medium flex items-center justify-center text-bg-primary"
            >
              {activeAmbientCount}
            </motion.div>
          )}
        </div>
      </motion.button>

      {/* Expanded drawer */}
      <AnimatePresence>
        {isExpanded && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-bg-primary border-t border-border/20 rounded-t-[2rem] max-h-[85vh] overflow-hidden"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3">
                <motion.div
                  className="w-12 h-1.5 rounded-full bg-border/40"
                  whileHover={{ scaleX: 1.2 }}
                />
              </div>

              <div className="px-6 pb-10 pt-4 overflow-y-auto max-h-[calc(85vh-20px)]">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <motion.h3
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xl font-semibold text-text-primary"
                    >
                      Soundscape
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-sm text-text-muted"
                    >
                      Curate your reading atmosphere
                    </motion.p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsExpanded(false)}
                    className="p-2 rounded-xl hover:bg-bg-tertiary transition-colors"
                  >
                    <X className="w-5 h-5 text-text-secondary" />
                  </motion.button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 p-1 bg-bg-tertiary/50 rounded-2xl">
                  {(["music", "ambient"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                        activeTab === tab
                          ? "bg-bg-primary text-text-primary shadow-lg"
                          : "text-text-muted hover:text-text-secondary"
                      }`}
                    >
                      {tab === "music" ? "Music" : "Ambient"}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === "music" ? (
                    <motion.div
                      key="music"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      {/* Play button */}
                      <div className="flex justify-center mb-8">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setHasInteracted(true);
                            setMusicPlaying(!musicPlaying);
                          }}
                          className="relative w-24 h-24 rounded-full bg-gradient-to-br from-bg-tertiary to-bg-secondary border border-border/30 flex items-center justify-center shadow-2xl"
                        >
                          {musicPlaying ? (
                            <motion.div className="flex items-end gap-1.5">
                              {[0, 1, 2, 3, 4].map((i) => (
                                <motion.div
                                  key={i}
                                  className="w-2 rounded-full bg-gradient-to-t from-accent/80 to-accent"
                                  animate={{ height: ["10px", "32px", "18px", "28px", "10px"] }}
                                  transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    delay: i * 0.08,
                                  }}
                                />
                              ))}
                            </motion.div>
                          ) : (
                            <Volume2 className="w-10 h-10 text-text-secondary" />
                          )}

                          {musicPlaying && (
                            <>
                              <motion.div
                                className="absolute inset-0 rounded-full border-2 border-accent/20"
                                animate={{ scale: [1, 1.3], opacity: [0.4, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                              <motion.div
                                className="absolute inset-0 rounded-full border-2 border-accent/20"
                                animate={{ scale: [1, 1.3], opacity: [0.4, 0] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                              />
                            </>
                          )}
                        </motion.button>
                      </div>

                      {/* Genre grid */}
                      <p className="text-xs text-text-muted uppercase tracking-widest mb-3">Genre</p>
                      <div className="grid grid-cols-3 gap-2 mb-8">
                        {MUSIC_GENRES.map((genre, i) => (
                          <motion.button
                            key={genre.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => changeGenre(genre)}
                            className={`py-3 px-3 rounded-xl text-sm font-medium transition-all ${
                              selectedGenre.id === genre.id
                                ? "bg-text-primary text-bg-primary shadow-lg"
                                : "bg-bg-tertiary/70 text-text-secondary hover:bg-bg-tertiary"
                            }`}
                          >
                            {genre.name}
                          </motion.button>
                        ))}
                      </div>

                      {/* Volume */}
                      <div>
                        <div className="flex justify-between mb-3">
                          <p className="text-xs text-text-muted uppercase tracking-widest">Volume</p>
                          <p className="text-xs text-text-muted tabular-nums">{Math.round(musicVolume * 100)}%</p>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={musicVolume}
                          onChange={(e) => {
                            const v = parseFloat(e.target.value);
                            setMusicVolume(v);
                            localStorage.setItem("musicVolume", String(v));
                          }}
                          className="w-full h-2 bg-bg-tertiary rounded-full appearance-none cursor-pointer
                            [&::-webkit-slider-thumb]:appearance-none
                            [&::-webkit-slider-thumb]:w-5
                            [&::-webkit-slider-thumb]:h-5
                            [&::-webkit-slider-thumb]:rounded-full
                            [&::-webkit-slider-thumb]:bg-text-primary
                            [&::-webkit-slider-thumb]:shadow-lg
                            [&::-webkit-slider-thumb]:cursor-pointer
                            [&::-webkit-slider-thumb]:transition-transform
                            [&::-webkit-slider-thumb]:hover:scale-110"
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="ambient"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <p className="text-xs text-text-muted uppercase tracking-widest mb-4">
                        Layer ambient sounds
                      </p>

                      <div className="space-y-3">
                        {AMBIENT_SOUNDS.map((sound, i) => {
                          const state = ambientStates[sound.id];
                          const isActive = state?.playing;
                          const Icon = sound.icon;

                          return (
                            <motion.div
                              key={sound.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.04 }}
                              className={`p-4 rounded-2xl border transition-all ${
                                isActive
                                  ? "bg-bg-tertiary/80 border-border/50"
                                  : "bg-bg-tertiary/30 border-transparent"
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => toggleAmbient(sound)}
                                  className={`p-3 rounded-xl transition-colors ${
                                    isActive ? "bg-accent text-bg-primary" : "bg-bg-secondary text-text-muted"
                                  }`}
                                >
                                  <Icon className="w-5 h-5" />
                                </motion.button>

                                <div className="flex-1">
                                  <p className={`text-sm font-medium ${isActive ? "text-text-primary" : "text-text-secondary"}`}>
                                    {sound.name}
                                  </p>
                                  {isActive && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      className="mt-2"
                                    >
                                      <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={state?.volume ?? 0.5}
                                        onChange={(e) => setAmbientVolume(sound.id, parseFloat(e.target.value))}
                                        className="w-full h-1 bg-bg-secondary rounded-full appearance-none cursor-pointer
                                          [&::-webkit-slider-thumb]:appearance-none
                                          [&::-webkit-slider-thumb]:w-3
                                          [&::-webkit-slider-thumb]:h-3
                                          [&::-webkit-slider-thumb]:rounded-full
                                          [&::-webkit-slider-thumb]:bg-accent"
                                      />
                                    </motion.div>
                                  )}
                                </div>

                                {isActive && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="flex gap-[2px]"
                                  >
                                    {[0, 1, 2].map((j) => (
                                      <motion.div
                                        key={j}
                                        className="w-1 bg-accent rounded-full"
                                        animate={{ height: ["4px", "12px", "6px"] }}
                                        transition={{ duration: 0.6, repeat: Infinity, delay: j * 0.1 }}
                                      />
                                    ))}
                                  </motion.div>
                                )}
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
    </>
  );
}
