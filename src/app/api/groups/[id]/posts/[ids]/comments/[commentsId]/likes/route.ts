import { NextRequest, NextResponse } from "next/server";
import db from "@/server/db";
import { CommentLikes } from "@/server/db/schema";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { HttpStatusCode } from "axios";
import { and, eq } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  segmentedData: { params: Promise<{commentsId: string}>}
) {
  try {
    const params = await segmentedData.params;
    const commentId = params.commentsId;
    const userId = await getUserIdFromSession();

    if (!userId) {
      return NextResponse.json(
        { status: 401, message: "Unauthorized", data: null },
        { status: HttpStatusCode.Unauthorized }
      );
    }
    const existingLike = await db
      .select()
      .from(CommentLikes)
      .where(
        and(
          eq(CommentLikes.comment_id, commentId as string),
          eq(CommentLikes.user_id, userId as string)
        )
      );

    if (existingLike.length > 0) {
      await db
        .delete(CommentLikes)
        .where(
          and(
            eq(CommentLikes.comment_id, commentId as string),
            eq(CommentLikes.user_id, userId as string)
          )
        );

      return NextResponse.json({
        status: 200,
        message: "Comment unliked successfully",
        data: { liked: false }
      });
    } else {

        console.log("Comment liked successfully", commentId, userId);

      await db
        .insert(CommentLikes)
        .values({
          comment_id: commentId as string,
          user_id: userId as string
        })
        .returning();
      return NextResponse.json({
        status: 200,
        message: "Comment liked successfully",
        data: { liked: true }
      });
    }
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