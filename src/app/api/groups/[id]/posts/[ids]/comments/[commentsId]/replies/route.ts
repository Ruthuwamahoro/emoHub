import { NextRequest, NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { getUserIdFromSession } from '@/utils/getUserIdFromSession';
import { Comment, Post, CommentReplies } from '@/server/db/schema';
import db from '@/server/db';

type ReplyInsert = {
  comment_id: string;
  user_id: string;
  commentReplies: string;
};

export async function POST(
  req: NextRequest,
  segmentedData: { params: Promise<{ids: string;commentsId: string}>}
) {
  try {
    const params = await segmentedData.params;

    const { ids, commentsId } = params;

    
    if (!ids || !commentsId) {
      return NextResponse.json(
        { 
          status: 400, 
          message: "Missing required parameters", 
          data: null 
        },
        { status: 400 }
      );
    }

    const user_id = await getUserIdFromSession();
    if (!user_id || typeof user_id !== 'string') {
      return NextResponse.json(
        { status: 401, message: "Unauthorized", data: null },
        { status: 401 }
      );
    }

    const { commentReplies } = await req.json();

    const blog = await db
      .select()
      .from(Post)
      .where(eq(Post.id, ids));

    if (!blog || blog.length === 0) {
      return NextResponse.json(
        { 
          status: 404, 
          message: `Blog not found with id: ${ids}`, 
          data: null 
        },
        { status: 404 }
      );
    }

    const comment = await db
      .select()
      .from(Comment)
      .where(and(eq(Comment.id, commentsId), eq(Comment.postId, ids)));

    if (!comment || comment.length === 0) {
      return NextResponse.json(
        { 
          status: 404, 
          message: `Comment not found with id: ${commentsId} for blog: ${ids}`, 
          data: null 
        },
        { status: 404 }
      );
    }

    if (!commentReplies || typeof commentReplies !== 'string' || commentReplies.trim().length === 0) {
      return NextResponse.json(
        { status: 400, message: "Reply commentReplies is required", data: null },
        { status: 400 }
      );
    }

    const insertValues: ReplyInsert = {
      comment_id:commentsId,
      user_id,
      commentReplies: commentReplies.trim(),
    };

    const newReply = await db
      .insert(CommentReplies)
      .values(insertValues)
      .returning();

    return NextResponse.json({
      status: 200,
      message: "Reply added successfully",
      data: newReply[0],
    });
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? `Error posting reply: ${error.message}` 
      : 'Internal server error';
    
    return NextResponse.json(
      { 
        status: 500, 
        message: errorMessage,
        data: null 
      },
      { status: 500 }
    );
  }
}