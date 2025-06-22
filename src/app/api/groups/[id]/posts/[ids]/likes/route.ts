import { NextRequest, NextResponse } from "next/server";
import db from "@/server/db";
import { PostLikes } from "@/server/db/schema";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { HttpStatusCode } from "axios";
import { and, eq, count } from "drizzle-orm";
import { sendResponse } from "@/utils/Responses";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string, ids: string}> }
) {
  try {
    const { id, ids } = await params;
    
    if (!id || !ids) {
      return sendResponse(401, null, "Group id or post id is needed");
    }

    const postId = ids;
    const userId = await getUserIdFromSession();
    
    if (!userId) {
      return NextResponse.json(
        { status: 401, message: "Unauthorized", data: null },
        { status: HttpStatusCode.Unauthorized }
      );
    }

    // Check if user already liked this post
    const existingLike = await db
      .select()
      .from(PostLikes)
      .where(
        and(
          eq(PostLikes.post_id, postId as string),
          eq(PostLikes.user_id, userId as string)
        )
      );

    let liked = false;

    if (existingLike.length > 0) {
      await db
        .delete(PostLikes)
        .where(
          and(
            eq(PostLikes.post_id, postId as string),
            eq(PostLikes.user_id, userId as string)
          )
        );
      liked = false;
    } else {
      // Like the post
      await db
        .insert(PostLikes)
        .values({
          post_id: postId as string,
          user_id: userId as string
        });
      liked = true;
    }

    // Get the updated likes count
    const likesCountResult = await db
      .select({ count: count() })
      .from(PostLikes)
      .where(eq(PostLikes.post_id, postId as string));

    const likesCount = likesCountResult[0]?.count || 0;

    return NextResponse.json({
      status: 200,
      message: liked ? "Post liked successfully" : "Post unliked successfully",
      data: { 
        liked,
        likesCount
      }
    });

  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Internal server error',
        status: 500,
        data: null,
      },
      { status: 500 }
    );
  }
}