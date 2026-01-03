"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowDown, Feather, BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Floating poetry fragments for background ambiance
const poetryFragments = [
  "the world is too much with us",
  "rage, rage against the dying of the light",
  "hope is the thing with feathers",
  "i carry your heart with me",
  "shall i compare thee to a summer's day",
  "the fog comes on little cat feet",
  "i wandered lonely as a cloud",
  "because i could not stop for death",
  "do not go gentle into that good night",
  "o captain! my captain!",
  "miles to go before i sleep",
  "gather ye rosebuds while ye may",
  "beauty is truth, truth beauty",
  "tyger tyger, burning bright",
  "water, water, every where",
];

// Featured poems for the showcase
const featuredPoems = [
  {
    content: `Do not go gentle into that good night,
Old age should burn and rave at close of day;
Rage, rage against the dying of the light.`,
    author: "Dylan Thomas",
    year: "1947",
  },
  {
    content: `I have measured out my life with coffee spoons;
I know the voices dying with a dying fall
Beneath the music from a farther room.`,
    author: "T.S. Eliot",
    year: "1915",
  },
  {
    content: `Two roads diverged in a wood, and I—
I took the one less traveled by,
And that has made all the difference.`,
    author: "Robert Frost",
    year: "1916",
  },
  {
    content: `Out of the night that covers me,
Black as the pit from pole to pole,
I thank whatever gods may be
For my unconquerable soul.`,
    author: "William Ernest Henley",
    year: "1875",
  },
  {
    content: `Hope is the thing with feathers
That perches in the soul,
And sings the tune without the words,
And never stops at all.`,
    author: "Emily Dickinson",
    year: "1861",
  },
  {
    content: `I wandered lonely as a cloud
That floats on high o'er vales and hills,
When all at once I saw a crowd,
A host, of golden daffodils.`,
    author: "William Wordsworth",
    year: "1807",
  },
];

// Famous opening lines
const openingLines = [
  { line: "Call me Ishmael.", source: "Moby-Dick" },
  { line: "It was the best of times, it was the worst of times.", source: "A Tale of Two Cities" },
  { line: "In the beginning was the Word.", source: "Gospel of John" },
  { line: "April is the cruellest month.", source: "The Waste Land" },
  { line: "I sing of arms and the man.", source: "The Aeneid" },
];

// Typewriter effect hook
function useTypewriter(text: string, speed = 50, delay = 0) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayText("");
    setIsComplete(false);

    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1));
          i++;
        } else {
          setIsComplete(true);
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return { displayText, isComplete };
}

// Floating text component
function FloatingFragment({ text, index }: { text: string; index: number }) {
  const duration = 20 + Math.random() * 15;
  const delay = index * 0.5;

  return (
    <motion.div
      className="absolute text-text-muted/10 font-serif italic text-sm md:text-base whitespace-nowrap pointer-events-none select-none"
      initial={{
        x: `${Math.random() * 100}vw`,
        y: `${Math.random() * 100}vh`,
        opacity: 0,
        rotate: -5 + Math.random() * 10,
      }}
      animate={{
        x: [`${Math.random() * 100}vw`, `${Math.random() * 100}vw`],
        y: [`${Math.random() * 100}vh`, `${Math.random() * 100}vh`],
        opacity: [0, 0.15, 0.15, 0],
        rotate: [-5 + Math.random() * 10, -5 + Math.random() * 10],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
      }}
    >
      {text}
    </motion.div>
  );
}

