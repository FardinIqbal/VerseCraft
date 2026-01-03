"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Feather, ArrowLeft, Mail, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Inspiring quotes about beginnings and creation
const poetryQuotes = [
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "Every artist was first an amateur.", author: "Ralph Waldo Emerson" },
  { text: "Begin at the beginning and go on till you come to the end.", author: "Lewis Carroll" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "What we call the beginning is often the end. And to make an end is to make a beginning.", author: "T.S. Eliot" },
];

export default function SignupPage() {
  const { signUpWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);

  // Rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % poetryQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signUpWithEmail(email, password);
      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sign up";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center"
          >
            <Mail className="w-10 h-10 text-accent" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-serif text-3xl md:text-4xl text-text-primary mb-4"
          >
            Check your email
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-text-primary/70 text-lg mb-8"
          >
            We&apos;ve sent you a confirmation link.
            <br />
            Click it to begin your poetic journey.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="/login">
              <Button variant="secondary" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to sign in
              </Button>
            </Link>
          </motion.div>

          {/* Decorative quote */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 font-serif italic text-text-secondary text-base"
          >
            &ldquo;Every new beginning comes from some other beginning&apos;s end.&rdquo;
            <span className="block text-sm mt-2 not-italic">— Seneca</span>
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Left side - decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-bg-secondary to-bg-primary" />

        {/* Decorative lines */}
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-border/50 to-transparent" />

        {/* Floating sparkles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                x: `${20 + Math.random() * 60}%`,
                y: `${20 + Math.random() * 60}%`,
                opacity: 0,
              }}
              animate={{
                y: [`${20 + Math.random() * 60}%`, `${10 + Math.random() * 60}%`],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.8,
              }}
            >
              <Sparkles className="w-4 h-4 text-accent/40" />
            </motion.div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-12">
              <motion.div
                className="p-3 rounded-2xl bg-accent/10 border border-accent/20"
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Feather className="w-8 h-8 text-accent" />
              </motion.div>
              <span className="font-serif text-3xl tracking-wide text-text-primary">
                Verse<span className="text-accent">Craft</span>
              </span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-serif text-text-primary leading-tight mb-6">
              Begin your
              <br />
              <span className="text-accent">poetic journey</span>
            </h1>

            <p className="text-text-primary/70 text-lg max-w-sm mb-12">
              Join a community of poets and literature lovers. Share your voice with the world.
            </p>

            {/* Rotating quote */}
            <div className="max-w-md">
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
            <span className="font-serif text-xl text-text-primary">
              Verse<span className="text-accent">Craft</span>
            </span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-serif text-text-primary mb-3">
              Create account
            </h2>
            <p className="text-text-primary/70 text-lg">
              Join the literary community
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailSignup} className="space-y-6">
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
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
                className="h-14 text-base bg-bg-secondary/50 border-border/50 focus:border-accent"
              />
              <p className="text-text-secondary/70 text-sm">
                Must be at least 6 characters
              </p>
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
              Create Account
            </Button>
          </form>

          {/* Terms */}
          <p className="text-center text-text-secondary/70 text-sm mt-6">
            By creating an account, you agree to our{" "}
            <span className="text-text-secondary hover:underline cursor-pointer">Terms</span>
            {" "}and{" "}
            <span className="text-text-secondary hover:underline cursor-pointer">Privacy Policy</span>
          </p>

          {/* Sign in link */}
          <p className="text-center text-text-secondary text-base mt-8">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-accent hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>

          {/* Footer quote - mobile only */}
          <div className="lg:hidden mt-16 text-center">
            <p className="font-serif italic text-text-secondary text-base">
              &ldquo;The beginning is always today.&rdquo;
            </p>
            <p className="text-text-secondary/70 text-sm mt-2">
              — Mary Shelley
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
