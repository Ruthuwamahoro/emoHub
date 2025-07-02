import db from "@/server/db";
import { DailyReflections,  User } from "@/server/db/schema";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { eq, desc } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return sendResponse(401, null, "Unauthorized");
  }

  try {
    const allReflections = await db.select({
      id: DailyReflections.id,
      question: DailyReflections.reflectionQuestion,
      createdAt: DailyReflections.createdAt,
      updatedAt: DailyReflections.updatedAt,
    }).from(DailyReflections)
    .where(eq(DailyReflections.userId, userId))
    .orderBy(desc(DailyReflections.createdAt));

    return sendResponse(200, allReflections, 'Today\'s reflections retrieved successfully');
  } catch (error) {
    return sendResponse(500, null, error instanceof Error ? error.message : 'An unexpected error occurred');
  }
}