export default function WelcomePage() {
  const [currentPoem, setCurrentPoem] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  // Auto-rotate poems
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPoem((prev) => (prev + 1) % featuredPoems.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate opening lines
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((prev) => (prev + 1) % openingLines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const { displayText, isComplete } = useTypewriter(
    "Where words become worlds",
    60,
    500
  );

  return (
    <div ref={containerRef} className="min-h-screen bg-bg-primary overflow-x-hidden">
      {/* Floating poetry fragments - ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {poetryFragments.map((fragment, i) => (
          <FloatingFragment key={i} text={fragment} index={i} />
        ))}
      </div>

      {/* ============ HERO SECTION ============ */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative min-h-screen flex flex-col"
      >
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] via-transparent to-bg-primary pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent pointer-events-none" />

        {/* Decorative lines */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-border to-transparent" />

        {/* Navigation */}
        <nav className="relative z-20 flex items-center justify-between p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <motion.div
              className="relative p-2.5 rounded-xl bg-accent/10 border border-accent/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated glow on hover */}
              <motion.div
                className="absolute inset-0 rounded-xl bg-accent/20 blur-md"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                animate={{ rotate: [0, -10, 10, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Feather className="w-6 h-6 text-accent relative z-10" />
              </motion.div>
            </motion.div>
            <div className="overflow-hidden">
              <motion.span
                className="font-serif text-2xl tracking-wide text-text-primary block"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Verse
                <span className="text-accent">Craft</span>
              </motion.span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4"
          >
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-light tracking-wide">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="font-light tracking-wide">
                Begin
              </Button>
            </Link>
          </motion.div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
          {/* Epigraph */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <p className="text-text-secondary font-serif italic text-base md:text-lg tracking-wide">
              &ldquo;Poetry is when an emotion has found its thought
              <br className="hidden md:block" />
              and the thought has found words.&rdquo;
            </p>
            <p className="text-text-secondary/70 text-sm mt-3 tracking-widest uppercase">
              — Robert Frost
            </p>
          </motion.div>

          {/* Main title with typewriter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-text-primary leading-[1.1] tracking-tight">
              {displayText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                className={isComplete ? "hidden" : ""}
              >
                |
              </motion.span>
            </h1>

            {/* Decorative flourish under title */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isComplete ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
            />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isComplete ? 1 : 0, y: isComplete ? 0 : 20 }}
            transition={{ duration: 0.8 }}
            className="mt-8 text-xl md:text-2xl text-text-primary/80 max-w-xl font-light leading-relaxed"
          >
            Discover timeless verses from the world&apos;s greatest poets.
            <br />
            One swipe at a time.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isComplete ? 1 : 0, y: isComplete ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-10"
          >
            <Link href="/signup">
              <Button size="lg" className="gap-3 text-base px-10 py-6 font-light tracking-wide group">
                Enter the Library
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Rotating opening lines */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isComplete ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 h-16"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentLine}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <p className="font-serif italic text-text-primary/70 text-xl">
                  &ldquo;{openingLines[currentLine].line}&rdquo;
                </p>
                <p className="text-text-secondary text-sm mt-2 tracking-widest uppercase">
                  {openingLines[currentLine].source}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-text-secondary text-sm tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ArrowDown className="w-5 h-5 text-text-secondary" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ============ POETRY SHOWCASE ============ */}
      <section className="relative py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-secondary/50 to-bg-primary pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4">The Collection</p>
            <h2 className="text-4xl md:text-5xl font-serif text-text-primary mb-6">
              Centuries of wisdom,
              <br />
              <span className="text-text-secondary">one verse at a time</span>
            </h2>
          </motion.div>

          {/* Poem card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Decorative frame */}
            <div className="absolute -inset-4 border border-border/30 rounded-3xl" />
            <div className="absolute -inset-8 border border-border/10 rounded-[2rem]" />

            <div className="relative bg-bg-secondary/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-border/50">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPoem}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                  className="min-h-[200px] flex flex-col justify-center"
                >
                  {/* Opening quotation mark */}
                  <div className="absolute top-4 left-6 text-6xl text-accent/20 font-serif leading-none">
                    &ldquo;
                  </div>

                  <p className="font-serif text-xl md:text-2xl text-text-primary leading-relaxed whitespace-pre-line text-center">
                    {featuredPoems[currentPoem].content}
                  </p>

                  <div className="mt-8 pt-6 border-t border-border/30 text-center">
                    <p className="text-text-primary font-medium tracking-wide text-lg">
                      {featuredPoems[currentPoem].author}
                    </p>
                    <p className="text-text-secondary text-base mt-1">
                      {featuredPoems[currentPoem].year}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation dots */}
              <div className="flex justify-center gap-2 mt-8">
                {featuredPoems.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPoem(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === currentPoem
                        ? "bg-accent w-6"
                        : "bg-border hover:bg-text-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ EXPERIENCE SECTION ============ */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4">The Experience</p>
            <h2 className="text-4xl md:text-5xl font-serif text-text-primary">
              Poetry, reimagined
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                icon: BookOpen,
                title: "Curated Verses",
                description: "From Shakespeare to Rumi, Dickinson to Neruda. Thousands of poems from literature's greatest voices, carefully curated for your discovery.",
                poem: "To see a World in a Grain of Sand",
              },
              {
                icon: Sparkles,
                title: "Immersive Reading",
                description: "Each poem presented in its full glory. Adjust themes, typography, and ambiance. Add lofi beats or rain sounds. Create your perfect reading sanctuary.",
                poem: "And Heaven in a Wild Flower",
              },
              {
                icon: Feather,
                title: "Your Voice",
                description: "Share your own poetry with the world. Build a following. Connect with fellow poets and readers who appreciate the art of words.",
                poem: "Hold Infinity in the palm of your hand",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                className="group relative"
              >
                {/* Hover glow effect */}
                <div className="absolute -inset-4 bg-accent/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                <div className="relative p-8 rounded-2xl bg-bg-secondary/50 border border-border/30 hover:border-border/60 transition-colors duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-7 h-7 text-accent" />
                  </div>

                  <h3 className="text-2xl font-serif text-text-primary mb-4">
                    {feature.title}
                  </h3>

                  <p className="text-text-primary/70 text-base leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  <p className="text-text-secondary font-serif italic text-base">
                    &ldquo;{feature.poem}&rdquo;
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ QUOTE SECTION ============ */}
      <section className="relative py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.02] to-transparent pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="relative inline-block">
            <div className="absolute -top-8 -left-8 text-8xl text-accent/10 font-serif">&ldquo;</div>
            <p className="text-3xl md:text-5xl font-serif text-text-primary leading-relaxed">
              The poetry of earth is never dead.
            </p>
            <div className="absolute -bottom-4 -right-8 text-8xl text-accent/10 font-serif">&rdquo;</div>
          </div>

          <div className="mt-8">
            <p className="text-text-secondary tracking-wide">John Keats</p>
            <p className="text-text-muted text-sm mt-1 italic">On the Grasshopper and Cricket, 1816</p>
          </div>
        </motion.div>
      </section>

      {/* ============ POETS SECTION ============ */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4">The Voices</p>
            <h2 className="text-4xl md:text-5xl font-serif text-text-primary mb-4">
              Masters of verse
            </h2>
            <p className="text-text-primary/70 text-lg max-w-xl mx-auto font-light">
              Explore works from poetry&apos;s most celebrated voices across centuries and cultures
            </p>
          </motion.div>

          {/* Poet names floating */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex flex-wrap justify-center gap-4 md:gap-6"
          >
            {[
              "William Shakespeare", "Emily Dickinson", "Pablo Neruda", "Rumi",
              "Walt Whitman", "Sylvia Plath", "Robert Frost", "Maya Angelou",
              "T.S. Eliot", "William Wordsworth", "Edgar Allan Poe", "Langston Hughes",
              "William Blake", "John Keats", "Percy Shelley", "Lord Byron"
            ].map((poet, i) => (
              <motion.span
                key={poet}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="px-4 py-2 rounded-full bg-bg-secondary/50 border border-border/30 text-text-secondary font-serif text-sm hover:border-accent/30 hover:text-text-primary transition-colors cursor-default"
              >
                {poet}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="relative py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-t from-accent/5 via-transparent to-transparent pointer-events-none" />

        {/* Decorative line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-border to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="font-serif italic text-text-secondary text-lg mb-6">
            &ldquo;In the middle of difficulty lies opportunity.&rdquo;
            <span className="block text-sm mt-2 not-italic tracking-widest uppercase">— Albert Einstein</span>
          </p>

          <h2 className="text-4xl md:text-5xl font-serif text-text-primary mb-6 leading-tight">
            Begin your
            <br />
            <span className="text-accent">poetic journey</span>
          </h2>

          <p className="text-text-primary/70 text-lg font-light mb-10 max-w-md mx-auto">
            Free forever. No advertisements.
            <br />
            Just you and the beauty of words.
          </p>

          <Link href="/signup">
            <Button size="lg" className="gap-3 text-base px-12 py-6 font-light tracking-wide group">
              Create Your Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <p className="mt-6 text-text-secondary text-base">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="relative py-16 px-6 border-t border-border/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="p-2 rounded-xl bg-accent/10 border border-accent/20"
                whileHover={{ rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Feather className="w-4 h-4 text-accent" />
              </motion.div>
              <span className="font-serif text-lg text-text-primary">
                Verse<span className="text-accent">Craft</span>
              </span>
            </motion.div>

            <p className="font-serif italic text-text-secondary text-center text-base">
              &ldquo;A thing of beauty is a joy forever.&rdquo;
              <span className="block text-sm mt-1 not-italic">— John Keats</span>
            </p>

            <p className="text-text-secondary text-base">
              Made with love for poetry
            </p>
          </div>

          {/* Bottom decorative element */}
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-4 text-text-muted/30">
              <div className="w-8 h-px bg-current" />
              <Feather className="w-4 h-4" />
              <div className="w-8 h-px bg-current" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
