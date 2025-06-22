import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { NextRequest } from "next/server";
import {
  Post,
  User,
  Comment,
  CommentLikes,
  CommentReplies,
  PostLikes, // Add this import
} from "@/server/db/schema";
import db from "@/server/db";
import cloudinary from "@/utils/cloudinary";
import { desc, eq, and, sql } from "drizzle-orm";
import { userIsGroupMember } from "@/utils/userIsGroupMember";

const validContentTypes = ["text", "image", "video", "audio", "link"];

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; ids: string }> }
) {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) {
      return sendResponse(401, null, "Unauthorized");
    }
    const { id } = await params;
    const groupId = id;
    if (!groupId) {
      return sendResponse(400, null, "Group ID is required");
    }
    const isGroupMember = await userIsGroupMember(groupId);
    if (!isGroupMember) {
      return sendResponse(401, null, "Unauthorized");
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const contentTypeInput = formData.get("contentType") as string;
    const textContent = formData.get("textContent") as string | null;
    const mediaAlt = formData.get("mediaAlt") as string | null;
    const linkUrl = formData.get("linkUrl") as string | null;
    const linkDescription = formData.get("linkDescription") as string | null;

    if (!contentTypeInput || !validContentTypes.includes(contentTypeInput)) {
      return sendResponse(400, null, "Invalid content type");
    }

    const contentType = contentTypeInput as
      | "text"
      | "image"
      | "video"
      | "audio"
      | "link";

    let mediaUrl = null;
    if (["image", "video", "audio"].includes(contentType)) {
      const mediaFile = formData.get("media") as File;
      if (!mediaFile) {
        return sendResponse(400, null, `${contentType} file is required`);
      }

      const bytes = await mediaFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const resourceType =
        contentType === "image"
          ? "image"
          : contentType === "video"
          ? "video"
          : "auto";

      const uploadResult = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: resourceType,
            folder: `posts/${contentType}s`,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        const { Readable } = require("stream");
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);
        stream.pipe(uploadStream);
      });

      mediaUrl = uploadResult.secure_url;
    }

    let linkPreviewImage = null;
    if (contentType === "link") {
      const previewImageFile = formData.get("linkPreviewImage") as File;
      if (previewImageFile) {
        const bytes = await previewImageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: "image",
              folder: "posts/link-previews",
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );

          const { Readable } = require("stream");
          const stream = new Readable();
          stream.push(buffer);
          stream.push(null);
          stream.pipe(uploadStream);
        });

        linkPreviewImage = uploadResult.secure_url;
      }
    }

    const newPost = await db
      .insert(Post)
      .values({
        userId,
        groupId,
        title,
        contentType,
        textContent,
        mediaUrl,
        mediaAlt,
        linkUrl,
        linkDescription,
        linkPreviewImage,
      })
      .returning();

    return sendResponse(200, newPost[0], "Post created successfully");
  } catch (error) {
    const err =
      error instanceof Error ? error.message : "Unexpected error occurred";
    return sendResponse(500, null, err);
  }
}

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string; ids: string }> }
) => {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) {
      return sendResponse(401, null, "Unauthorized");
    }
    const contextId = (await params).id;
    const isGroupMember = await userIsGroupMember(contextId as string);
    if (!isGroupMember) {
      return sendResponse(401, null, "Unauthorized");
    }

    const posts = await db
      .select({
        post: Post,
        author: {
          id: User.id,
          name: User.fullName,
          username: User.username,
          gender: User.gender,
          image: User.profilePicUrl,
          verified: User.isVerified,
        },
      })
      .from(Post)
      .leftJoin(User, eq(Post.userId, User.id))
      .where(eq(Post.groupId, contextId))
      .orderBy(desc(Post.createdAt));

    const postsWithDetails = await Promise.all(
      posts.map(async ({ post, author }) => {
        // Get comments with their like counts
        const comments = await db
          .select({
            comment: Comment,
            author: {
              id: User.id,
              name: User.fullName,
              username: User.username,
              gender: User.gender,
              image: User.profilePicUrl,
            },
            likesCount: sql<number>`count(distinct ${CommentLikes.id})`,
          })
          .from(Comment)
          .leftJoin(User, eq(Comment.userId, User.id))
          .leftJoin(CommentLikes, eq(CommentLikes.comment_id, Comment.id))
          .where(eq(Comment.postId, post.id))
          .groupBy(Comment.id, User.id)
          .orderBy(desc(Comment.createdAt));

        // Get comment replies
        const commentsWithReplies = await Promise.all(
          comments.map(async (comment) => {
            const replies = await db
              .select({
                reply: CommentReplies,
                author: {
                  id: User.id,
                  name: User.fullName,
                  username: User.username,
                  image: User.profilePicUrl,
                },
              })
              .from(CommentReplies)
              .leftJoin(User, eq(CommentReplies.user_id, User.id))
              .where(eq(CommentReplies.comment_id, comment.comment.id))
              .orderBy(desc(CommentReplies.createdAt));

            // Check if current user liked this comment
            const userCommentLike = await db
              .select()
              .from(CommentLikes)
              .where(
                and(
                  eq(CommentLikes.comment_id, comment.comment.id),
                  eq(CommentLikes.user_id, userId)
                )
              )
              .limit(1);

            return {
              ...comment,
              comment: {
                ...comment.comment,
                isLiked: userCommentLike.length > 0,
              },
              replies: replies.map((r) => ({
                ...r.reply,
                author: r.author,
              })),
            };
          })
        );

        // Get post likes count
        const postLikesResult = await db
          .select({ count: sql<number>`count(*)` })
          .from(PostLikes)
          .where(eq(PostLikes.post_id, post.id));

        // Check if current user liked this post
        const userPostLike = await db
          .select()
          .from(PostLikes)
          .where(
            and(
              eq(PostLikes.post_id, post.id),
              eq(PostLikes.user_id, userId)
            )
          )
          .limit(1);

        return {
          ...post,
          author,
          comments: commentsWithReplies.map((c) => ({
            ...c.comment,
            author: c.author,
            likesCount: Number(c.likesCount),
            likes: Number(c.likesCount), // Component expects both
            replies: c.replies,
          })),
          likes: Number(postLikesResult[0]?.count || 0),
          likesCount: Number(postLikesResult[0]?.count || 0), // Component expects both
          isLiked: userPostLike.length > 0,
          views: 0, // You might want to implement view tracking
          shares: 0, // You might want to implement share tracking
        };
      })
    );

    return sendResponse(200, postsWithDetails, "Posts retrieved successfully");
  } catch (error) {
    const err =
      error instanceof Error ? error.message : "Unexpected error occurred";
    return sendResponse(500, null, err);
  }
};