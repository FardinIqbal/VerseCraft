"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Compass, PlusSquare, User, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Avatar } from "@/components/ui/avatar";

export function MobileNav() {
  const { user } = useAuth();
  const pathname = usePathname();

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

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 25 }}
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 safe-area-pb"
    >
      {/* Gradient blur effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/95 to-bg-primary/80 backdrop-blur-2xl" />

      {/* Subtle top border with gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "relative flex flex-col items-center gap-1 p-2 rounded-xl transition-colors duration-200",
                  isActive ? "text-text-primary" : "text-text-muted"
                )}
              >
                {/* Active background glow */}
                {isActive && (
                  <motion.div
                    layoutId="navActiveGlow"
                    className="absolute inset-0 bg-accent/10 rounded-xl"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}

                {/* Icon */}
                <motion.div
                  animate={isActive ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  {item.isProfile && user ? (
                    <Avatar
                      src={user.avatarUrl}
                      fallback={user.displayName || user.username}
                      size="sm"
                      className={cn(
                        "w-6 h-6 transition-all duration-200",
                        isActive && "ring-2 ring-accent ring-offset-2 ring-offset-bg-primary"
                      )}
                    />
                  ) : (
                    <item.icon
                      className={cn(
                        "w-5 h-5 transition-all duration-200",
                        isActive && "stroke-[2.5]"
                      )}
                    />
                  )}
                </motion.div>

                {/* Label */}
                <motion.span
                  animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 0 }}
                  className={cn(
                    "text-[10px] font-medium tracking-wide relative z-10",
                    isActive && "text-accent"
                  )}
                >
                  {item.label}
                </motion.span>

                {/* Active indicator dot */}
                {isActive && (
                  <motion.div
                    layoutId="navActiveDot"
                    className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-accent"
                    transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full bg-accent"
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
