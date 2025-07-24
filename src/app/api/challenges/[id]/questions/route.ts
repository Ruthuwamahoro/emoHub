import db from "@/server/db";
import { ChallengeElements, Challenges, UserElementCompletions } from "@/server/db/schema";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { updateUserProgress } from "@/utils/userProgressUtils";
import { and, eq, sql } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const userId = await getUserIdFromSession();
        if (!userId) {
            return sendResponse(401, null, "User not authenticated");
        }

        const { id } = await params;
        
        const challenge = await db.select({
            id: Challenges.id,
            user_id: Challenges.user_id
        }).from(Challenges)
         .where(eq(Challenges.id, id))
         .limit(1);

        if (!challenge.length) {
            return sendResponse(404, null, "Challenge not found");
        }

        if (challenge[0].user_id !== userId) {
            return sendResponse(403, null, "You are not authorized to add elements to this challenge. Only the challenge creator can add elements.");
        }

        const body = await req.json();
        const insertedData = {
            ...body,
            challenge_id: id,
        };

        const [insertedElement] = await db.insert(ChallengeElements).values(insertedData).returning();

        console.log('New element added, recalculating challenge stats...');

        const totalElementsResult = await db.select({
            total: sql<number>`count(*)`.as('total'),
        }).from(ChallengeElements)
         .where(eq(ChallengeElements.challenge_id, id));

        const completedElementsResult = await db.select({
            completed: sql<number>`count(*)`.as('completed'),
        }).from(UserElementCompletions)
         .where(and(
            eq(UserElementCompletions.challenge_id, id),
            eq(UserElementCompletions.user_id, userId)
        ));

        const totalElements = totalElementsResult[0]?.total || 0;
        const completedElements = completedElementsResult[0]?.completed || 0;
        const completionPercentage = totalElements > 0 ? (completedElements / totalElements) * 100 : 0;
        const isWeekCompleted = completedElements === totalElements && totalElements > 0;

        console.log('Updated stats:', {
            total: totalElements,
            completed: completedElements,
            percentage: completionPercentage.toFixed(2),
            isCompleted: isWeekCompleted
        });

        // Update the challenge's updated_at timestamp
        await db.update(Challenges).set({
            updated_at: new Date()
        }).where(eq(Challenges.id, id));

        await updateUserProgress(userId);

        return sendResponse(200, {
            message: 'Element created successfully',
            element: insertedElement,
            challengeStats: {
                total: totalElements,
                completed: completedElements,
                percentage: completionPercentage.toFixed(2),
                isCompleted: isWeekCompleted
            }
        }, 'Element created and progress updated successfully');

    } catch (error) {
        console.error('Error in POST route:', error);
        const err = error instanceof Error ? error?.message : 'An unexpected error occurred';
        return sendResponse(500, null, err);
    }
}