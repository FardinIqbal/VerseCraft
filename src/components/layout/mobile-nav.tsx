"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Compass, PlusSquare, User, LogIn, Settings, Feather, Palette, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { Avatar } from "@/components/ui/avatar";

const THEMES = [
  { id: "dark", label: "Dark", color: "#0a0a0a" },
  { id: "light", label: "Light", color: "#ffffff" },
  { id: "sepia", label: "Sepia", color: "#f4ecd8" },
  { id: "midnight", label: "Mid", color: "#0d1117" },
  { id: "forest", label: "Forest", color: "#1a1f1a" },
] as const;

export function MobileNav() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [desktopNavVisible, setDesktopNavVisible] = useState(false);
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [showMusicPanel, setShowMusicPanel] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const desktopHideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollY = useRef(0);

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/explore", icon: Compass, label: "Explore" },
    { href: "/search", icon: Search, label: "Search" },
    ...(user
      ? [
          { href: "/create", icon: PlusSquare, label: "Create" },
          {
            href: `/${user.username}`,
            icon: User,
            label: "Profile",
            isProfile: true,
          },
        ]
      : [{ href: "/login", icon: LogIn, label: "Sign In" }]),
  ];

  const desktopNavItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/explore", icon: Compass, label: "Explore" },
    { href: "/search", icon: Search, label: "Search" },
    ...(user
      ? [
          { href: "/create", icon: PlusSquare, label: "Create" },
          {
            href: `/${user.username}`,
            icon: User,
            label: "Profile",
            isProfile: true,
          },
          { href: "/settings", icon: Settings, label: "Settings" },
        ]
      : [{ href: "/login", icon: LogIn, label: "Sign In" }]),
  ];

  // Mobile auto-hide logic
  useEffect(() => {
    const showNav = () => {
      setIsVisible(true);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    };

    const handleInteraction = () => showNav();

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY.current) {
        showNav();
      }
      lastScrollY.current = currentScrollY;
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const screenHeight = window.innerHeight;
      if (touchStartY > screenHeight - 100 && touchEndY < touchStartY - 30) {
        showNav();
      }
    };

    showNav();

    document.addEventListener("click", handleInteraction);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("scroll", handleScroll);

    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Desktop hover zone detection
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Show when mouse is within 20px of left edge
      if (e.clientX <= 20) {
        setDesktopNavVisible(true);
        if (desktopHideTimeoutRef.current) {
          clearTimeout(desktopHideTimeoutRef.current);
        }
      }
    };

    // Keyboard shortcut: press 'n' to toggle nav
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          setDesktopNavVisible(prev => !prev);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
      if (desktopHideTimeoutRef.current) {
        clearTimeout(desktopHideTimeoutRef.current);
      }
    };
  }, []);

  const handleDesktopNavMouseLeave = () => {
    desktopHideTimeoutRef.current = setTimeout(() => {
      setDesktopNavVisible(false);
    }, 300);
  };

  const handleDesktopNavMouseEnter = () => {
    if (desktopHideTimeoutRef.current) {
      clearTimeout(desktopHideTimeoutRef.current);
    }
  };

  return (
    <>
      {/* ============ DESKTOP SIDEBAR ============ */}
      {/* Hover trigger zone - invisible */}
      <div
        className="hidden md:block fixed left-0 top-0 w-5 h-full z-50"
        onMouseEnter={() => setDesktopNavVisible(true)}
      />

      {/* Desktop sidebar */}
      <AnimatePresence>
        {desktopNavVisible && (
          <motion.nav
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onMouseEnter={handleDesktopNavMouseEnter}
            onMouseLeave={handleDesktopNavMouseLeave}
            className="hidden md:flex fixed left-0 top-0 h-full z-40 flex-col"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-bg-primary/95 backdrop-blur-xl border-r border-border/30" />

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full py-6 px-3 w-20">
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center justify-center mb-8 p-2 rounded-xl hover:bg-bg-secondary transition-colors"
              >
                <motion.div
                  whileHover={{ rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Feather className="w-6 h-6 text-accent" />
                </motion.div>
              </Link>

              {/* Nav items */}
              <div className="flex-1 flex flex-col gap-2">
                {desktopNavItems.map((item, index) => {
                  const isActive =
                    pathname === item.href ||
                    (item.isProfile && pathname === `/${user?.username}`);

                  return (
                    <Link key={item.href} href={item.href}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          "relative flex flex-col items-center gap-1 p-3 rounded-xl transition-colors",
                          isActive
                            ? "text-text-primary bg-bg-secondary"
                            : "text-text-tertiary hover:text-text-primary hover:bg-bg-secondary/50"
                        )}
                      >
                        {item.isProfile && user ? (
                          <Avatar
                            src={user.avatarUrl}
                            fallback={user.displayName || user.username}
                            size="sm"
                            className={cn(
                              "w-6 h-6",
                              isActive && "ring-2 ring-accent ring-offset-1 ring-offset-bg-primary"
                            )}
                          />
                        ) : (
                          <item.icon className={cn("w-5 h-5", isActive && "stroke-[2.5]")} />
                        )}
                        <span className="text-[10px] font-medium">{item.label}</span>
                      </motion.div>
                    </Link>
                  );
                })}

                {/* Divider */}
                <div className="my-2 mx-3 h-px bg-border/30" />

                {/* Theme button */}
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: desktopNavItems.length * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowThemePanel(!showThemePanel)}
                  className={cn(
                    "relative flex flex-col items-center gap-1 p-3 rounded-xl transition-colors",
                    showThemePanel
                      ? "text-text-primary bg-bg-secondary"
                      : "text-text-tertiary hover:text-text-primary hover:bg-bg-secondary/50"
                  )}
                >
                  <Palette className="w-5 h-5" />
                  <span className="text-[10px] font-medium">Theme</span>
                </motion.button>

                {/* Music button */}
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (desktopNavItems.length + 1) * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMusicPanel(!showMusicPanel)}
                  className={cn(
                    "relative flex flex-col items-center gap-1 p-3 rounded-xl transition-colors",
                    showMusicPanel
                      ? "text-text-primary bg-bg-secondary"
                      : "text-text-tertiary hover:text-text-primary hover:bg-bg-secondary/50"
                  )}
                >
                  <Music className="w-5 h-5" />
                  <span className="text-[10px] font-medium">Music</span>
                </motion.button>
              </div>

              {/* Keyboard hint */}
              <div className="text-center">
                <span className="text-[10px] text-text-muted">
                  Press <kbd className="px-1.5 py-0.5 bg-bg-secondary rounded text-text-tertiary">N</kbd>
                </span>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Theme Panel - appears next to sidebar */}
      <AnimatePresence>
        {showThemePanel && desktopNavVisible && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="hidden md:block fixed left-20 top-0 h-full z-30"
            onMouseEnter={handleDesktopNavMouseEnter}
            onMouseLeave={handleDesktopNavMouseLeave}
          >
            <div className="h-full py-6 px-4 bg-bg-primary/95 backdrop-blur-xl border-r border-border/30">
              <p className="text-text-secondary text-xs font-medium mb-4 tracking-wide">THEME</p>
              <div className="flex flex-col gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                      theme === t.id
                        ? "bg-bg-secondary text-text-primary"
                        : "text-text-tertiary hover:text-text-primary hover:bg-bg-secondary/50"
                    )}
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: t.color }}
                    />
                    <span className="text-sm">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Music Panel - appears next to sidebar */}
      <AnimatePresence>
        {showMusicPanel && desktopNavVisible && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="hidden md:block fixed left-20 top-0 h-full z-30"
            onMouseEnter={handleDesktopNavMouseEnter}
            onMouseLeave={handleDesktopNavMouseLeave}
          >
            <div className="h-full py-6 px-4 bg-bg-primary/95 backdrop-blur-xl border-r border-border/30">
              <p className="text-text-secondary text-xs font-medium mb-4 tracking-wide">MUSIC</p>
              <p className="text-text-tertiary text-xs">
                Use the floating music button
                <br />
                to control audio playback
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop edge indicator when nav hidden */}
      <AnimatePresence>
        {!desktopNavVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="hidden md:block fixed left-0 top-1/2 -translate-y-1/2 z-30"
          >
            <motion.div
              className="w-1 h-16 rounded-r-full bg-border/20"
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ MOBILE NAV ============ */}
      {/* Swipe hint - subtle line at bottom when nav is hidden */}
      <AnimatePresence>
        {!isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed bottom-2 left-1/2 -translate-x-1/2 z-30"
          >
            <motion.div
              className="w-32 h-1 rounded-full bg-border/30"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isVisible && (
          <motion.nav
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-40 safe-area-pb"
          >
            {/* Background with blur */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/98 to-bg-primary/90 backdrop-blur-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />

            {/* Top border glow */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />

            <div className="relative flex items-center justify-around h-16 px-2">
              {navItems.map((item, index) => {
                const isActive =
                  pathname === item.href ||
                  (item.isProfile && pathname === `/${user?.username}`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative flex flex-col items-center justify-center w-16 h-14"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 + index * 0.03, type: "spring" }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={cn(
                        "relative flex flex-col items-center gap-0.5 p-2 rounded-xl transition-colors",
                        isActive ? "text-text-primary" : "text-text-muted"
                      )}
                    >
                      {/* Active glow */}
                      {isActive && (
                        <motion.div
                          layoutId="navGlow"
                          className="absolute inset-0 bg-accent/15 rounded-xl"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                        />
                      )}

                      <motion.div
                        className="relative z-10"
                        animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        {item.isProfile && user ? (
                          <Avatar
                            src={user.avatarUrl}
                            fallback={user.displayName || user.username}
                            size="sm"
                            className={cn(
                              "w-6 h-6 transition-all",
                              isActive && "ring-2 ring-accent ring-offset-1 ring-offset-bg-primary"
                            )}
                          />
                        ) : (
                          <item.icon className={cn("w-5 h-5", isActive && "stroke-[2.5]")} />
                        )}
                      </motion.div>

                      <span className={cn(
                        "text-[10px] font-medium relative z-10",
                        isActive && "text-accent"
                      )}>
                        {item.label}
                      </span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
