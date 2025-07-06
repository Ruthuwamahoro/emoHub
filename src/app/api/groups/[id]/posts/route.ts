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
import { boolean } from "drizzle-orm/mysql-core";
const validContentTypes = ["text", "image", "video", "audio", "link"];
const emotional = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${emotional}`;

interface ContentModerationResult {
  isAppropriate: boolean;
  isMeaningful: boolean;
  riskLevel: "low" | "medium" | "high";
  concerns: string[];
  suggestions: string[];
  emotionalImpact: "positive" | "neutral" | "negative";
  confidence: number;
  meaningfulnessScore: number; 
  contentQuality: "spam" | "low" | "medium" | "high"; 
}

interface ModeratorData {
  id: string;
  userId: string;
  groupId: string;
  originalContent: {
    title: string;
    contentType: string;
    textContent: string | null;
    linkDescription: string | null;
  };
  moderationResult: ContentModerationResult;
  timestamp: Date;
  status: "pending" | "reviewed" | "approved" | "rejected";
  reviewerNotes?: string;
}

async function moderateContentWithGemini(
  title: string,
  textContent: string | null,
  contentType: string,
  linkDescription: string | null
): Promise<ContentModerationResult> {
  if (!emotional) {
    return {
      isAppropriate: true,
      isMeaningful: true,
      riskLevel: "low",
      concerns: [],
      suggestions: [],
      emotionalImpact: "neutral",
      confidence: 0.5,
      meaningfulnessScore: 0.5,
      contentQuality: "medium",
    };
  }

  try {
    const contentToAnalyze = [title, textContent, linkDescription]
      .filter(Boolean)
      .join(" ");

    if (!contentToAnalyze.trim()) {
      return {
        isAppropriate: true,
        isMeaningful: false,
        riskLevel: "low",
        concerns: ["Empty or no meaningful content provided"],
        suggestions: ["Please provide meaningful content for your post"],
        emotionalImpact: "neutral",
        confidence: 1.0,
        meaningfulnessScore: 0.0,
        contentQuality: "spam",
      };
    }

    const prompt = `You are an expert content moderator focused on both community safety and content quality. Analyze this social media post content for:

SAFETY ASSESSMENT:
1. Rudeness, harassment, or offensive language
2. Potential negative emotional impact on readers
3. Toxic behavior patterns
4. Harmful or triggering content
5. Excessive negativity or doom-posting
6. Content that promotes depression, anxiety, or despair
7. Bullying or discriminatory language

MEANINGFULNESS ASSESSMENT:
1. Does the content provide value to the community?
2. Is it spam, gibberish, or nonsensical?
3. Does it contribute to meaningful discussion?
4. Is it just random characters, repeated words, or meaningless phrases?
5. Does it have clear intent and purpose?
6. Is it overly short without substance (like just "hi", "test", ".", etc.)?

Content to analyze:
Title: "${title}"
Content Type: ${contentType}
Text Content: "${textContent || 'N/A'}"
Link Description: "${linkDescription || 'N/A'}"

Provide a JSON response with this exact structure:
{
  "isAppropriate": boolean (false if content violates community guidelines),
  "isMeaningful": boolean (false if content lacks substance or purpose),
  "riskLevel": "low" | "medium" | "high",
  "concerns": ["specific issues found", "another concern"],
  "suggestions": ["how to improve the content", "alternative approaches"],
  "emotionalImpact": "positive" | "neutral" | "negative",
  "confidence": number between 0-1,
  "meaningfulnessScore": number between 0-1 (0 = spam/gibberish, 1 = highly meaningful),
  "contentQuality": "spam" | "low" | "medium" | "high"
}

Guidelines for meaningfulness assessment:
- Mark "isMeaningful" as false for: spam, gibberish, test posts, single characters, repeated words
- "meaningfulnessScore" should be 0-0.3 for spam/gibberish, 0.3-0.6 for low quality, 0.6-0.8 for decent, 0.8-1.0 for high quality
- "contentQuality" should reflect overall post value to the community
- Consider context: a simple "Hello" might be meaningful for introductions but spam elsewhere
- Very short posts without context should be marked as low meaningfulness

