"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Compass, PlusSquare, User, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Avatar } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  const { user, loading } = useAuth();
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
    <header className="sticky top-0 z-40 bg-[var(--bg-primary)]/80 backdrop-blur-lg border-b border-[var(--border)]">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-[family-name:var(--font-libre-baskerville)] text-xl font-bold text-[var(--text-primary)]">
              VerseCraft
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            <ThemeToggle />
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.isProfile && pathname === `/${user?.username}`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative p-2 rounded-lg transition-colors",
                    isActive
                      ? "text-[var(--text-primary)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  )}
                >
                  {item.isProfile && user ? (
                    <Avatar
                      src={user.avatarUrl}
                      fallback={user.displayName || user.username}
                      size="sm"
                      className="w-7 h-7"
                    />
                  ) : (
                    <item.icon className="w-5 h-5" />
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[var(--bg-secondary)] rounded-lg -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
