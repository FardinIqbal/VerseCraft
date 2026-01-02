import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authors } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    const authorsList = await db
      .select({
        id: authors.id,
        name: authors.name,
        slug: authors.slug,
        bio: authors.bio,
        portraitUrl: authors.portraitUrl,
        era: authors.era,
        nationality: authors.nationality,
        worksCount: authors.worksCount,
        followersCount: authors.followersCount,
      })
      .from(authors)
      .orderBy(desc(authors.worksCount))
      .limit(limit);

    return NextResponse.json({ authors: authorsList });
  } catch (error) {
    console.error("Error fetching authors:", error);
    return NextResponse.json(
      { error: "Failed to fetch authors" },
      { status: 500 }
    );
  }
}
