import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authors, posts } from "@/lib/db/schema";
import { eq, desc, ilike } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const decodedName = decodeURIComponent(slug).replace(/-/g, " ");

    // First try to find by slug in authors table
    let [author] = await db
      .select()
      .from(authors)
      .where(eq(authors.slug, slug))
      .limit(1);

    // If not found by slug, try to find by name
    if (!author) {
      [author] = await db
        .select()
        .from(authors)
        .where(ilike(authors.name, decodedName))
        .limit(1);
    }

    if (author) {
      // Get author's works by authorId
      const authorPosts = await db
        .select({
          id: posts.id,
          content: posts.content,
          source: posts.source,
          likesCount: posts.likesCount,
          createdAt: posts.createdAt,
        })
        .from(posts)
        .where(eq(posts.authorId, author.id))
        .orderBy(desc(posts.likesCount))
        .limit(20);

      return NextResponse.json({
        author,
        posts: authorPosts,
      });
    }

    // Fallback: search by author string field in posts
    const authorPosts = await db
      .select({
        id: posts.id,
        content: posts.content,
        source: posts.source,
        likesCount: posts.likesCount,
        createdAt: posts.createdAt,
        author: posts.author,
      })
      .from(posts)
      .where(ilike(posts.author, decodedName))
      .orderBy(desc(posts.likesCount))
      .limit(20);

    if (authorPosts.length === 0) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    // Create a virtual author object from the posts
    const authorName = authorPosts[0].author || decodedName;
    return NextResponse.json({
      author: {
        id: slug,
        name: authorName,
        slug: slug,
        bio: null,
        birthYear: null,
        deathYear: null,
        nationality: null,
        era: null,
        portraitUrl: null,
        worksCount: authorPosts.length,
        followersCount: 0,
      },
      posts: authorPosts,
    });
  } catch (error) {
    console.error("Error fetching author:", error);
    return NextResponse.json(
      { error: "Failed to fetch author" },
      { status: 500 }
    );
  }
}
