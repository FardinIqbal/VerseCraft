"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";

interface Author {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  birthYear: number | null;
  deathYear: number | null;
  nationality: string | null;
  era: string | null;
  portraitUrl: string | null;
  worksCount: number;
  followersCount: number;
}

interface Post {
  id: string;
  content: string;
  source: string | null;
  likesCount: number;
}

export default function AuthorPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [author, setAuthor] = useState<Author | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAuthor() {
      try {
        const res = await fetch(`/api/authors/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setAuthor(data.author);
          setPosts(data.posts || []);
        }
      } catch (error) {
        console.error("Error fetching author:", error);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchAuthor();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-text-tertiary border-t-accent" />
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <p className="text-text-secondary mb-4">Author not found</p>
        <Link href="/" className="text-accent hover:underline">
          Go back
        </Link>
      </div>
    );
  }

  const lifespan = author.birthYear
    ? author.deathYear
      ? `${author.birthYear} - ${author.deathYear}`
      : `b. ${author.birthYear}`
    : null;

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-bg-primary/80 backdrop-blur-lg border-b border-border/50">
        <div className="flex items-center gap-4 px-4 py-3">
          <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-bg-tertiary">
            <ArrowLeft className="w-5 h-5 text-text-primary" />
          </Link>
          <h1 className="font-medium text-text-primary">{author.name}</h1>
        </div>
      </div>

      {/* Author info */}
      <div className="px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {/* Avatar */}
          <div className="w-24 h-24 mx-auto rounded-full bg-bg-tertiary flex items-center justify-center mb-4">
            {author.portraitUrl ? (
              <img
                src={author.portraitUrl}
                alt={author.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-3xl font-serif text-accent">
                {author.name[0]}
              </span>
            )}
          </div>

          <h2 className="text-2xl font-serif text-text-primary mb-1">
            {author.name}
          </h2>

          {lifespan && (
            <p className="text-sm text-text-muted mb-2">{lifespan}</p>
          )}

          {(author.era || author.nationality) && (
            <p className="text-sm text-text-secondary mb-4">
              {[author.era, author.nationality].filter(Boolean).join(" · ")}
            </p>
          )}

          {author.bio && (
            <p className="text-text-secondary max-w-md mx-auto mb-6 leading-relaxed">
              {author.bio}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="text-center">
              <p className="font-medium text-text-primary">{author.worksCount}</p>
              <p className="text-text-muted">works</p>
            </div>
            <div className="text-center">
              <p className="font-medium text-text-primary">{author.followersCount}</p>
              <p className="text-text-muted">followers</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Works */}
      <div className="px-6">
        <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4">
          Works
        </h3>
        <div className="space-y-4">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl bg-bg-tertiary/50 border border-border/50"
            >
              <p className="font-serif text-text-primary text-sm leading-relaxed line-clamp-4">
                {post.content}
              </p>
              {post.source && (
                <p className="text-xs text-text-muted mt-2 italic">
                  {post.source}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
