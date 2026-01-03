"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Feather, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Rotating poetry quotes for ambiance
const poetryQuotes = [
  { text: "I took the one less traveled by, and that has made all the difference.", author: "Robert Frost" },
  { text: "Hope is the thing with feathers that perches in the soul.", author: "Emily Dickinson" },
  { text: "To be, or not to be, that is the question.", author: "William Shakespeare" },
  { text: "I have spread my dreams under your feet; tread softly because you tread on my dreams.", author: "W.B. Yeats" },
  { text: "In the middle of the journey of our life, I found myself in a dark wood.", author: "Dante Alighieri" },
];

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentQuote, setCurrentQuote] = useState(0);

  // Rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % poetryQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmail(email, password);
      router.push("/");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Left side - decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-bg-secondary to-bg-primary" />

        {/* Decorative lines */}
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-border/50 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-12">
              <div className="p-3 rounded-2xl bg-accent/10 border border-accent/20">
                <Feather className="w-8 h-8 text-accent" />
              </div>
              <span className="font-serif text-3xl tracking-wide text-text-primary">
                VerseCraft
              </span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-serif text-text-primary leading-tight mb-6">
              Welcome back
              <br />
              <span className="text-text-secondary">to the verses</span>
            </h1>

            {/* Rotating quote */}
            <div className="mt-12 max-w-md">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuote}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative">
                    <div className="absolute -left-6 -top-4 text-5xl text-accent/20 font-serif">&ldquo;</div>
                    <p className="font-serif italic text-text-primary/80 text-xl leading-relaxed">
                      {poetryQuotes[currentQuote].text}
                    </p>
                  </div>
                  <p className="mt-4 text-text-secondary text-base">
                    — {poetryQuotes[currentQuote].author}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Quote indicators */}
            <div className="flex gap-2 mt-8">
              {poetryQuotes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQuote(i)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === currentQuote
                      ? "bg-accent w-8"
                      : "bg-border w-4 hover:bg-text-muted"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Back to welcome */}
          <Link
            href="/welcome"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-12 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-base">Back to home</span>
          </Link>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-accent/10 border border-accent/20">
              <Feather className="w-5 h-5 text-accent" />
            </div>
            <span className="font-serif text-xl text-text-primary">VerseCraft</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-serif text-text-primary mb-3">
              Sign in
            </h2>
            <p className="text-text-primary/70 text-lg">
              Continue your poetic journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-text-secondary text-sm font-medium">
                Email
              </label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 text-base bg-bg-secondary/50 border-border/50 focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-text-secondary text-sm font-medium">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-14 text-base bg-bg-secondary/50 border-border/50 focus:border-accent"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-base text-center py-2"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              className="w-full h-14 text-base font-medium tracking-wide"
              loading={loading}
            >
              Sign In
            </Button>
          </form>

          {/* Sign up link */}
          <p className="text-center text-text-secondary text-base mt-8">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-accent hover:underline font-medium"
            >
              Create one
            </Link>
          </p>

          {/* Footer quote - mobile only */}
          <div className="lg:hidden mt-16 text-center">
            <p className="font-serif italic text-text-secondary text-base">
              &ldquo;Poetry is the spontaneous overflow of powerful feelings.&rdquo;
            </p>
            <p className="text-text-secondary/70 text-sm mt-2">
              — William Wordsworth
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
