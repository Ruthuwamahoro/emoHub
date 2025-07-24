import db from "@/server/db";
import { ChallengeElements, Challenges, UserElementCompletions } from "@/server/db/schema";
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

        if (completed) {
            try {
                await db.insert(UserElementCompletions).values({
                    user_id: userId,
                    element_id: elementId,
                    challenge_id: challengeId,
                    completed_at: new Date()
                }).onConflictDoNothing();
            } catch (error) {
                console.log('Completion already exists for this user/element combination');
            }
        } else {
            await db.delete(UserElementCompletions)
                .where(
                    and(
                        eq(UserElementCompletions.user_id, userId),
                        eq(UserElementCompletions.element_id, elementId)
                    )
                );
        }

        const elementsStats = await db.select({
            total: sql<number>`count(*)`.as('total'),
            completed: sql<number>`count(${UserElementCompletions.id})`.as('completed'),
        })
        .from(ChallengeElements)
        .leftJoin(
            UserElementCompletions, 
            and(
                eq(ChallengeElements.id, UserElementCompletions.element_id),
                eq(UserElementCompletions.user_id, userId)
            )
        )
        .where(eq(ChallengeElements.challenge_id, challengeId));

        const stats = elementsStats[0] || { total: 0, completed: 0 };
        const completionPercentage = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
        const isWeekCompleted = stats.completed === stats.total && stats.total > 0;

        console.log('Updated stats for user:', { 
            userId,
            challengeId,
            total: stats.total, 
            completed: stats.completed, 
            percentage: completionPercentage,
            isCompleted: isWeekCompleted 
        });

        console.log('Updating user progress for userId:', userId);
        await updateUserProgress(userId);
        console.log('User progress updated successfully');

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
        console.error('Error in PATCH endpoint:', error);
        const err = error instanceof Error ? error?.message : 'An unexpected error occurred';
        return sendResponse(500, null, err);
    }
}