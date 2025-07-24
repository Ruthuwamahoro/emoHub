import db from "@/server/db";
import { UserProgress } from "@/server/db/schema";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const userId = await getUserIdFromSession();
        
        if (!userId) {
            return sendResponse(401, null, "User not authenticated");
        }

        let userProgress = await db
            .select()
            .from(UserProgress)
            .where(eq(UserProgress.user_id, userId))
            .limit(1);

        if (userProgress.length === 0) {
            await db.insert(UserProgress).values({
                user_id: userId,
                total_weeks: 0,
                completed_weeks: 0,
                total_challenges: 0,
                completed_challenges: 0,
                overall_completion_percentage: "0.00",
                current_streak: 0,
                longest_streak: 0,
                last_activity_date: new Date(),
            });

            userProgress = await db
                .select()
                .from(UserProgress)
                .where(eq(UserProgress.user_id, userId))
                .limit(1);
        }

        return sendResponse(200, userProgress[0], 'User progress retrieved successfully');
        
    } catch (error) {
        const err = error instanceof Error ? error?.message : 'An unexpected error occurred';
        return sendResponse(500, null, err);
    }
}