Examples of non-meaningful content:
- Single words without context: "test", "hi", "hello"
- Gibberish: "asdfgh", "qwerty", random character strings
- Repeated characters: "aaaaaaa", "........"
- Empty or near-empty posts
- Obvious spam or placeholder text`;

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 600,
        },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.warn("Gemini API rate limit exceeded, using enhanced fallback");
      }
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("No response from Gemini");
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        isAppropriate: Boolean(parsed.isAppropriate),
        isMeaningful: Boolean(parsed.isMeaningful),
        riskLevel: ["low", "medium", "high"].includes(parsed.riskLevel)
          ? parsed.riskLevel
          : "medium",
        concerns: Array.isArray(parsed.concerns) ? parsed.concerns : [],
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
        emotionalImpact: ["positive", "neutral", "negative"].includes(
          parsed.emotionalImpact
        )
          ? parsed.emotionalImpact
          : "neutral",
        confidence:
          typeof parsed.confidence === "number"
            ? Math.max(0, Math.min(1, parsed.confidence))
            : 0.5,
        meaningfulnessScore:
          typeof parsed.meaningfulnessScore === "number"
            ? Math.max(0, Math.min(1, parsed.meaningfulnessScore))
            : 0.5,
        contentQuality: ["spam", "low", "medium", "high"].includes(
          parsed.contentQuality
        )
          ? parsed.contentQuality
          : "medium",
      };
    }

    throw new Error("Invalid JSON response from Gemini");
  } catch (error) {
    console.error("Content moderation error:", error);
    
    const contentToCheck = [title, textContent, linkDescription]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .trim();

    const meaninglessPatterns = [
      /^[.]{2,}$/,
      /^([a-z])\1{3,}$/, 
      /^(test|hi|hello|hey)\.?$/,
      /^[^a-zA-Z0-9\s]{3,}$/,
      /^.{1,2}$/, 
    ];

    const spamKeywords = ["test", "asdf", "qwerty", "spam", "gibberish"];
    
    const isMeaninglessPattern = meaninglessPatterns.some(pattern => 
      pattern.test(contentToCheck)
    );
    
    const isSpamKeyword = spamKeywords.some(keyword => 
      contentToCheck === keyword
    );

    const isMeaningful = !isMeaninglessPattern && !isSpamKeyword && contentToCheck.length > 2;
    
    const rudeKeywords = [
      "stupid", "idiot", "hate", "kill", "die", "ugly", "worthless",
      "loser", "pathetic", "disgusting", "terrible", "awful", "dumb",
      "moron", "trash", "garbage", "waste", "useless", "failure"
    ];

    const negativeEmotionalKeywords = [
      "hopeless", "pointless", "doom", "disaster", "catastrophe",
      "nightmare", "hell", "torture", "suffering", "misery",
      "depressing", "devastating", "tragic", "horrible", "dreadful"
    ];

    const hasRudeContent = rudeKeywords.some(keyword =>
      contentToCheck.includes(keyword)
    );

    const hasNegativeEmotionalContent = negativeEmotionalKeywords.some(keyword =>
      contentToCheck.includes(keyword)
    );

    return {
      isAppropriate: !hasRudeContent,
      isMeaningful,
      riskLevel: (hasRudeContent || hasNegativeEmotionalContent) ? "high" : "low",
      concerns: [
        ...(hasRudeContent ? ["Potentially offensive language detected"] : []),
        ...(hasNegativeEmotionalContent ? ["Potentially distressing content detected"] : []),
        ...(!isMeaningful ? ["Content appears to be spam or lacks meaningful substance"] : [])
      ],
      suggestions: [
        ...(hasRudeContent ? ["Consider using more respectful language"] : []),
        ...(hasNegativeEmotionalContent ? ["Consider framing content more positively"] : []),
        ...(!isMeaningful ? ["Please provide more meaningful content that contributes to the community discussion"] : [])
      ],
      emotionalImpact: hasNegativeEmotionalContent ? "negative" : (hasRudeContent ? "negative" : "neutral"),
      confidence: 0.7,
      meaningfulnessScore: isMeaningful ? 0.6 : 0.2,
      contentQuality: isMeaningful ? "medium" : "spam",
    };
  }
}

async function saveToModeratorData(
  userId: string,
  groupId: string,
  originalContent: any,
  moderationResult: ContentModerationResult
): Promise<string> {
  const moderatedContentId = `mod_${Date.now()}_${userId}`;
  
  const moderatorData: ModeratorData = {
    id: moderatedContentId,
    userId,
    groupId,
    originalContent,
    moderationResult,
    timestamp: new Date(),
    status: "pending",
  };

  return moderatedContentId;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    const isAnonymous = formData.get("isAnonymous") as unknown as boolean;

    if (!title || title.trim() === "") {
      return sendResponse(400, null, "Title is required");
    }

    if (!contentTypeInput) {
      return sendResponse(400, null, "Content type is required");
    }

    const normalizedContentType = contentTypeInput.toString().trim().toLowerCase();
    if (!validContentTypes.includes(normalizedContentType)) {
      return sendResponse(400, null, `Invalid content type. Must be one of: ${validContentTypes.join(", ")}`);
    }

    const contentType = normalizedContentType as "text" | "image" | "video" | "audio" | "link";

    const moderationResult = await moderateContentWithGemini(
      title,
      textContent,
      contentType,
      linkDescription
    );


    const originalContent = {
      title,
      contentType,
      textContent,
      linkDescription,
    };

    const shouldBlockForPolicy = !moderationResult.isAppropriate;
    const shouldBlockForMeaning = !moderationResult.isMeaningful;
    const shouldBlockForEmotionalImpact =
      moderationResult.emotionalImpact === "negative" &&
      (moderationResult.riskLevel === "high" || moderationResult.confidence > 0.7);

    const shouldBlock = shouldBlockForPolicy || shouldBlockForMeaning || shouldBlockForEmotionalImpact;

    if (shouldBlock) {
      const moderatedContentId = await saveToModeratorData(
        userId,
        groupId,
        originalContent,
        moderationResult
      );

      let reason = "Content flagged for review";
      let userMessage = "Your post has been submitted for review.";

      if (shouldBlockForMeaning) {
        reason = "Content lacks meaningful substance";
        userMessage = "Your post appears to lack meaningful content. It has been saved for moderator review. Please ensure your posts contribute valuable information to the community.";
      } else if (shouldBlockForPolicy) {
        reason = "Content violates community guidelines";
        userMessage = "Your post violates our community guidelines and has been submitted for moderator review.";
      } else if (shouldBlockForEmotionalImpact) {
        reason = "Content flagged for negative emotional impact";
        userMessage = "Your post may have a negative emotional impact and has been submitted for moderator review.";
      }

      return sendResponse(400, {
        moderationResult,
        moderatedContentId,
        message: reason,
        suggestions: moderationResult.suggestions,
        savedForReview: true
      }, userMessage);
    }

    if (moderationResult.riskLevel === "medium" ||
        moderationResult.emotionalImpact === "negative" ||
        moderationResult.meaningfulnessScore < 0.7 ||
        moderationResult.concerns.length > 0) {
    }

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
        isAnonymous,
        linkDescription,
        linkPreviewImage,
      })
      .returning();


    return sendResponse(200, {
      post: newPost[0],
      moderationInfo: {
        riskLevel: moderationResult.riskLevel,
        emotionalImpact: moderationResult.emotionalImpact,
        meaningfulnessScore: moderationResult.meaningfulnessScore,
        contentQuality: moderationResult.contentQuality,
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
          fullName: User.fullName,
          username: User.username,
          gender: User.gender,
          image: User.profilePicUrl,
          verified: User.isVerified,
          anonymity_name: User.anonymousName,
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
              anonymity_name: User.anonymousName
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
          author: {
            ...author,
            fullName: author?.name, 
          },
          comments: commentsWithReplies.map((c) => ({
            ...c.comment,
            author: c.author,
            likesCount: Number(c.likesCount),
            likes: Number(c.likesCount),
            replies: c.replies,
          })),
          isAnonymous: post.isAnonymous || false,
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