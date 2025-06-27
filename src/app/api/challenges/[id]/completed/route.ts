import db from "@/server/db";
import { ChallengeElements, Challenges } from "@/server/db/schema";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { updateUserProgress } from "@/utils/userProgressUtils"; 
import { and, eq, sql } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const userId = await getUserIdFromSession();

        if (!userId) {
            return sendResponse(401, null, "User not authenticated");
        }

        const { elementId, completed } = await req.json();
        const { id } = await params;
        const challengeId = id;


        const updateResult = await db.update(ChallengeElements).set({
            is_completed: completed,
            completed_at: completed ? new Date() : null,
            completed_by: completed ? userId : null,
            updated_at: new Date()
        }).where(
            and(
                eq(ChallengeElements.id, elementId),
                eq(ChallengeElements.challenge_id, challengeId)
            )
        );

        const allElementsDebug = await db.select()
            .from(ChallengeElements)
            .where(eq(ChallengeElements.challenge_id, challengeId));
        

        const elementsStats = await db.select({
            total: sql<number>`count(*)`.as('total'),
            completed: sql<number>`count(case when ${ChallengeElements.is_completed} = true then 1 end)`.as('completed'),
        }).from(ChallengeElements)
            .where(eq(ChallengeElements.challenge_id, challengeId));


        const stats = elementsStats[0] || { total: 0, completed: 0 };

        const completionPercentage = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
        const isWeekCompleted = stats.completed === stats.total && stats.total > 0;

        const challengeUpdateResult = await db.update(Challenges).set({
            total_elements: stats.total,
            completed_elements: stats.completed,
            completed_percentage: completionPercentage.toFixed(2),
            is_week_completed: isWeekCompleted,
            updated_at: new Date()
        }).where(eq(Challenges.id, challengeId));


        const updatedChallenge = await db.select()
            .from(Challenges)
            .where(eq(Challenges.id, challengeId))
            .limit(1);
        

        await updateUserProgress(userId);

        const responseData = {
            elementId,
            completed,
            challengeStats: {
                total: stats.total,
                completed: stats.completed,
                percentage: completionPercentage,
                isCompleted: isWeekCompleted
            }
        };


        return sendResponse(200, responseData, 'Challenge element updated successfully');

    } catch (error) {
        const err = error instanceof Error ? error?.message : 'An unexpected error occurred';
        return sendResponse(500, null, err);
    }
}