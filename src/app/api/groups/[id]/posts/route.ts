import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { NextRequest } from "next/server";
import {
  Post,
  User,
  Comment,
  CommentLikes,
  CommentReplies,
  PostLikes,
} from "@/server/db/schema";
import db from "@/server/db";
import cloudinary from "@/utils/cloudinary";
import { desc, eq, and, sql } from "drizzle-orm";
import { userIsGroupMember } from "@/utils/userIsGroupMember";

const validContentTypes = ["text", "image", "video", "audio", "link"];
const emotional = process.env.GEMINI_API_KEY; 
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${emotional}`;

interface ContentModerationResult {
  isAppropriate: boolean;
  riskLevel: "low" | "medium" | "high";
  concerns: string[];
  suggestions: string[];
  emotionalImpact: "positive" | "neutral" | "negative";
  confidence: number;
}

async function moderateContentWithGemini(
  title: string,
  textContent: string | null,
  contentType: string,
  linkDescription: string | null
): Promise<ContentModerationResult> {
  if (!emotional) {
    // Fallback when Gemini is not available
    return {
      isAppropriate: true,
      riskLevel: "low",
      concerns: [],
      suggestions: [],
      emotionalImpact: "neutral",
      confidence: 0.5,
    };
  }

  try {
    const contentToAnalyze = [
      title,
      textContent,
      linkDescription,
    ].filter(Boolean).join(" ");

    if (!contentToAnalyze.trim()) {
      return {
        isAppropriate: true,
        riskLevel: "low",
        concerns: [],
        suggestions: [],
        emotionalImpact: "neutral",
        confidence: 1.0,
      };
    }

    const prompt = `You are an expert content moderator focused on emotional wellness and community safety. Analyze this social media post content for:

1. Rudeness, harassment, or offensive language
2. Potential negative emotional impact on readers
3. Toxic behavior patterns
4. Harmful or triggering content

Content to analyze:
Title: "${title}"
Content Type: ${contentType}
Text Content: "${textContent || 'N/A'}"
Link Description: "${linkDescription || 'N/A'}"

Provide a JSON response with this exact structure:
{
  "isAppropriate": boolean (true if content is safe to post),
  "riskLevel": "low" | "medium" | "high",
  "concerns": ["specific issues found", "another concern"],
  "suggestions": ["how to improve the content", "alternative approaches"],
  "emotionalImpact": "positive" | "neutral" | "negative",
  "confidence": number between 0-1 (how confident you are in this assessment)
}

Consider these factors:
- Language tone and politeness
- Potential to trigger negative emotions
- Harassment or bullying indicators
- Discriminatory content
- Excessive negativity or doom-posting
- Content that might harm mental health

Be balanced - don't over-moderate normal discussions, but flag genuinely problematic content.`;

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3, // Lower temperature for more consistent results
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 400,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("No response from Gemini");
    }

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate the response structure
      return {
        isAppropriate: Boolean(parsed.isAppropriate),
        riskLevel: ["low", "medium", "high"].includes(parsed.riskLevel) 
          ? parsed.riskLevel 
          : "medium",
        concerns: Array.isArray(parsed.concerns) ? parsed.concerns : [],
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
        emotionalImpact: ["positive", "neutral", "negative"].includes(parsed.emotionalImpact)
          ? parsed.emotionalImpact
          : "neutral",
        confidence: typeof parsed.confidence === "number" 
          ? Math.max(0, Math.min(1, parsed.confidence))
          : 0.5,
      };
    }

    throw new Error("Invalid JSON response from Gemini");
  } catch (error) {
    console.error("Content moderation error:", error);
    
    // Fallback for basic keyword detection
    const contentToCheck = [title, textContent, linkDescription]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    
    const rudeKeywords = [
      "stupid", "idiot", "hate", "kill", "die", "ugly", "worthless",
      "loser", "pathetic", "disgusting", "terrible", "awful"
    ];
    
    const hasRudeContent = rudeKeywords.some(keyword => 
      contentToCheck.includes(keyword)
    );

    return {
      isAppropriate: !hasRudeContent,
      riskLevel: hasRudeContent ? "high" : "low",
      concerns: hasRudeContent ? ["Potentially offensive language detected"] : [],
      suggestions: hasRudeContent ? ["Consider using more positive language"] : [],
      emotionalImpact: hasRudeContent ? "negative" : "neutral",
      confidence: 0.6,
    };
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string}> }
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


    console.log("=== DEBUG FORM DATA ===");
    console.log("title:", title);
    console.log("contentTypeInput:", contentTypeInput);
    console.log("contentTypeInput type:", typeof contentTypeInput);
    console.log("contentTypeInput === null:", contentTypeInput === null);
    console.log("validContentTypes:", validContentTypes);
    console.log("========================");



    if (!title || title.trim() === "") {
      return sendResponse(400, null, "Title is required");
    }
    
    if (!contentTypeInput) {
      return sendResponse(400, null, "Content type is required");
    }
    
    const normalizedContentType = contentTypeInput.toString().trim().toLowerCase();
    
    if (!validContentTypes.includes(normalizedContentType)) {
      console.log("Invalid content type received:", {
        received: contentTypeInput,
        normalized: normalizedContentType,
        valid: validContentTypes
      });
      return sendResponse(400, null, `Invalid content type. Must be one of: ${validContentTypes.join(", ")}`);
    }
    
    const contentType = normalizedContentType as "text" | "image" | "video" | "audio" | "link";

    // CONTENT MODERATION CHECK

    console.log("kikiiiiiisisisisiispppppppppppp")
    const moderationResult = await moderateContentWithGemini(
      title,
      textContent,
      contentType,
      linkDescription
    );

    // Block inappropriate content
    if (!moderationResult.isAppropriate) {
      return sendResponse(400, {
        moderationResult,
        message: "Content flagged for review"
      }, "Your post contains content that may negatively impact others. Please review and modify your post.");
    }

    // Warn about medium risk content but allow it
    if (moderationResult.riskLevel === "medium") {
      console.log(`Medium risk content posted by user ${userId}:`, {
        concerns: moderationResult.concerns,
        suggestions: moderationResult.suggestions
      });
    }

    // Continue with file upload logic (unchanged)
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

    // Log successful post with moderation info
    console.log(`Post created successfully with moderation score:`, {
      postId: newPost[0].id,
      userId,
      riskLevel: moderationResult.riskLevel,
      emotionalImpact: moderationResult.emotionalImpact,
      confidence: moderationResult.confidence
    });

    return sendResponse(200, {
      post: newPost[0],
      moderationInfo: {
        riskLevel: moderationResult.riskLevel,
        emotionalImpact: moderationResult.emotionalImpact,
        suggestions: moderationResult.suggestions
      }
    }, "Post created successfully");
  } catch (error) {
    const err =
      error instanceof Error ? error.message : "Unexpected error occurred";
    return sendResponse(500, null, err);
  }
}



export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

        const postLikesResult = await db
          .select({ count: sql<number>`count(*)` })
          .from(PostLikes)
          .where(eq(PostLikes.post_id, post.id));

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
            likes: Number(c.likesCount),
            replies: c.replies,
          })),
          likes: Number(postLikesResult[0]?.count || 0),
          likesCount: Number(postLikesResult[0]?.count || 0),
          isLiked: userPostLike.length > 0,
          views: 0,
          shares: 0,
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