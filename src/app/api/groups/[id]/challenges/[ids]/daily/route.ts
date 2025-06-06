import { getUserIdFromSession } from '@/utils/getUserIdFromSession';
import { sendResponse } from '@/utils/Responses';
import { NextRequest } from 'next/server';
import db from '@/server/db';
import { Challenges, ChallengeElements, ChallengeFeedback } from '@/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export const GET = async(
  request: NextRequest,
  segmentedData: { params: Promise<{groupId: string, challengeId: string}>}
) => {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) {
      return sendResponse(401, null, "Unauthorized");
    }
    
    const params = await segmentedData.params;
    const { groupId, challengeId } = params;
    
    const challenge = await db.query.Challenges.findFirst({
      where: eq(Challenges.id, challengeId),
    });
    
    if (!challenge) {
      return sendResponse(404, null, "Challenge not found");
    }
    
    const today = new Date();
    const startDate = new Date(challenge.start_date);
    const endDate = new Date(challenge.end_date);
    
    if (today < startDate) {
      return sendResponse(200, { 
        status: "pending",
        message: "This challenge has not started yet",
        startDate: startDate
      }, "Challenge pending");
    }
    
    if (today > endDate) {
      return sendResponse(200, { 
        status: "completed",
        message: "This challenge has ended",
        endDate: endDate
      }, "Challenge completed");
    }
    
    const dayDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const todayQuestions = await db.select()
      .from(ChallengeElements)
      .where(
        and(
          eq(ChallengeElements.challenge_id, challengeId),
          eq(ChallengeElements.day_number, dayDiff)
        )
      )
      .orderBy(ChallengeElements.order);
    
    const existingFeedback = await db.select()
      .from(ChallengeFeedback)
      .where(
        and(
          eq(ChallengeFeedback.challenge_id, challengeId),
          eq(ChallengeFeedback.user_id, userId),
          eq(ChallengeFeedback.day_number, dayDiff)
        )
      );
    
    const hasSubmitted = existingFeedback.length > 0;
    
    const earnedPoints = await db.select({
      total: sql`SUM(points)`
    })
    .from(ChallengeFeedback)
    .where(
      and(
        eq(ChallengeFeedback.challenge_id, challengeId),
        eq(ChallengeFeedback.user_id, userId)
      )
    );
    
    const currentPoints = earnedPoints[0]?.total || 0;
    
    return sendResponse(200, {
      challenge: {
        title: challenge.title,
        description: challenge.description,
        totalPoints: challenge.total_points,
        currentPoints: currentPoints
      },
      currentDay: dayDiff,
      totalDays: Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
      questions: todayQuestions,
      hasSubmitted: hasSubmitted
    }, "Today's challenge fetched successfully");
    
  } catch (error) {
    const err = error instanceof Error ? error.message : "Unexpected error occurred";
    return sendResponse(500, null, err);
  }
};