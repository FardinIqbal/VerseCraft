"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Feather, ArrowLeft, Sparkles } from "lucide-react";
import { SignUp } from "@clerk/nextjs";

// Inspiring quotes about beginnings and creation
const poetryQuotes = [
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "Every artist was first an amateur.", author: "Ralph Waldo Emerson" },
  { text: "Begin at the beginning and go on till you come to the end.", author: "Lewis Carroll" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "What we call the beginning is often the end. And to make an end is to make a beginning.", author: "T.S. Eliot" },
];

export default function SignupPage() {
  const [currentQuote, setCurrentQuote] = useState(0);

  // Rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % poetryQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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

      {/* Right side - Clerk SignUp */}
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
            className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-8 group"
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

          {/* Clerk SignUp Component */}
          <SignUp
            appearance={{
              variables: {
                colorPrimary: "#e5e5e5",
                colorBackground: "#0a0a0a",
                colorInputBackground: "#171717",
                colorInputText: "#fafafa",
                colorText: "#fafafa",
                colorTextSecondary: "#a3a3a3",
                colorDanger: "#ef4444",
                borderRadius: "0.75rem",
                fontFamily: "inherit",
              },
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none p-0 gap-6",
                headerTitle: "text-3xl font-serif text-text-primary mb-2",
                headerSubtitle: "text-text-secondary text-base",
                socialButtonsBlockButton:
                  "bg-bg-secondary border border-border hover:bg-bg-tertiary hover:border-text-muted transition-all duration-200 rounded-xl py-3",
                socialButtonsBlockButtonText: "text-text-primary font-medium",
                socialButtonsProviderIcon: "w-5 h-5",
                dividerLine: "bg-border",
                dividerText: "text-text-secondary text-sm",
                formFieldLabel: "text-text-secondary text-sm font-medium",
                formFieldInput:
                  "bg-bg-secondary border border-border text-text-primary rounded-xl py-3 px-4 focus:border-text-muted focus:ring-0 transition-colors",
                formFieldInputShowPasswordButton: "text-text-secondary hover:text-text-primary",
                formButtonPrimary:
                  "bg-text-primary text-bg-primary hover:bg-text-secondary font-medium rounded-xl py-3 transition-all duration-200",
                footerAction: "mt-6",
                footerActionText: "text-text-secondary",
                footerActionLink: "text-text-primary hover:text-accent font-medium",
                identityPreviewEditButton: "text-text-primary hover:text-accent",
                identityPreviewText: "text-text-primary",
                formFieldAction: "text-text-secondary hover:text-text-primary text-sm",
                alert: "bg-bg-secondary border border-border rounded-xl",
                alertText: "text-text-secondary",
                formFieldErrorText: "text-red-400 text-sm",
                otpCodeFieldInput: "bg-bg-secondary border border-border text-text-primary rounded-lg",
              },
            }}
            routing="hash"
            forceRedirectUrl="/onboarding"
          />

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
