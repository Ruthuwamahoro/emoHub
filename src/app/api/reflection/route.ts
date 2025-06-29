import db from "@/server/db";
import { DailyReflections, DailyReflectionsResponse, User } from "@/server/db/schema";
import { checkIfUserIsAdmin, checkIfUserIsSpecialists, checkIfUserIsSuperAdmin, getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { eq, lt, gte, and } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function POST (req: NextRequest){
    const [isAdmin, isSpecialists, isSuperAdmin] = await Promise.all([
        checkIfUserIsAdmin(),
        checkIfUserIsSpecialists(),
        checkIfUserIsSuperAdmin()
      ]);
  
      const isAuthorized = isAdmin || isSpecialists || isSuperAdmin;
      const userId = await getUserIdFromSession();
  
      if (!isAuthorized || !userId) {
        return sendResponse(401, null, "Unauthorized");
      }
      try {
        const body = await req.json();
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        const existingReflection = await db
            .select()
            .from(DailyReflections)
            .where(
                and(
                    eq(DailyReflections.userId, userId),
                    gte(DailyReflections.createdAt, startOfDay),
                    lt(DailyReflections.createdAt, endOfDay)
                )
            )
            .limit(1);

        if (existingReflection.length > 0) {
            return sendResponse(409, null, "New Reflection Already Posted. Only one reflection per day is allowed.");
        }

        const insertData = {
            ...body,
            userId,
            updatedAt: new Date()
        };

        const [newReflection] = await db
            .insert(DailyReflections)
            .values(insertData)
            .returning();

        return sendResponse(201, newReflection, 'Daily reflection created successfully');
      } catch (error) {
        return sendResponse(500, null, error instanceof Error ? error.message : 'An unexpected error occurred');
      }
  
}

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return sendResponse(401, null, "Unauthorized");
  }

  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const dailyReflections = await db.select({
      id: DailyReflections.id,
      question: DailyReflections.reflectionQuestion,
      author: {
        userName: User.username,
        profilePicUrl: User.profilePicUrl,
      },
      createdAt: DailyReflections.createdAt,
      updatedAt: DailyReflections.updatedAt,
    }).from(DailyReflections)
      .innerJoin(User, eq(DailyReflections.userId, User.id))
      .where(
        and(
          gte(DailyReflections.createdAt, startOfDay),
          lt(DailyReflections.createdAt, endOfDay)
        )
      )
      .execute();

    return sendResponse(200, dailyReflections, 'Today\'s reflections retrieved successfully');
  } catch (error) {
    return sendResponse(500, null, error instanceof Error ? error.message : 'An unexpected error occurred');
  }
}