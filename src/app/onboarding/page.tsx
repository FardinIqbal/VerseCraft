"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const poetryEras = [
  { id: "romantic", label: "Romantic Era", description: "Wordsworth, Keats, Shelley" },
  { id: "victorian", label: "Victorian", description: "Tennyson, Browning, Rossetti" },
  { id: "modernist", label: "Modernist", description: "Eliot, Pound, Yeats" },
  { id: "contemporary", label: "Contemporary", description: "Oliver, Rupi Kaur, Warsan Shire" },
  { id: "classical", label: "Classical", description: "Shakespeare, Milton, Donne" },
  { id: "eastern", label: "Eastern", description: "Rumi, Hafiz, Tagore" },
];

const poetryStyles = [
  { id: "love", label: "Love & Romance" },
  { id: "nature", label: "Nature & Seasons" },
  { id: "philosophy", label: "Philosophy & Wisdom" },
  { id: "grief", label: "Grief & Loss" },
  { id: "hope", label: "Hope & Inspiration" },
  { id: "dark", label: "Dark & Melancholic" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { user: dbUser, refreshUser } = useAuth();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [selectedEras, setSelectedEras] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );

  const toggleEra = (id: string) => {
    setSelectedEras((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const toggleStyle = (id: string) => {
    setSelectedStyles((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        router.push("/login");
      } else if (dbUser) {
        // Already has database record, skip onboarding
        router.push("/");
      }
    }
  }, [isLoaded, isSignedIn, dbUser, router]);

  useEffect(() => {
    const checkUsername = async () => {
      if (username.length < 3) {
        setUsernameAvailable(null);
        return;
      }

      setChecking(true);
      try {
        const res = await fetch(`/api/users/${username}`);
        setUsernameAvailable(res.status === 404);
      } catch {
        setUsernameAvailable(null);
      } finally {
        setChecking(false);
      }
    };

    const debounce = setTimeout(checkUsername, 500);
    return () => clearTimeout(debounce);
  }, [username]);

  const handleNext = () => {
    if (step === 1) {
      if (!username || username.length < 3) {
        setError("Username must be at least 3 characters");
        return;
      }
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        setError("Username can only contain letters, numbers, and underscores");
        return;
      }
      if (usernameAvailable === false) {
        setError("Username is already taken");
        return;
      }
      setError("");
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.toLowerCase(),
          displayName: displayName.trim() || null,
          preferences: {
            eras: selectedEras,
            styles: selectedStyles,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create profile");
      }

      // Refresh user in auth context before redirecting
      await refreshUser();
      router.push("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create profile";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "flex-1 h-1 rounded-full transition-colors",
                s <= step ? "bg-accent" : "bg-border"
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Username */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="text-center mb-8">
                <h1 className="font-serif text-3xl font-bold mb-2 text-text-primary">
                  Welcome to VerseCraft
                </h1>
                <p className="text-text-secondary">
                  Choose a username to get started
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    placeholder="Username"
                    maxLength={20}
                  />
                  <div className="mt-1 text-sm">
                    {checking && (
                      <span className="text-text-muted">Checking...</span>
                    )}
                    {!checking && usernameAvailable === true && (
                      <span className="text-green-500">Username available</span>
                    )}
                    {!checking && usernameAvailable === false && (
                      <span className="text-red-500">Username taken</span>
                    )}
                  </div>
                </div>

                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Display name (optional)"
                  maxLength={50}
                />

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button onClick={handleNext} className="w-full gap-2">
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Poetry Eras */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="text-center mb-8">
                <h1 className="font-serif text-3xl font-bold mb-2 text-text-primary">
                  What speaks to you?
                </h1>
                <p className="text-text-secondary">
                  Select the eras you&apos;re drawn to
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {poetryEras.map((era) => (
                  <button
                    key={era.id}
                    onClick={() => toggleEra(era.id)}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all",
                      selectedEras.includes(era.id)
                        ? "border-accent bg-accent/10"
                        : "border-border bg-bg-secondary hover:bg-bg-tertiary"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-text-primary">{era.label}</p>
                        <p className="text-xs text-text-muted mt-1">{era.description}</p>
                      </div>
                      {selectedEras.includes(era.id) && (
                        <Check className="w-4 h-4 text-accent flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep(1)} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button onClick={handleNext} className="flex-1 gap-2">
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Poetry Styles */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="text-center mb-8">
                <h1 className="font-serif text-3xl font-bold mb-2 text-text-primary">
                  Almost there!
                </h1>
                <p className="text-text-secondary">
                  What themes resonate with you?
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {poetryStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => toggleStyle(style.id)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all",
                      selectedStyles.includes(style.id)
                        ? "bg-accent text-bg-primary"
                        : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
                    )}
                  >
                    {style.label}
                    {selectedStyles.includes(style.id) && (
                      <Check className="w-3 h-3 inline ml-2" />
                    )}
                  </button>
                ))}
              </div>

              {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep(2)} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button onClick={handleSubmit} loading={loading} className="flex-1">
                  Start Exploring
                </Button>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full mt-4 text-sm text-text-muted hover:text-text-secondary transition-colors"
              >
                Skip for now
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
