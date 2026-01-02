import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, follows } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { eq, and } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current user
    const [currentUser] = await db
      .select()
      .from(users)
      .where(eq(users.authId, authUser.id))
      .limit(1);

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get target user
    const [targetUser] = await db
      .select()
      .from(users)
      .where(eq(users.username, username.toLowerCase()))
      .limit(1);

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Can't follow yourself
    if (currentUser.id === targetUser.id) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      );
    }

    // Check if already following
    const [existingFollow] = await db
      .select()
      .from(follows)
      .where(
        and(
          eq(follows.followerId, currentUser.id),
          eq(follows.followingId, targetUser.id)
        )
      )
      .limit(1);

    if (existingFollow) {
      // Unfollow
      await db
        .delete(follows)
        .where(
          and(
            eq(follows.followerId, currentUser.id),
            eq(follows.followingId, targetUser.id)
          )
        );

      return NextResponse.json({ following: false });
    } else {
      // Follow
      await db.insert(follows).values({
        followerId: currentUser.id,
        followingId: targetUser.id,
      });

      return NextResponse.json({ following: true });
    }
  } catch (error) {
    console.error("Follow error:", error);
    return NextResponse.json(
      { error: "Failed to follow user" },
      { status: 500 }
    );
  }
}
