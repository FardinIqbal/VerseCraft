"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Heart, BookOpen, Users, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const featuredPoems = [
  {
    content: "Two roads diverged in a wood, and I—\nI took the one less traveled by,\nAnd that has made all the difference.",
    author: "Robert Frost",
    source: "The Road Not Taken",
  },
  {
    content: "Do I dare\nDisturb the universe?\nIn a minute there is time\nFor decisions and revisions which a minute will reverse.",
    author: "T.S. Eliot",
    source: "The Love Song of J. Alfred Prufrock",
  },
  {
    content: "I carry your heart with me (I carry it in\nmy heart) I am never without it (anywhere\nI go you go, my dear; and whatever is done\nby only me is your doing, my darling)",
    author: "E.E. Cummings",
    source: "I Carry Your Heart With Me",
  },
  {
    content: "Out of the night that covers me,\nBlack as the pit from pole to pole,\nI thank whatever gods may be\nFor my unconquerable soul.",
    author: "William Ernest Henley",
    source: "Invictus",
  },
  {
    content: "Hope is the thing with feathers\nThat perches in the soul,\nAnd sings the tune without the words,\nAnd never stops at all.",
    author: "Emily Dickinson",
    source: "Hope is the thing with feathers",
  },
];

const stats = [
  { value: "2,000+", label: "Poems" },
  { value: "100+", label: "Poets" },
  { value: "Free", label: "Forever" },
];

export default function WelcomePage() {
  const [currentPoem, setCurrentPoem] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPoem((prev) => (prev + 1) % featuredPoems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />

        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between p-4 md:p-6">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-accent" />
            <span className="font-serif text-xl font-bold text-text-primary">
              VerseCraft
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Poetry reimagined for the modern age
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-text-primary max-w-4xl leading-tight"
          >
            Discover poetry that
            <span className="text-accent"> speaks to you</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-text-secondary max-w-2xl"
          >
            Swipe through timeless verses from history&apos;s greatest poets.
            Save your favorites. Share your own. Join a community that celebrates
            the beauty of words.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row gap-4"
          >
            <Link href="/signup">
              <Button size="lg" className="gap-2 text-base px-8">
                Start Reading
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="secondary" size="lg" className="text-base px-8">
                Browse as Guest
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 flex items-center gap-8 md:gap-12"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-text-primary">
                  {stat.value}
                </p>
                <p className="text-sm text-text-muted">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 rounded-full border-2 border-text-muted flex items-start justify-center p-2"
          >
            <motion.div className="w-1.5 h-1.5 rounded-full bg-text-muted" />
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Poem Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-4">
              Experience poetry like never before
            </h2>
            <p className="text-text-secondary">
              Immerse yourself in beautiful verses, one swipe at a time
            </p>
          </motion.div>

          {/* Phone mockup with poem */}
          <div className="relative mx-auto w-full max-w-sm">
            {/* Phone frame */}
            <div className="relative bg-bg-secondary rounded-[3rem] p-3 shadow-2xl border border-border">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-bg-primary rounded-b-2xl" />

              {/* Screen */}
              <div className="relative bg-bg-primary rounded-[2.5rem] overflow-hidden aspect-[9/19]">
                <div className="absolute inset-0 flex flex-col">
                  {/* Poem content */}
                  <div className="flex-1 flex items-center justify-center p-8">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentPoem}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center"
                      >
                        <p className="font-serif text-text-primary text-sm leading-relaxed whitespace-pre-line">
                          {featuredPoems[currentPoem].content}
                        </p>
                        <div className="mt-6 pt-4 border-t border-border">
                          <p className="text-text-secondary text-xs font-medium">
                            {featuredPoems[currentPoem].author}
                          </p>
                          <p className="text-text-muted text-xs italic">
                            {featuredPoems[currentPoem].source}
                          </p>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Action buttons mockup */}
                  <div className="absolute right-4 bottom-20 flex flex-col items-center gap-4">
                    <div className="flex flex-col items-center">
                      <div className="p-2 rounded-full bg-bg-tertiary">
                        <Heart className="w-5 h-5 text-text-primary" />
                      </div>
                      <span className="text-[10px] text-text-muted mt-1">1.2k</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Poem indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {featuredPoems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPoem(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentPoem ? "bg-accent" : "bg-border"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-bg-secondary">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-4">
              Why poets love VerseCraft
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Built for poetry lovers, by poetry lovers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Curated Collection",
                description:
                  "Access thousands of poems from history's greatest poets. From Shakespeare to Rumi, Dickinson to Neruda.",
              },
              {
                icon: Heart,
                title: "Save & Share",
                description:
                  "Build your personal collection. Share verses that move you with friends and fellow poetry lovers.",
              },
              {
                icon: Users,
                title: "Community",
                description:
                  "Connect with poets worldwide. Share your own work and discover emerging voices.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-bg-primary border border-border"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-5xl md:text-6xl font-serif text-text-primary mb-8">
              &ldquo;Finally, a way to enjoy poetry without the pretension.&rdquo;
            </p>
            <p className="text-text-secondary">
              Join thousands of poetry lovers discovering new verses every day
            </p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-t from-accent/10 to-transparent">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-4">
              Ready to start your poetry journey?
            </h2>
            <p className="text-text-secondary mb-8">
              Free to use, forever. No ads, no distractions—just beautiful words.
            </p>
            <Link href="/signup">
              <Button size="lg" className="gap-2 text-base px-8">
                Create Your Free Account
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" />
            <span className="font-serif font-bold text-text-primary">VerseCraft</span>
          </div>
          <p className="text-text-muted text-sm">
            Made with love for poetry lovers everywhere
          </p>
        </div>
      </footer>
    </div>
  );
}
