"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusSquare, User, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Avatar } from "@/components/ui/avatar";

export function MobileNav() {
  const { user } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-primary)]/80 backdrop-blur-lg border-t border-[var(--border)] safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.isProfile && pathname === `/${user?.username}`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-1 p-2",
                isActive
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-muted)]"
              )}
            >
              {item.isProfile && user ? (
                <Avatar
                  src={user.avatarUrl}
                  fallback={user.displayName || user.username}
                  size="sm"
                  className="w-6 h-6"
                />
              ) : (
                <item.icon className="w-6 h-6" />
              )}
              <span className="text-[10px]">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeMobileTab"
                  className="absolute -top-1 w-1 h-1 rounded-full bg-[var(--accent)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
