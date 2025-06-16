import db from "@/server/db";
import { learningResources } from "@/server/db/schema";
import { getYoutubeData } from "@/utils/getYoutubeData";
import { sendResponse } from "@/utils/Responses";
import { NextRequest } from "next/server";
import { and, asc, desc, eq, is, or, sql } from "drizzle-orm";
import { checkIfUserIsAdmin, checkIfUserIsSpecialists, checkIfUserIsSuperAdmin, getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { uploadImage } from "@/utils/cloudinary";
import { pgEnum } from "drizzle-orm/pg-core";

export const POST = async (req: NextRequest) => {
  try {
    const [isAdmin, isSpecialists, isSuperAdmin] = await Promise.all([
      checkIfUserIsAdmin(),
      checkIfUserIsSpecialists(),
      checkIfUserIsSuperAdmin()
    ])

    const isAuthorized = isAdmin || isSpecialists || isSuperAdmin;
    const userId = await getUserIdFromSession();

    if(!isAuthorized || !userId){
      return sendResponse(401, null, "Unauthorized");
    }
    const body = await req.json();
    console.log('Resource created successfully:', body);

    let coverImage = null;
    if(body.coverImage){
      coverImage = await uploadImage(body.coverImage);
    }
    const now = new Date();
    const insertData = {
      ...body,
      userId,
      coverImage,
      createdAt: now,
      updatedAt: now,
    };

    if (body.url && (body.url.includes("youtube.com") || body.url.includes("youtu.be"))) {
      const youtubeMeta = await getYoutubeData(body.url);
      if (youtubeMeta) {
        insertData.title = body.title || youtubeMeta.title;
        insertData.description = body.description || youtubeMeta.description;
        insertData.thumbnailUrl = youtubeMeta.thumbnailUrl;
        insertData.duration = body.duration || youtubeMeta.duration;
      }
    }

    await db.insert(learningResources).values(insertData).returning();
    return sendResponse(200, null, "Resource created successfully! 🎉");

  } catch (error) {
    const err = error instanceof Error ? error.message : "Internal Server Error";
    return sendResponse(500, null, err);
  }
};



// searching, paginating and filtering by category, updatedAt and difficulty level


export const resourceTypeEnum = pgEnum("resourceType", ["video", "audio", "article", "image"]);
export const emotionCategoryEnum = pgEnum("emotionCategory", [
  "self-regulation", 
  "self-awareness", 
  "motivation", 
  "empathy", 
  "social-skills", 
  "relationship-management", 
  "stress-management"
]);
export const difficultyLevelEnum = pgEnum("difficultyLevelEnum", [
  "beginner", 
  "intermediate", 
  "advanced"
]);

function sanitizeSearchQuery(query: string): string {
  return query.replace(/[^\w\s]/gi, '').trim();
}

function createSearchCondition(searchQuery: string) {
  const sanitizeQuery = sanitizeSearchQuery(searchQuery);
  if (sanitizeQuery.length < 2) {
    return undefined;
  }
  
  const searchConditions = [
    sql`LOWER(${learningResources.title}) LIKE LOWER(${`%${sanitizeQuery}%`})`,
    sql`LOWER(${learningResources.description}) LIKE LOWER(${`%${sanitizeQuery}%`})`,
    sql`LOWER(${learningResources.content}) LIKE LOWER(${`%${sanitizeQuery}%`})`,
  ];
  
  return searchConditions.length > 0 ? or(...searchConditions) : undefined;
}

function isValidEmotionCategory(category: string): boolean {
  const validCategories = [
    "self-regulation", 
    "self-awareness", 
    "motivation", 
    "empathy", 
    "social-skills", 
    "relationship-management", 
    "stress-management"
  ];
  return validCategories.includes(category);
}

function isValidDifficultyLevel(level: string): boolean {
  const validLevels = ["beginner", "intermediate", "advanced"];
  return validLevels.includes(level);
}

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = await getUserIdFromSession();
    
    const searchQuery = searchParams.get("search") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "10", 10)));
    const categoryFilter = searchParams.get("category") || "";
    const difficultyFilter = searchParams.get("difficultyLevel") || "";
    const sortBy = searchParams.get("sortBy") || "newest";
    
    const offset = (page - 1) * pageSize;
    
    const whereConditions: any[] = [];
    
    if (searchQuery.trim()) {
      const searchCondition = createSearchCondition(searchQuery);
      if (searchCondition) {
        whereConditions.push(searchCondition);
      }
    }
    
    if (categoryFilter && isValidEmotionCategory(categoryFilter)) {
      whereConditions.push(eq(learningResources.category, categoryFilter as any));
    }
    
    if (difficultyFilter && isValidDifficultyLevel(difficultyFilter)) {
      whereConditions.push(eq(learningResources.difficultyLevel, difficultyFilter as any));
    }
    
    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;
    
    const orderBy = sortBy === "oldest" 
      ? asc(learningResources.createdAt) 
      : desc(learningResources.createdAt);
    
    const totalRecordsResult = await db
      .select({
        count: sql<number>`COUNT(*)`
      })
      .from(learningResources)
      .where(whereClause);
    
    const totalResources = Number(totalRecordsResult[0]?.count) || 0;
    
    let query = db
      .select()
      .from(learningResources)
      .orderBy(orderBy)
      .limit(pageSize)
      .offset(offset);
    
    if (whereClause) {
      query = query.where(whereClause) as any;
    }
    
    const allResources = await query.execute();
    
    const totalPages = Math.ceil(totalResources / pageSize);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    return sendResponse(200, {
      data: allResources,
      pagination: {
        pageSize,
        currentPage: page,
        totalResources,
        totalPages,
        hasNextPage,
        hasPrevPage
      },
      filters: {
        search: searchQuery,
        category: categoryFilter,
        difficultyLevel: difficultyFilter,
        sortBy
      }
    }, 'Learning resources fetched successfully');
    
  } catch (error) {
    console.error('Error fetching learning resources:', error);
    const err = error instanceof Error ? error.message : 'Internal Server Error';
    return sendResponse(500, null, err);
  }
};
