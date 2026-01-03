"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, LogOut } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const router = useRouter();
  const { user, signOut, refreshUser } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setBio(user.bio || "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim() || null,
          bio: bio.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update profile");
      }

      await refreshUser();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update profile";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-text-secondary">Please sign in to access settings.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 max-w-lg mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href={`/${user.username}`}
          className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>

      {/* Profile Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar
              src={user.avatarUrl}
              fallback={user.displayName || user.username}
              size="xl"
            />
            <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-accent text-bg-primary hover:bg-accent-hover transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <p className="font-semibold text-text-primary">{user.username}</p>
            <p className="text-sm text-text-muted">Change profile photo</p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Display Name
            </label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your display name"
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              maxLength={150}
              rows={3}
              className={cn(
                "w-full px-4 py-3 rounded-lg resize-none",
                "bg-bg-secondary text-text-primary",
                "border border-border focus:border-accent",
                "placeholder:text-text-muted",
                "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-0"
              )}
            />
            <p className="mt-1 text-sm text-text-muted text-right">
              {bio.length}/150
            </p>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && (
            <p className="text-sm text-green-500">Profile updated successfully!</p>
          )}

          <Button onClick={handleSave} loading={loading} className="w-full">
            Save Changes
          </Button>
        </div>

        {/* Sign Out */}
        <div className="border-t border-border pt-6">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full py-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors px-3"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
