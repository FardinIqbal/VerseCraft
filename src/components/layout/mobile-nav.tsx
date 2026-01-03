"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Compass, PlusSquare, User, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Avatar } from "@/components/ui/avatar";

export function MobileNav() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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

  // Auto-hide logic
  useEffect(() => {
    const showNav = () => {
      setIsVisible(true);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    };

    // Show on any interaction
    const handleInteraction = () => showNav();

    // Show on scroll up, hide on scroll down
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY.current) {
        showNav();
      }
      lastScrollY.current = currentScrollY;
    };

    // Show on swipe up from bottom
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const screenHeight = window.innerHeight;
      // If swipe started in bottom 100px and swiped up
      if (touchStartY > screenHeight - 100 && touchEndY < touchStartY - 30) {
        showNav();
      }
    };

    // Initial show then hide
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

  return (
    <>
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
