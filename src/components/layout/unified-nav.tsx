"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Feather,
  Music,
  Sun,
  User,
  LogIn,
  X,
  Play,
  Pause,
  Volume2,
  Type,
  AlignLeft,
  CloudRain,
  Waves,
  Flame,
  Wind,
  TreePine,
  Coffee,
  Zap,
  Bird,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { useMusic } from "@/hooks/use-music";
import { Avatar } from "@/components/ui/avatar";

const THEMES = [
  { id: "dark", label: "Dark", color: "#0a0a0a" },
  { id: "light", label: "Light", color: "#ffffff" },
  { id: "sepia", label: "Sepia", color: "#f4ecd8" },
  { id: "midnight", label: "Midnight", color: "#0d1117" },
  { id: "forest", label: "Forest", color: "#1a1f1a" },
] as const;

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

type DrawerType = "music" | "theme" | null;

type NavLinkItem = {
  href: string;
  icon: typeof Home;
  label: string;
  isProfile?: boolean;
};

type NavButtonItem = {
  type: "music" | "theme";
  icon: typeof Home;
  label: string;
};

type NavItem = NavLinkItem | NavButtonItem;

export function UnifiedNav() {
  const { user } = useAuth();
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

  const pathname = usePathname();
  const [barOpacity, setBarOpacity] = useState(1);
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);
  const [ambientStates, setAmbientStates] = useState<Record<string, AmbientState>>({});
  const [musicTab, setMusicTab] = useState<"streaming" | "ambient">("streaming");

  const ambientRefs = useRef<Record<string, HTMLAudioElement>>({});
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Navigation items
  const navItems: NavItem[] = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/create", icon: Feather, label: "Create" },
    { type: "music", icon: Music, label: "Music" },
    { type: "theme", icon: Sun, label: "Theme" },
    ...(user
      ? [{ href: `/${user.username}`, icon: User, label: "Profile", isProfile: true } as NavLinkItem]
      : [{ href: "/login", icon: LogIn, label: "Sign In" } as NavLinkItem]),
  ];

  // Auto-fade logic - bar fades when idle
  useEffect(() => {
    if (activeDrawer) {
      setBarOpacity(1);
      return;
    }

    const showBar = () => {
      setBarOpacity(1);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = setTimeout(() => {
        setBarOpacity(0.3);
      }, 3000);
    };

    const handleInteraction = () => showBar();

    showBar();

    document.addEventListener("click", handleInteraction);
    document.addEventListener("touchstart", handleInteraction, { passive: true });
    document.addEventListener("scroll", handleInteraction, { passive: true });
    document.addEventListener("mousemove", handleInteraction, { passive: true });

    return () => {
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("scroll", handleInteraction);
      document.removeEventListener("mousemove", handleInteraction);
    };
  }, [activeDrawer]);

  // Ambient sound controls
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

  const activeAmbientCount = Object.values(ambientStates).filter(s => s.playing).length;
  const isAnythingPlaying = musicPlaying || activeAmbientCount > 0;

  const handleNavClick = (item: NavButtonItem) => {
    setActiveDrawer(activeDrawer === item.type ? null : item.type);
  };

  const isNavLink = (item: NavItem): item is NavLinkItem => 'href' in item;
  const isNavButton = (item: NavItem): item is NavButtonItem => 'type' in item;

  const closeDrawer = () => setActiveDrawer(null);

  return (
    <>
      {/* Bottom Bar */}
      <motion.nav
        animate={{ opacity: barOpacity }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-40 safe-area-pb"
      >
        {/* Glass background */}
        <div className="absolute inset-0 bg-bg-primary/60 backdrop-blur-2xl border-t border-border/10" />

        <div className="relative flex items-center justify-around h-[52px] px-4 max-w-lg mx-auto">
          {navItems.map((item) => {
            const linkItem = isNavLink(item) ? item : null;
            const buttonItem = isNavButton(item) ? item : null;
            const isActive = linkItem && (
              pathname === linkItem.href ||
              (linkItem.isProfile && pathname === `/${user?.username}`)
            );
            const isDrawerOpen = buttonItem && activeDrawer === buttonItem.type;
            const isMusicItem = buttonItem && buttonItem.type === "music";

            const content = (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative flex flex-col items-center justify-center p-2"
              >
                {/* Active indicator dot */}
                {(isActive || isDrawerOpen) && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 w-1 h-1 rounded-full bg-accent"
                    transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                  />
                )}

                {/* Music playing pulse */}
                {isMusicItem && isAnythingPlaying && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-accent/20"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {/* Icon */}
                {linkItem?.isProfile && user ? (
                  <Avatar
                    src={user.avatarUrl}
                    fallback={user.displayName || user.username}
                    size="sm"
                    className={cn(
                      "w-[22px] h-[22px]",
                      isActive && "ring-1.5 ring-accent ring-offset-1 ring-offset-bg-primary"
                    )}
                  />
                ) : (
                  <item.icon
                    className={cn(
                      "w-[22px] h-[22px] transition-colors",
                      isActive || isDrawerOpen
                        ? "text-accent stroke-[1.5]"
                        : "text-text-muted stroke-[1.5]"
                    )}
                  />
                )}

                {/* Ambient count badge */}
                {isMusicItem && activeAmbientCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-accent text-[8px] font-bold flex items-center justify-center text-bg-primary"
                  >
                    {activeAmbientCount}
                  </motion.div>
                )}
              </motion.div>
            );

            if (linkItem) {
              return (
                <Link key={linkItem.href} href={linkItem.href} className="touch-manipulation">
                  {content}
                </Link>
              );
            }

            return buttonItem ? (
              <button
                key={buttonItem.type}
                onClick={() => handleNavClick(buttonItem)}
                className="touch-manipulation"
              >
                {content}
              </button>
            ) : null;
          })}
        </div>
      </motion.nav>

      {/* Drawer Backdrop */}
      <AnimatePresence>
        {activeDrawer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
        )}
      </AnimatePresence>

      {/* Music Drawer */}
      <AnimatePresence>
        {activeDrawer === "music" && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.3 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) closeDrawer();
            }}
            style={{ touchAction: "none" }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-bg-primary/95 backdrop-blur-3xl border-t border-border/20 rounded-t-3xl max-h-[50vh] overflow-hidden"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-border/40" />
            </div>

            <div className="px-6 pb-8 pt-1 overflow-y-auto max-h-[calc(50vh-24px)]">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-medium uppercase tracking-widest text-text-muted">Now Playing</h3>
                <button onClick={closeDrawer} className="p-2 rounded-xl hover:bg-bg-secondary transition-colors">
                  <X className="w-4 h-4 text-text-muted" />
                </button>
              </div>

              {/* Play/Pause button */}
              <div className="flex justify-center mb-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleMusic}
                  className={cn(
                    "flex items-center gap-3 px-8 py-4 rounded-2xl font-medium transition-all",
                    musicPlaying
                      ? "bg-accent text-bg-primary"
                      : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
                  )}
                >
                  {isLoading ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : musicPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                  <span>{musicPlaying ? "Pause" : "Play"}</span>
                </motion.button>
              </div>

              {/* Volume */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-text-muted flex items-center gap-1.5">
                    <Volume2 className="w-3 h-3" />
                    Volume
                  </span>
                  <span className="text-xs text-text-secondary tabular-nums">{Math.round(musicVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={musicVolume}
                  onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-bg-tertiary rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-accent
                    [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>

              {/* Tabs */}
              <div className="flex p-1 bg-bg-secondary/50 rounded-xl mb-4">
                {(["streaming", "ambient"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setMusicTab(tab)}
                    className={cn(
                      "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all capitalize",
                      musicTab === tab
                        ? "bg-bg-primary text-text-primary shadow-sm"
                        : "text-text-muted hover:text-text-secondary"
                    )}
                  >
                    {tab === "streaming" ? "Stations" : "Sounds"}
                  </button>
                ))}
              </div>

              {/* Streaming stations */}
              {musicTab === "streaming" && (
                <div className="grid grid-cols-3 gap-2">
                  {genres.map((genre) => (
                    <motion.button
                      key={genre.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedGenre(genre)}
                      className={cn(
                        "py-3 px-2 rounded-xl text-xs font-medium transition-all",
                        selectedGenre.id === genre.id
                          ? "bg-accent text-bg-primary"
                          : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
                      )}
                    >
                      {genre.name}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Ambient sounds */}
              {musicTab === "ambient" && (
                <div className="grid grid-cols-4 gap-2">
                  {AMBIENT_SOUNDS.map((sound) => {
                    const state = ambientStates[sound.id];
                    const isActive = state?.playing;
                    const Icon = sound.icon;

                    return (
                      <motion.button
                        key={sound.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleAmbient(sound)}
                        className={cn(
                          "flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all",
                          isActive
                            ? "bg-accent text-bg-primary"
                            : "bg-bg-secondary text-text-muted hover:bg-bg-tertiary hover:text-text-secondary"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[10px] font-medium">{sound.name}</span>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theme Drawer */}
      <AnimatePresence>
        {activeDrawer === "theme" && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.3 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) closeDrawer();
            }}
            style={{ touchAction: "none" }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-bg-primary/95 backdrop-blur-3xl border-t border-border/20 rounded-t-3xl max-h-[50vh] overflow-hidden"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-border/40" />
            </div>

            <div className="px-6 pb-8 pt-1 overflow-y-auto max-h-[calc(50vh-24px)]">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-medium uppercase tracking-widest text-text-muted">Reading Settings</h3>
                <button onClick={closeDrawer} className="p-2 rounded-xl hover:bg-bg-secondary transition-colors">
                  <X className="w-4 h-4 text-text-muted" />
                </button>
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
                      className={cn(
                        "flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all",
                        theme === t.id ? "ring-2 ring-accent" : "hover:bg-bg-secondary/50"
                      )}
                    >
                      <div
                        className="w-10 h-10 rounded-lg border border-border/50 shadow-sm"
                        style={{ backgroundColor: t.color }}
                      />
                      <span className={cn("text-[10px] font-medium", theme === t.id ? "text-accent" : "text-text-muted")}>
                        {t.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div className="mb-6">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-3 font-medium flex items-center gap-1.5">
                  <Type className="w-3 h-3" />
                  Text Size
                </p>
                <div className="flex gap-2">
                  {(["small", "medium", "large"] as const).map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFontSize(size)}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all",
                        fontSize === size
                          ? "bg-accent text-bg-primary"
                          : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
                      )}
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
                      className={cn(
                        "flex-1 py-3 px-4 rounded-xl transition-all",
                        fontStyle === option.value
                          ? "bg-accent text-bg-primary"
                          : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
                      )}
                    >
                      <span className={cn("text-lg", option.value === "serif" ? "font-serif" : "font-sans")}>
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
                  <p className="text-xs text-text-muted uppercase tracking-wider font-medium flex items-center gap-1.5">
                    <AlignLeft className="w-3 h-3" />
                    Line Spacing
                  </p>
                  <p className="text-xs text-text-secondary tabular-nums">{lineHeight.toFixed(1)}</p>
                </div>
                <input
                  type="range"
                  min="1.4"
                  max="2.2"
                  step="0.1"
                  value={lineHeight}
                  onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-bg-tertiary rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-accent
                    [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
