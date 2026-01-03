import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { posts, users, likes, saves } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const userId = searchParams.get("userId");
    const limit = 20;

    // For initial load, get random posts. For pagination, use offset
    const offset = cursor ? parseInt(cursor) : 0;

    // Get posts with user info, ordered randomly for variety
    const feedPosts = await db
      .select({
        id: posts.id,
        content: posts.content,
        author: posts.author,
        source: posts.source,
        type: posts.type,
        likesCount: posts.likesCount,
        commentsCount: posts.commentsCount,
        createdAt: posts.createdAt,
        userId: posts.userId,
        user: {
          id: users.id,
          username: users.username,
          displayName: users.displayName,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .orderBy(sql`RANDOM()`)
      .limit(limit + 1)
      .offset(offset);

    const hasMore = feedPosts.length > limit;
    const postsToReturn = hasMore ? feedPosts.slice(0, limit) : feedPosts;

    // Get like/save status for authenticated user
    let likesMap = new Map<string, boolean>();
    let savesMap = new Map<string, boolean>();

    if (userId) {
      const postIds = postsToReturn.map((p) => p.id);

      if (postIds.length > 0) {
        // Get user from auth id
        const [dbUser] = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.authId, userId))
          .limit(1);

        if (dbUser) {
          const userLikes = await db
            .select({ postId: likes.postId })
            .from(likes)
            .where(
              and(
                eq(likes.userId, dbUser.id),
                sql`${likes.postId} IN ${postIds}`
              )
            );

          const userSaves = await db
            .select({ postId: saves.postId })
            .from(saves)
            .where(
              and(
                eq(saves.userId, dbUser.id),
                sql`${saves.postId} IN ${postIds}`
              )
            );

          userLikes.forEach((l) => likesMap.set(l.postId, true));
          userSaves.forEach((s) => savesMap.set(s.postId, true));
        }
      }
    }

    const formattedPosts = postsToReturn.map((post) => ({
      id: post.id,
      content: post.content,
      author: post.author,
      source: post.source,
      type: post.type,
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
      createdAt: post.createdAt.toISOString(),
      isLiked: likesMap.get(post.id) || false,
      isSaved: savesMap.get(post.id) || false,
      user: post.user?.id
        ? {
            id: post.user.id,
            username: post.user.username,
            displayName: post.user.displayName,
            avatarUrl: post.user.avatarUrl,
          }
        : null,
    }));

    return NextResponse.json({
      posts: formattedPosts,
      nextCursor: hasMore ? String(offset + limit) : null,
      hasMore,
    });
  } catch (error) {
    console.error("Feed error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feed" },
      { status: 500 }
    );
  }
}
