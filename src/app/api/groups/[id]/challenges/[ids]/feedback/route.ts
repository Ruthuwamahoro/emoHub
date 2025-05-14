import { getUserIdFromSession } from '@/utils/getUserIdFromSession';
import { sendResponse } from '@/utils/Responses';
import { NextRequest } from 'next/server';
import db from '@/server/db';
import { Challenges, ChallengeElements, ChallengeFeedback } from '@/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const POST = async(
  req: NextRequest,
  segmentedData: { params: Promise<{groupId: string, challengeId: string}>}
) => {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) {
      return sendResponse(401, null, "Unauthorized");
    }
    
    const params = await segmentedData.params;
    const { groupId, challengeId } = params;
    
    const { answers } = await req.json();
    
    if (!Array.isArray(answers)) {
      return sendResponse(400, null, "Answers must be an array");
    }
    
    // Get challenge details
    const challenge = await db.query.Challenges.findFirst({
      where: eq(Challenges.id, challengeId),
    });
    
    if (!challenge) {
      return sendResponse(404, null, "Challenge not found");
    }
    
    // Calculate current day
    const today = new Date();
    const startDate = new Date(challenge.start_date);
    
    // Check if challenge is active
    if (today < startDate || today > challenge.end_date) {
      return sendResponse(400, null, "Challenge is not active");
    }
    
    const dayNumber = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Check if user has already submitted feedback for today
    const existingFeedback = await db.select()
      .from(ChallengeFeedback)
      .where(
        and(
          eq(ChallengeFeedback.challenge_id, challengeId),
          eq(ChallengeFeedback.user_id, userId),
          eq(ChallengeFeedback.day_number, dayNumber)
        )
      );
    
    if (existingFeedback.length > 0) {
      return sendResponse(400, null, "You have already submitted feedback for today");
    }
    
    // Get today's questions to validate answers
    const todayQuestions = await db.select()
      .from(ChallengeElements)
      .where(
        and(
          eq(ChallengeElements.challenge_id, challengeId),
          eq(ChallengeElements.day_number, dayNumber)
        )
      );
    
    const questionMap = new Map(todayQuestions.map(q => [q.id, q]));
    let totalPointsEarned = 0;
    
    // Process and save each answer
    const feedbackEntries = answers.map(answer => {
      const question = questionMap.get(answer.questionId);
      if (!question) {
        throw new Error(`Question with ID ${answer.questionId} not found for today's challenge`);
      }
      
      // Calculate points based on completion
      const pointsEarned = answer.completed ? question.points : 0;
      totalPointsEarned += pointsEarned;
      
      return {
        challenge_id: challengeId,
        user_id: userId,
        question_id: answer.questionId,
        response: answer.response || "",
        completed: answer.completed,
        points_earned: pointsEarned,
        day_number: dayNumber,
        submitted_at: new Date()
      };
    });
    
    // Save feedback
    await db.insert(ChallengeFeedback).values(feedbackEntries);
    
    return sendResponse(200, {
      pointsEarned: totalPointsEarned,
      dayNumber: dayNumber
    }, "Feedback submitted successfully");
    
  } catch (error) {
    const err = error instanceof Error ? error.message : "Unexpected error occurred";
    return sendResponse(500, null, err);
  }
};