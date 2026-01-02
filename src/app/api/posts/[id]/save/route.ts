import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, saves } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { eq, and } from "drizzle-orm";

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

    // Check if already saved
    const [existingSave] = await db
      .select()
      .from(saves)
      .where(and(eq(saves.userId, dbUser.id), eq(saves.postId, postId)))
      .limit(1);

    if (existingSave) {
      // Unsave
      await db
        .delete(saves)
        .where(and(eq(saves.userId, dbUser.id), eq(saves.postId, postId)));

      return NextResponse.json({ saved: false });
    } else {
      // Save
      await db.insert(saves).values({
        userId: dbUser.id,
        postId,
      });

      return NextResponse.json({ saved: true });
    }
  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json({ error: "Failed to save post" }, { status: 500 });
  }
}
