import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, posts, follows } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { eq, sql, desc, and } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    // Get user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username.toLowerCase()))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get follower/following counts
    const [followerCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(follows)
      .where(eq(follows.followingId, user.id));

    const [followingCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(follows)
      .where(eq(follows.followerId, user.id));

    // Get post count
    const [postCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(posts)
      .where(eq(posts.userId, user.id));

    // Check if current user follows this user
    let isFollowing = false;
    if (authUser) {
      const [currentUser] = await db
        .select()
        .from(users)
        .where(eq(users.authId, authUser.id))
        .limit(1);

      if (currentUser) {
        const [followRecord] = await db
          .select()
          .from(follows)
          .where(
            and(
              eq(follows.followerId, currentUser.id),
              eq(follows.followingId, user.id)
            )
          )
          .limit(1);

        isFollowing = !!followRecord;
      }
    }

    // Get user's posts
    const userPosts = await db
      .select()
      .from(posts)
      .where(eq(posts.userId, user.id))
      .orderBy(desc(posts.createdAt))
      .limit(20);

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
        followersCount: Number(followerCount.count),
        followingCount: Number(followingCount.count),
        postsCount: Number(postCount.count),
        isFollowing,
      },
      posts: userPosts.map((post) => ({
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
        user: {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
        },
      })),
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Failed to get profile" },
      { status: 500 }
    );
  }
}
