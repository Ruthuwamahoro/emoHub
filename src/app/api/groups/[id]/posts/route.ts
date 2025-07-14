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
  isGenuineSeekingHelp: boolean; 
  supportCategory: "help-seeking" | "sharing-resources" | "encouragement" | "general" | "concerning";
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
      isGenuineSeekingHelp: false,
      supportCategory: "general",
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
        isGenuineSeekingHelp: false,
        supportCategory: "general",
      };
    }

    const prompt = `You are an expert content moderator for a MENTAL HEALTH AND SUPPORT COMMUNITY platform. This is a safe space where people share struggles, seek help, offer support, and share resources. Your role is to distinguish between genuine support requests and harmful content.

CONTEXT: This is a support platform where:
- People share personal struggles and ask for help (THIS IS ENCOURAGED)
- Users offer advice, resources, and encouragement
- Emotional vulnerability is NORMAL and HEALTHY
- Discussing mental health challenges is the PRIMARY PURPOSE

WHAT TO FLAG AS INAPPROPRIATE:
1. Harassment, bullying, or attacking other users
2. Spam or meaningless content
3. Content promoting self-harm or dangerous behaviors
4. Discriminatory language or hate speech
5. Trolling or mocking people's struggles
6. Excessive profanity used aggressively
7. Content that discourages seeking help

WHAT NOT TO FLAG (These are APPROPRIATE for this platform):
1. Sharing personal struggles, depression, anxiety, overwhelm
2. Asking for support, advice, or resources
3. Expressing emotional vulnerability
4. Discussing mental health challenges
5. Sharing coping strategies or resources
6. Offering encouragement to others
7. Using words like "overwhelmed," "struggling," "hard," "difficult," "isolated"

SUPPORT CONTENT CATEGORIES:
- "help-seeking": User is asking for support/advice for their struggles
- "sharing-resources": User is sharing helpful resources/advice
- "encouragement": User is offering support to others
- "general": General discussion related to mental health/support
- "concerning": Content that might indicate serious risk (suicide threats, self-harm plans)

Content to analyze:
Title: "${title}"
Content Type: ${contentType}
Text Content: "${textContent || 'N/A'}"
Link Description: "${linkDescription || 'N/A'}"

Provide a JSON response with this exact structure:
{
  "isAppropriate": boolean (false ONLY if truly harmful/inappropriate for a support platform),
  "isMeaningful": boolean (false only for spam/gibberish, not for emotional content),
  "riskLevel": "low" | "medium" | "high",
  "concerns": ["specific issues found"],
  "suggestions": ["constructive feedback"],
  "emotionalImpact": "positive" | "neutral" | "negative",
  "confidence": number between 0-1,
  "meaningfulnessScore": number between 0-1,
  "contentQuality": "spam" | "low" | "medium" | "high",
  "isGenuineSeekingHelp": boolean (true if user is genuinely asking for support),
  "supportCategory": "help-seeking" | "sharing-resources" | "encouragement" | "general" | "concerning"
}

IMPORTANT: 
- Emotional vulnerability and sharing struggles is APPROPRIATE content
- Only flag as inappropriate if content is truly harmful to the community
- "negative" emotionalImpact is OK for genuine support requests
- Focus on INTENT rather than emotional tone`;

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
        isGenuineSeekingHelp: Boolean(parsed.isGenuineSeekingHelp),
        supportCategory: ["help-seeking", "sharing-resources", "encouragement", "general", "concerning"].includes(
          parsed.supportCategory
        )
          ? parsed.supportCategory
          : "general",
      };
    }

    throw new Error("Invalid JSON response from Gemini");
  } catch (error) {
    console.error("Content moderation error:", error);
    
    // Enhanced fallback logic for support platform
    const contentToCheck = [title, textContent, linkDescription]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .trim();

    // Patterns for meaningless content (unchanged)
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

    // Updated harmful content detection (more targeted)
    const actuallyHarmfulKeywords = [
      "kys", "kill yourself", "should die", "worthless piece", "go die",
      "hate you all", "everyone sucks", "you're all idiots", "bunch of losers"
    ];

    // Signs of genuine help-seeking
    const helpSeekingIndicators = [
      "need help", "struggling with", "feeling overwhelmed", "advice",
      "support", "has anyone", "what helped", "going through",
      "dealing with", "coping with", "feel alone", "isolated"
    ];

    // Serious risk indicators
    const riskIndicators = [
      "want to die", "end it all", "no point living", "suicide",
      "hurt myself", "can't go on", "no hope left"
    ];

    const hasActuallyHarmfulContent = actuallyHarmfulKeywords.some(keyword =>
      contentToCheck.includes(keyword)
    );

    const isSeekingHelp = helpSeekingIndicators.some(indicator =>
      contentToCheck.includes(indicator)
    );

    const hasRiskIndicators = riskIndicators.some(indicator =>
      contentToCheck.includes(indicator)
    );

    return {
      isAppropriate: !hasActuallyHarmfulContent, // Only flag truly harmful content
      isMeaningful,
      riskLevel: hasRiskIndicators ? "high" : (hasActuallyHarmfulContent ? "medium" : "low"),
      concerns: [
        ...(hasActuallyHarmfulContent ? ["Potentially harmful language detected"] : []),
        ...(hasRiskIndicators ? ["Content may indicate serious risk - needs attention"] : []),
        ...(!isMeaningful ? ["Content appears to be spam or lacks meaningful substance"] : [])
      ],
      suggestions: [
        ...(hasActuallyHarmfulContent ? ["Consider using more supportive language"] : []),
        ...(hasRiskIndicators ? ["Please consider reaching out to professional help"] : []),
        ...(!isMeaningful ? ["Please provide more meaningful content"] : []),
        ...(isSeekingHelp ? ["Thank you for reaching out for support"] : [])
      ],
      emotionalImpact: hasActuallyHarmfulContent ? "negative" : (isSeekingHelp ? "neutral" : "neutral"),
      confidence: 0.7,
      meaningfulnessScore: isMeaningful ? 0.7 : 0.2,
      contentQuality: isMeaningful ? "medium" : "spam",
      isGenuineSeekingHelp: isSeekingHelp,
      supportCategory: hasRiskIndicators ? "concerning" : (isSeekingHelp ? "help-seeking" : "general"),
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
      moderationResult.riskLevel === "high" && 
      !moderationResult.isGenuineSeekingHelp &&
      moderationResult.confidence > 0.8;
    const needsUrgentReview = moderationResult.supportCategory === "concerning";


    const shouldBlock = shouldBlockForPolicy || shouldBlockForMeaning || shouldBlockForEmotionalImpact;

    if (shouldBlock || needsUrgentReview) {
      const moderatedContentId = await saveToModeratorData(
        userId,
        groupId,
        originalContent,
        moderationResult
      );

      let reason = "Content flagged for review";
      let userMessage = "Your post has been submitted for review.";

      if (needsUrgentReview) {
        reason = "Content needs urgent review";
        userMessage = "Your post has been submitted for urgent review. If you're in crisis, please contact emergency services or a crisis helpline immediately.";
      } else if (shouldBlockForMeaning) {
        reason = "Content lacks meaningful substance";
        userMessage = "Your post appears to lack meaningful content. Please ensure your posts contribute valuable information to the community.";
      } else if (shouldBlockForPolicy) {
        reason = "Content violates community guidelines";
        userMessage = "Your post violates our community guidelines and has been submitted for review.";
      } else if (shouldBlockForEmotionalImpact) {
        reason = "Content flagged for review";
        userMessage = "Your post has been submitted for review.";
      }

      return sendResponse(400, {
        moderationResult,
        moderatedContentId,
        message: reason,
        suggestions: moderationResult.suggestions,
        savedForReview: true,
        isGenuineSeekingHelp: moderationResult.isGenuineSeekingHelp,
        supportCategory: moderationResult.supportCategory
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
          anonymousName: User.anonymousName, // Add both for consistency
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
              anonymousName: User.anonymousName,
              anonymity_name: User.anonymousName, // Add both for consistency
            },
            likesCount: sql<number>`count(distinct ${CommentLikes.id})`,
            isAnonymous: Comment.isAnonymous
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
                  anonymousName: User.anonymousName,
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
                isAnonymous: comment.isAnonymous || comment.comment.isAnonymous
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
            author: {
              ...c.author,
              // Ensure both anonymousName and anonymity_name are available
              anonymousName: c.author?.anonymousName,
              anonymity_name: c.author?.anonymousName,
            },
            likesCount: Number(c.likesCount),
            likes: Number(c.likesCount),
            replies: c.replies,
            isAnonymous: c.comment.isAnonymous || c.isAnonymous
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