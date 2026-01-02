import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { posts, users } from "@/lib/db/schema";
import { or, ilike, desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const type = searchParams.get("type") || "posts";

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const searchTerm = `%${query}%`;

    if (type === "users") {
      const results = await db
        .select({
          id: users.id,
          username: users.username,
          displayName: users.displayName,
          avatarUrl: users.avatarUrl,
        })
        .from(users)
        .where(
          or(
            ilike(users.username, searchTerm),
            ilike(users.displayName, searchTerm)
          )
        )
        .limit(20);

      return NextResponse.json({ results });
    }

    // Search posts
    const results = await db
      .select({
        id: posts.id,
        content: posts.content,
        author: posts.author,
        source: posts.source,
        type: posts.type,
        likesCount: posts.likesCount,
        commentsCount: posts.commentsCount,
        createdAt: posts.createdAt,
        user: {
          id: users.id,
          username: users.username,
          displayName: users.displayName,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(posts)
      .leftJoin(users, eq(users.id, posts.userId))
      .where(
        or(
          ilike(posts.content, searchTerm),
          ilike(posts.author, searchTerm),
          ilike(posts.source, searchTerm)
        )
      )
      .orderBy(desc(posts.likesCount))
      .limit(20);

    const formattedResults = results.map((post) => ({
      id: post.id,
      content: post.content,
      author: post.author,
      source: post.source,
      type: post.type,
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
      createdAt: post.createdAt.toISOString(),
      isLiked: false,
      isSaved: false,
      user: post.user?.id
        ? {
            id: post.user.id,
            username: post.user.username,
            displayName: post.user.displayName,
            avatarUrl: post.user.avatarUrl,
          }
        : null,
    }));

    return NextResponse.json({ results: formattedResults });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
