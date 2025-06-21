import { NextRequest } from "next/server";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import db from "@/server/db";
import { UserEmotionSummary } from "@/server/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { generateDailySummary } from "@/services/emotions/emotionSummaryService";

// GET - Retrieve user's emotion summaries
export async function GET(req: NextRequest) {
    try {
        const userId = await getUserIdFromSession();
        if (!userId) {
            return sendResponse(401, null, "Unauthorized");
        }

        const { searchParams } = new URL(req.url);
        const date = searchParams.get('date'); // Optional: specific date
        const limit = parseInt(searchParams.get('limit') || '30');

        let query = db
            .select()
            .from(UserEmotionSummary)
            .where(eq(UserEmotionSummary.userId, userId))
            .orderBy(desc(UserEmotionSummary.summaryDate))
            .limit(limit);

        if (date) {
            query = db
                .select()
                .from(UserEmotionSummary)
                .where(
                    and(
                        eq(UserEmotionSummary.userId, userId),
                        eq(UserEmotionSummary.summaryDate, date)
                    )
                );
        }

        const summaries = await query;

        return sendResponse(200, summaries, "Summaries retrieved successfully!");
    } catch (error) {
        console.error("Error retrieving summaries:", error);
        return sendResponse(500, null, "Internal Server Error");
    }
}

// POST - Generate summary for specific date
export async function POST(req: NextRequest) {
    try {
        const userId = await getUserIdFromSession();
        if (!userId) {
            return sendResponse(401, null, "Unauthorized");
        }

        const body = await req.json();
        const targetDate = body.date || new Date().toISOString().split('T')[0];

        const success = await generateDailySummary(userId, targetDate);

        if (success) {
            return sendResponse(200, { date: targetDate }, "Summary generated successfully!");
        } else {
            return sendResponse(400, null, "No emotions found for the specified date");
        }
    } catch (error) {
        console.error("Error generating summary:", error);
        return sendResponse(500, null, "Internal Server Error");
    }
}


