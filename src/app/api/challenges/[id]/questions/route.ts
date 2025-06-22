import db from "@/server/db";
import { ChallengeElements, Challenges } from "@/server/db/schema";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { updateUserProgress } from "@/utils/userProgressUtils";
import { eq, sql } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const userId = await getUserIdFromSession();
        
        if (!userId) {
            return sendResponse(401, null, "User not authenticated");
        }

        const { id } = await params;
        const body = await req.json();
        
        const insertedData = {
            ...body,
            challenge_id: id,
        };

        await db.insert(ChallengeElements).values(insertedData);

        console.log('New element added, recalculating challenge stats...');

        const elementsStats = await db.select({
            total: sql<number>`count(*)`.as('total'),
            completed: sql<number>`count(case when ${ChallengeElements.is_completed} = true then 1 end)`.as('completed'),
        }).from(ChallengeElements)
            .where(eq(ChallengeElements.challenge_id, id));

        const stats = elementsStats[0] || { total: 0, completed: 0 };

        const completionPercentage = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
        const isWeekCompleted = stats.completed === stats.total && stats.total > 0;

        console.log('Updated stats:', { 
            total: stats.total, 
            completed: stats.completed, 
            percentage: completionPercentage.toFixed(2),
            isCompleted: isWeekCompleted 
        });

        await db.update(Challenges).set({
            total_elements: stats.total,
            completed_elements: stats.completed,
            completed_percentage: completionPercentage.toFixed(2),
            is_week_completed: isWeekCompleted,
            updated_at: new Date()
        }).where(eq(Challenges.id, id));


        await updateUserProgress(userId);


        return sendResponse(200, {
            message: 'Element created successfully',
            challengeStats: {
                total: stats.total,
                completed: stats.completed,
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