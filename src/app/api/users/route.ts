import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { username, displayName } = body;

    // Validate username
    if (!username || username.length < 3 || username.length > 20) {
      return NextResponse.json(
        { error: "Username must be 3-20 characters" },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { error: "Username can only contain letters, numbers, and underscores" },
        { status: 400 }
      );
    }

    // Check if username is taken
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.username, username.toLowerCase()))
      .limit(1);

    if (existingUser && existingUser.authId !== authUser.id) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.authId, authUser.id))
      .limit(1);

    if (existing) {
      // Update existing user
      const [updated] = await db
        .update(users)
        .set({
          username: username.toLowerCase(),
          displayName: displayName || null,
          updatedAt: new Date(),
        })
        .where(eq(users.authId, authUser.id))
        .returning();

      return NextResponse.json({ user: updated });
    }

    // Create new user
    const [newUser] = await db
      .insert(users)
      .values({
        authId: authUser.id,
        username: username.toLowerCase(),
        displayName: displayName || null,
        avatarUrl: authUser.user_metadata?.avatar_url || null,
      })
      .returning();

    return NextResponse.json({ user: newUser });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
