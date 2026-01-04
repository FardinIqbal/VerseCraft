import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { username, displayName, preferences } = body;

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

    if (existingUser && existingUser.authId !== userId) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.authId, userId))
      .limit(1);

    if (existing) {
      // Update existing user
      const [updated] = await db
        .update(users)
        .set({
          username: username.toLowerCase(),
          displayName: displayName || null,
          preferences: preferences || null,
          updatedAt: new Date(),
        })
        .where(eq(users.authId, userId))
        .returning();

      return NextResponse.json({ user: updated });
    }

    // Create new user
    const [newUser] = await db
      .insert(users)
      .values({
        authId: userId,
        username: username.toLowerCase(),
        displayName: displayName || null,
        preferences: preferences || null,
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
