"use client";

import { useEffect, useState, use } from "react";
import { motion } from "framer-motion";
import { Settings, Grid, Bookmark } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PostsGrid } from "@/components/post/posts-grid";
import { PostModal } from "@/components/post/post-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProfileData {
  id: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing: boolean;
}

interface PostData {
  id: string;
  content: string;
  author: string | null;
  source: string | null;
  type: "poetry" | "prose" | "quote";
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  user?: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  } | null;
}

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostData | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isOwnProfile = user?.username === username;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/users/${username}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data.user);
          setPosts(data.posts);
          setFollowing(data.user.isFollowing);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleFollow = async () => {
    if (!user) return;

    setFollowLoading(true);
    try {
      const res = await fetch(`/api/users/${username}/follow`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setFollowing(data.following);
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                followersCount: data.following
                  ? prev.followersCount + 1
                  : prev.followersCount - 1,
              }
            : null
        );
      }
    } catch (error) {
      console.error("Error following:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: data.liked,
                likesCount: data.liked
                  ? post.likesCount + 1
                  : post.likesCount - 1,
              }
            : post
        )
      );
    }
  };

  const handleSave = async (postId: string) => {
    const res = await fetch(`/api/posts/${postId}/save`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, isSaved: data.saved } : post
        )
      );
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-start gap-6">
          <Skeleton className="w-20 h-20 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full max-w-xs" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8 text-center">
        <p className="text-[var(--text-secondary)]">User not found</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="divide-y divide-[var(--border)]"
    >
      {/* Profile Header */}
      <div className="p-6">
        <div className="flex items-start gap-6">
          <Avatar
            src={profile.avatarUrl}
            fallback={profile.displayName || profile.username}
            size="xl"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold">
                  {profile.displayName || profile.username}
                </h1>
                <p className="text-[var(--text-muted)]">@{profile.username}</p>
              </div>
              {isOwnProfile ? (
                <Link href="/settings">
                  <Button variant="secondary" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
              ) : user ? (
                <Button
                  variant={following ? "secondary" : "primary"}
                  size="sm"
                  onClick={handleFollow}
                  loading={followLoading}
                >
                  {following ? "Following" : "Follow"}
                </Button>
              ) : null}
            </div>

            {profile.bio && (
              <p className="mt-3 text-[var(--text-secondary)]">{profile.bio}</p>
            )}

            <div className="flex gap-6 mt-4">
              <div>
                <span className="font-semibold">
                  {formatNumber(profile.postsCount)}
                </span>{" "}
                <span className="text-[var(--text-muted)]">posts</span>
              </div>
              <div>
                <span className="font-semibold">
                  {formatNumber(profile.followersCount)}
                </span>{" "}
                <span className="text-[var(--text-muted)]">followers</span>
              </div>
              <div>
                <span className="font-semibold">
                  {formatNumber(profile.followingCount)}
                </span>{" "}
                <span className="text-[var(--text-muted)]">following</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      {isOwnProfile && (
        <div className="flex border-b border-[var(--border)]">
          <button
            onClick={() => setActiveTab("posts")}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors relative",
              activeTab === "posts"
                ? "text-[var(--text-primary)]"
                : "text-[var(--text-muted)]"
            )}
          >
            <Grid className="w-4 h-4 mx-auto" />
            {activeTab === "posts" && (
              <motion.div
                layoutId="profileTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors relative",
              activeTab === "saved"
                ? "text-[var(--text-primary)]"
                : "text-[var(--text-muted)]"
            )}
          >
            <Bookmark className="w-4 h-4 mx-auto" />
            {activeTab === "saved" && (
              <motion.div
                layoutId="profileTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]"
              />
            )}
          </button>
        </div>
      )}

      {/* Posts Grid */}
      <PostsGrid
        posts={posts}
        onPostClick={(post) => setSelectedPost(post as PostData)}
      />

      {/* Post Modal */}
      <PostModal
        post={selectedPost}
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        isAuthenticated={!!user}
        onAuthRequired={() => setShowAuthModal(true)}
        onUpdate={(postId, updates) => {
          setPosts((prev) =>
            prev.map((p) => (p.id === postId ? { ...p, ...updates } : p))
          );
        }}
      />

      {/* Auth Modal */}
      <Modal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Sign in to continue"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            Sign in to like, save, and share your favorite literature.
          </p>
          <div className="space-y-2">
            <Link
              href="/login"
              className="block w-full py-2 px-4 text-center rounded-lg bg-accent text-bg-primary font-medium hover:bg-accent-hover transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="block w-full py-2 px-4 text-center rounded-lg bg-bg-tertiary text-text-primary font-medium hover:bg-border transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
