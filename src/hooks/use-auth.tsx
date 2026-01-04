"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useUser, useClerk, useAuth as useClerkAuth } from "@clerk/nextjs";

interface User {
  id: string;
  clerkId: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
}

interface AuthContextType {
  user: User | null;
  clerkUser: ReturnType<typeof useUser>["user"];
  loading: boolean;
  isSignedIn: boolean;
  signInWithGoogle: () => void;
  signInWithGithub: () => void;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { signOut: clerkSignOut, openSignIn } = useClerk();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (clerkId: string) => {
    try {
      const res = await fetch(`/api/users/me?authId=${clerkId}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (clerkUser?.id) {
      await fetchUserProfile(clerkUser.id);
    }
  }, [clerkUser, fetchUserProfile]);

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && clerkUser) {
        fetchUserProfile(clerkUser.id);
      } else {
        setUser(null);
      }
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, clerkUser, fetchUserProfile]);

  const signInWithGoogle = () => {
    openSignIn({
      forceRedirectUrl: "/",
    });
  };

  const signInWithGithub = () => {
    openSignIn({
      forceRedirectUrl: "/",
    });
  };

  const signOut = async () => {
    await clerkSignOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        clerkUser: clerkUser ?? null,
        loading: !isLoaded || loading,
        isSignedIn: isSignedIn ?? false,
        signInWithGoogle,
        signInWithGithub,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Re-export Clerk's useAuth for direct access when needed
export { useClerkAuth };
