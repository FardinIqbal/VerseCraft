import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { posts, users } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { eq } from "drizzle-orm";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
const purify = DOMPurify(window);

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
    const { content, author, source, type } = body;

    // Validate content
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    if (content.length > 5000) {
      return NextResponse.json(
        { error: "Content is too long (max 5000 characters)" },
        { status: 400 }
      );
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

    // Sanitize content
    const sanitizedContent = purify.sanitize(content.trim());
    const sanitizedAuthor = author ? purify.sanitize(author.trim()) : null;
    const sanitizedSource = source ? purify.sanitize(source.trim()) : null;

    // Create post
    const [newPost] = await db
      .insert(posts)
      .values({
        userId: dbUser.id,
        content: sanitizedContent,
        author: sanitizedAuthor,
        source: sanitizedSource,
        type: type || "poetry",
      })
      .returning();

    return NextResponse.json({
      post: {
        ...newPost,
        user: {
          id: dbUser.id,
          username: dbUser.username,
          displayName: dbUser.displayName,
          avatarUrl: dbUser.avatarUrl,
        },
        isLiked: false,
        isSaved: false,
      },
    });
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
