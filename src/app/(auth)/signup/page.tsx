"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Feather, ArrowLeft, Sparkles } from "lucide-react";
import { SignUp } from "@clerk/nextjs";

const poetryQuotes = [
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "Every artist was first an amateur.", author: "Ralph Waldo Emerson" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
];

export default function SignupPage() {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % poetryQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Left side - decorative (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-bg-secondary to-bg-primary" />
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
              Join a community of poets and literature lovers.
            </p>

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
          </motion.div>
        </div>
      </div>

      {/* Right side / Mobile - Clerk SignUp */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
        {/* Mobile header */}
        <div className="lg:hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />

          <nav className="relative z-10 flex items-center justify-between p-5">
            <Link
              href="/welcome"
              className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">Back</span>
            </Link>

            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-accent/10 border border-accent/20">
                <Feather className="w-4 h-4 text-accent" />
              </div>
              <span className="font-serif text-lg text-text-primary">
                Verse<span className="text-accent">Craft</span>
              </span>
            </div>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-6 py-8 lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-sm lg:max-w-md"
          >
            {/* Desktop back link */}
            <Link
              href="/welcome"
              className="hidden lg:inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-base">Back to home</span>
            </Link>

            {/* Mobile title */}
            <div className="lg:hidden text-center mb-8">
              <h1 className="font-serif text-2xl text-text-primary mb-2">Create your account</h1>
              <p className="text-text-secondary text-sm">Begin your poetic journey</p>
            </div>

            {/* Clerk SignUp */}
            <SignUp
              appearance={{
                elements: {
                  rootBox: "w-full",
                  cardBox: "!shadow-none",
                  card: "!bg-[var(--bg-primary)] !shadow-none !border !border-[var(--border)] !rounded-2xl",
                  header: "!hidden lg:!block",
                  headerTitle: "!text-2xl lg:!text-3xl !font-serif !text-[var(--text-primary)] !mb-1",
                  headerSubtitle: "!text-[var(--text-secondary)] !text-sm",
                  main: "!gap-4",
                  form: "!gap-4",
                  formFieldRow: "!gap-4",
                  socialButtonsBlockButton:
                    "!bg-[var(--bg-secondary)] !border !border-[var(--border)] hover:!bg-[var(--bg-tertiary)] hover:!border-[var(--border-hover)] !transition-all !duration-200 !rounded-xl !py-3 !text-sm",
                  socialButtonsBlockButtonText: "!text-[var(--text-primary)] !font-medium",
                  socialButtonsProviderIcon: "!w-5 !h-5",
                  dividerLine: "!bg-[var(--border)]",
                  dividerText: "!text-[var(--text-muted)] !text-xs !px-3",
                  formFieldLabel: "!text-[var(--text-secondary)] !text-sm !font-normal !mb-1",
                  formFieldHintText: "!text-[var(--text-muted)] !text-xs",
                  formFieldInput:
                    "!bg-[var(--bg-secondary)] !border !border-[var(--border)] !text-[var(--text-primary)] !rounded-xl !py-3 !px-4 !text-sm placeholder:!text-[var(--text-muted)] focus:!border-[var(--border-hover)] focus:!ring-1 focus:!ring-[var(--border-hover)] !shadow-none",
                  formButtonPrimary:
                    "!bg-[var(--accent)] !text-[var(--bg-primary)] hover:!bg-[var(--accent-hover)] !rounded-xl !py-3 !text-sm !font-medium !transition-all !shadow-none",
                  footerAction: "!mt-4",
                  footerActionText: "!text-[var(--text-muted)] !text-sm",
                  footerActionLink: "!text-[var(--text-primary)] hover:!text-[var(--accent)] !font-medium !transition-colors",
                  footer: "!bg-transparent",
                  identityPreviewEditButton: "!text-[var(--accent)] !text-sm",
                  identityPreviewText: "!text-[var(--text-primary)] !text-sm",
                  formFieldAction: "!text-[var(--text-muted)] !text-xs",
                  formFieldWarningText: "!text-[var(--like)] !text-xs",
                  formFieldSuccessText: "!text-[var(--save)] !text-xs",
                  alert: "!bg-[var(--bg-secondary)] !border !border-[var(--border)] !rounded-xl !text-sm",
                  alertText: "!text-[var(--text-secondary)]",
                  otpCodeFieldInput: "!bg-[var(--bg-secondary)] !border !border-[var(--border)] !text-[var(--text-primary)] !rounded-lg !text-lg",
                  formFieldInputShowPasswordButton: "!text-[var(--text-muted)] hover:!text-[var(--text-secondary)]",
                  internal: "!text-[var(--text-primary)]",
                  badge: "!bg-[var(--accent)] !text-[var(--bg-primary)]",
                },
              }}
              routing="hash"
              forceRedirectUrl="/onboarding"
            />
          </motion.div>
        </div>

        {/* Mobile footer quote */}
        <div className="lg:hidden pb-8 px-6">
          <div className="text-center">
            <p className="font-serif italic text-text-muted text-sm">
              &ldquo;The beginning is always today.&rdquo;
            </p>
            <p className="text-text-muted/60 text-xs mt-1">
              — Mary Shelley
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
