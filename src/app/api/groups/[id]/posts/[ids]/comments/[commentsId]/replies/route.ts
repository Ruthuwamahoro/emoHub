import { NextRequest, NextResponse } from 'next/server';
import { and, count, desc, eq } from 'drizzle-orm';
import { getUserIdFromSession } from '@/utils/getUserIdFromSession';
import { Comment, Post, CommentReplies, User } from '@/server/db/schema';
import db from '@/server/db';

type ReplyInsert = {
  comment_id: string;
  user_id: string;
  commentReplies: string;
};

export async function POST(
  req: NextRequest,
  segmentedData: { params: Promise<{id: string; ids: string;commentsId: string}>}
) {
  try {
    const params = await segmentedData.params;

    const { id ,ids, commentsId } = params;

    
    if (!id || !ids || !commentsId) {
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

    const post = await db
      .select()
      .from(Post)
      .where(eq(Post.id, ids));

    console.log("kiiididididididi", post)

    if (post.length === 0) {
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

export async function GET(
  req: NextRequest,
  segmentedData: { params: Promise<{id: string; ids: string; commentsId: string}> }
) {
  try {
    const params = await segmentedData.params;
    const { id, ids, commentsId } = params;
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    if (!id || !ids || !commentsId) {
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

    const post = await db
      .select()
      .from(Post)
      .where(eq(Post.id, ids))
      .limit(1);

    if (post.length === 0) {
      return NextResponse.json(
        {
          status: 404,
          message: `Post not found with id: ${ids}`,
          data: null
        },
        { status: 404 }
      );
    }

    const comment = await db
      .select()
      .from(Comment)
      .where(and(eq(Comment.id, commentsId), eq(Comment.postId, ids)))
      .limit(1);

    if (comment.length === 0) {
      return NextResponse.json(
        {
          status: 404,
          message: `Comment not found with id: ${commentsId} for post: ${ids}`,
          data: null
        },
        { status: 404 }
      );
    }

    const totalCountResult = await db
      .select({ count: count() })
      .from(CommentReplies)
      .where(eq(CommentReplies.comment_id, commentsId));

    const totalCount = totalCountResult[0]?.count || 0;

    const replies = await db
      .select({
        id: CommentReplies.id,
        comment_id: CommentReplies.comment_id,
        user_id: CommentReplies.user_id,
        commentReplies: CommentReplies.commentReplies,
        createdAt: CommentReplies.createdAt,
        updatedAt: CommentReplies.updatedAt,
        author: {
          id: User.id,
          name: User.fullName,
          username: User.username,
          image: User.profilePicUrl,
          gender: User.gender,
        }
      })
      .from(CommentReplies)
      .leftJoin(User, eq(CommentReplies.user_id, User.id))
      .where(eq(CommentReplies.comment_id, commentsId))
      .orderBy(desc(CommentReplies.createdAt))
      .limit(limit)
      .offset(offset);

    const hasMore = offset + replies.length < totalCount;

    return NextResponse.json({
      status: 200,
      message: "Replies fetched successfully",
      data: {
        replies: replies.map(reply => ({
          ...reply,
          author: reply.author
            ? {
                ...reply.author,
                name: reply.author.name || 'Anonymous User'
              }
            : {
                id: null,
                name: 'Anonymous User',
                username: null,
                image: null,
                gender: null
              },
          likes: 0, 
          likesCount: 0,
          isLiked: false
        })),
        totalCount,
        hasMore,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    const errorMessage = error instanceof Error
      ? `Error fetching replies: ${error.message}`
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