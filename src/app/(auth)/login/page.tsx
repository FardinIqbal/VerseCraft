"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Feather, ArrowLeft } from "lucide-react";
import { SignIn } from "@clerk/nextjs";

// Rotating poetry quotes for ambiance
const poetryQuotes = [
  { text: "I took the one less traveled by, and that has made all the difference.", author: "Robert Frost" },
  { text: "Hope is the thing with feathers that perches in the soul.", author: "Emily Dickinson" },
  { text: "To be, or not to be, that is the question.", author: "William Shakespeare" },
  { text: "I have spread my dreams under your feet; tread softly because you tread on my dreams.", author: "W.B. Yeats" },
  { text: "In the middle of the journey of our life, I found myself in a dark wood.", author: "Dante Alighieri" },
];

export default function LoginPage() {
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

      {/* Right side - Clerk SignIn */}
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
            <span className="font-serif text-xl text-text-primary">VerseCraft</span>
          </div>

          {/* Clerk SignIn Component */}
          <SignIn
            appearance={{
              variables: {
                colorPrimary: "var(--accent)",
                colorBackground: "var(--bg-primary)",
                colorInputBackground: "var(--bg-secondary)",
                colorInputText: "var(--text-primary)",
                colorText: "var(--text-primary)",
                colorTextSecondary: "var(--text-secondary)",
                colorDanger: "#ef4444",
                borderRadius: "0.75rem",
                fontFamily: "inherit",
              },
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none p-0 gap-6",
                headerTitle: "text-3xl font-serif text-[var(--text-primary)] mb-2",
                headerSubtitle: "text-[var(--text-secondary)] text-base",
                socialButtonsBlockButton:
                  "!bg-[var(--bg-secondary)] !border !border-[var(--border)] hover:!bg-[var(--bg-tertiary)] hover:!border-[var(--text-muted)] transition-all duration-200 rounded-xl py-3",
                socialButtonsBlockButtonText: "!text-[var(--text-primary)] font-medium",
                socialButtonsProviderIcon: "w-5 h-5",
                dividerLine: "!bg-[var(--border)]",
                dividerText: "!text-[var(--text-secondary)] text-sm",
                formFieldLabel: "!text-[var(--text-secondary)] text-sm font-medium",
                formFieldInput:
                  "!bg-[var(--bg-secondary)] !border !border-[var(--border)] !text-[var(--text-primary)] rounded-xl py-3 px-4 focus:!border-[var(--text-muted)] focus:ring-0 transition-colors",
                formFieldInputShowPasswordButton: "!text-[var(--text-secondary)] hover:!text-[var(--text-primary)]",
                formButtonPrimary:
                  "!bg-[var(--accent)] !text-[var(--bg-primary)] hover:!bg-[var(--accent-hover)] font-medium rounded-xl py-3 transition-all duration-200",
                footerAction: "mt-6",
                footerActionText: "!text-[var(--text-secondary)]",
                footerActionLink: "!text-[var(--text-primary)] hover:!text-[var(--accent)] font-medium",
                identityPreviewEditButton: "!text-[var(--text-primary)] hover:!text-[var(--accent)]",
                identityPreviewText: "!text-[var(--text-primary)]",
                formFieldAction: "!text-[var(--text-secondary)] hover:!text-[var(--text-primary)] text-sm",
                alert: "!bg-[var(--bg-secondary)] !border !border-[var(--border)] rounded-xl",
                alertText: "!text-[var(--text-secondary)]",
                formFieldErrorText: "!text-red-400 text-sm",
                otpCodeFieldInput: "!bg-[var(--bg-secondary)] !border !border-[var(--border)] !text-[var(--text-primary)] rounded-lg",
              },
            }}
            routing="hash"
            forceRedirectUrl="/"
          />

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
