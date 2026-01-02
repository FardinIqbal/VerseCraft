import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { posts, users, likes } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { eq, and, sql } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.authId, authUser.id))
      .limit(1);

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if already liked
    const [existingLike] = await db
      .select()
      .from(likes)
      .where(and(eq(likes.userId, dbUser.id), eq(likes.postId, postId)))
      .limit(1);

    if (existingLike) {
      // Unlike
      await db
        .delete(likes)
        .where(and(eq(likes.userId, dbUser.id), eq(likes.postId, postId)));

      // Decrement count
      await db
        .update(posts)
        .set({ likesCount: sql`${posts.likesCount} - 1` })
        .where(eq(posts.id, postId));

      return NextResponse.json({ liked: false });
    } else {
      // Like
      await db.insert(likes).values({
        userId: dbUser.id,
        postId,
      });

      // Increment count
      await db
        .update(posts)
        .set({ likesCount: sql`${posts.likesCount} + 1` })
        .where(eq(posts.id, postId));

      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("Like error:", error);
    return NextResponse.json({ error: "Failed to like post" }, { status: 500 });
  }
}
