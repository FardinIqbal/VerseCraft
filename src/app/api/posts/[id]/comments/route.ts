import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { posts, users, comments } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { eq, asc, isNull, sql } from "drizzle-orm";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
const purify = DOMPurify(window);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;

    // Get top-level comments with user info
    const topLevelComments = await db
      .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        parentId: comments.parentId,
        user: {
          id: users.id,
          username: users.username,
          displayName: users.displayName,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.postId, postId))
      .orderBy(asc(comments.createdAt));

    // Organize into tree structure
    const commentMap = new Map();
    const rootComments: unknown[] = [];

    topLevelComments.forEach((comment) => {
      const formatted = {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
        user: comment.user,
        replies: [],
      };
      commentMap.set(comment.id, formatted);

      if (!comment.parentId) {
        rootComments.push(formatted);
      }
    });

    // Add replies to parents
    topLevelComments.forEach((comment) => {
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(commentMap.get(comment.id));
        }
      }
    });

    return NextResponse.json({ comments: rootComments });
  } catch (error) {
    console.error("Get comments error:", error);
    return NextResponse.json(
      { error: "Failed to get comments" },
      { status: 500 }
    );
  }
}

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

    const body = await request.json();
    const { content, parentId } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Get user
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

    // Create comment
    const [newComment] = await db
      .insert(comments)
      .values({
        postId,
        userId: dbUser.id,
        content: sanitizedContent,
        parentId: parentId || null,
      })
      .returning();

    // Update comment count
    await db
      .update(posts)
      .set({ commentsCount: sql`${posts.commentsCount} + 1` })
      .where(eq(posts.id, postId));

    return NextResponse.json({
      comment: {
        id: newComment.id,
        content: newComment.content,
        createdAt: newComment.createdAt.toISOString(),
        user: {
          id: dbUser.id,
          username: dbUser.username,
          displayName: dbUser.displayName,
          avatarUrl: dbUser.avatarUrl,
        },
        replies: [],
      },
    });
  } catch (error) {
    console.error("Create comment error:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
