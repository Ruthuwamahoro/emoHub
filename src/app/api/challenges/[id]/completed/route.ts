// /api/challenges/[ids]/completed/route.ts - ENHANCED VERSION
import db from "@/server/db";
import { ChallengeElements, Challenges, UserProgress } from "@/server/db/schema";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { and, eq, sql } from "drizzle-orm";
import { NextRequest} from "next/server";

export async function PATCH(req: NextRequest, {params}: {params: Promise<{ids: string}>}){
    try {
        const userId = await getUserIdFromSession()
    
        if (!userId) {
          return sendResponse(401, null, "User not authenticated");
        }

        const { elementId, completed } = await req.json();
        const { ids } = await params;
        const challengeId = ids;
        
        console.log('API Route - Received data:', { challengeId, elementId, completed, userId });

        // Update the challenge element
        const updateResult = await db.update(ChallengeElements).set({
            completed,
            completed_at: completed ? new Date() : null,
            completed_by: completed ? userId: null,
            updated_at: new Date()
        }).where(
            and(
              eq(ChallengeElements.id, elementId),
              eq(ChallengeElements.challenge_id, challengeId)
            )
        );

        console.log('API Route - Element updated:', updateResult);

        // Get updated challenge stats
        const elementsStats = await db.select({
          total: sql<number>`count(*)`.as('total'),
          completed: sql<number>`count(case when ${ChallengeElements.completed} = true then 1 end)`.as('completed'),
        }).from(ChallengeElements)
        .where(eq(ChallengeElements.challenge_id, challengeId));

        console.log("API Route - Element stats query result:", elementsStats);

        const stats = elementsStats[0] || { total: 0, completed: 0 };
        
        const completionPercentage = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
        const isWeekCompleted = stats.completed === stats.total && stats.total > 0;

        // Update challenge/week stats
        const challengeUpdateResult = await db.update(Challenges).set({
          total_elements: stats.total,
          completed_elements: stats.completed, 
          completed_percentage: completionPercentage.toFixed(2),
          is_week_completed: isWeekCompleted,
          updated_at: new Date()
        }).where(eq(Challenges.id, challengeId));

        console.log('API Route - Challenge updated:', challengeUpdateResult);

        // Update user progress
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

        console.log('API Route - Sending response:', responseData);

        return sendResponse(200, responseData, 'Challenge element updated successfully');
        
    } catch (error) {
        console.error('API Route - Error in PATCH route:', error);
        const err = error instanceof Error ? error?.message : 'An unexpected error occurred';
        return sendResponse(500, null, err);
    }
}

export const updateUserProgress = async(userId: string) => {
  try {
    console.log('API Route - Updating user progress for userId:', userId);
    
    // Get all challenge stats for this user
    const challengeStats = await db.select({
      totalWeeks: sql<number>`count(*)`.as("totalWeeks"),
      completedWeeks: sql<number>`count(case when ${Challenges.is_week_completed} = true then 1 end)`.as('completedWeeks'),
      totalChallenges: sql<number>`sum(${Challenges.total_elements})`.as('totalChallenges'),
      completedChallenges: sql<number>`sum(${Challenges.completed_elements})`.as('completedChallenges'),
    }).from(Challenges)
    .where(eq(Challenges.user_id, userId));

    console.log('API Route - Challenge stats raw:', challengeStats);

    const stats = challengeStats[0] || { 
      totalWeeks: 0, 
      completedWeeks: 0, 
      totalChallenges: 0, 
      completedChallenges: 0 
    };
    
    console.log('API Route - Processed stats:', stats);
    
    const overallPercentage = stats.totalChallenges > 0
      ? (stats.completedChallenges / stats.totalChallenges) * 100 : 0;
    
    const currentStreak = await calculateCurrentStreak(userId);
    const longestStreak = await calculateLongestStreak(userId);

    console.log('API Route - Calculated streaks:', { currentStreak, longestStreak });

    // Check if user progress record exists
    const existingProgress = await db.select()
      .from(UserProgress)
      .where(eq(UserProgress.user_id, userId))
      .limit(1);

    const progressData = {
      user_id: userId,
      total_weeks: stats.totalWeeks,
      completed_weeks: stats.completedWeeks,
      total_challenges: stats.totalChallenges,
      completed_challenges: stats.completedChallenges,
      overall_completion_percentage: overallPercentage.toFixed(2),
      current_streak: currentStreak,
      longest_streak: Math.max(longestStreak, currentStreak),
      last_activity_date: new Date(),
      updated_at: new Date()
    };

    if (existingProgress.length === 0) {
      // Insert new progress record
      console.log('API Route - Creating new user progress:', progressData);
      await db.insert(UserProgress).values({
        ...progressData,
        created_at: new Date()
      });
    } else {
      // Update existing progress record
      console.log('API Route - Updating existing user progress:', progressData);
      await db.update(UserProgress).set(progressData)
        .where(eq(UserProgress.user_id, userId));
    }

    console.log('API Route - User progress updated successfully');

  } catch (error) {
    console.error('API Route - Error updating user progress:', error);
    throw error;
  }
} 

async function calculateCurrentStreak(userId: string): Promise<number> {
  const completedElements = await db
    .select({
      completed_at: ChallengeElements.completed_at,
    })
    .from(ChallengeElements)
    .innerJoin(Challenges, eq(ChallengeElements.challenge_id, Challenges.id))
    .where(
      and(
        eq(Challenges.user_id, userId),
        eq(ChallengeElements.completed, true)
      )
    )
    .orderBy(sql`${ChallengeElements.completed_at} DESC`);

  if (completedElements.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const element of completedElements) {
    if (!element.completed_at) continue;

    const completedDate = new Date(element.completed_at);
    completedDate.setHours(0, 0, 0, 0);

    const dayDiff = Math.floor((currentDate.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24));

    if (dayDiff === 0 || dayDiff === 1) {
      streak++;
      currentDate = completedDate;
    } else if (dayDiff > 1) {
      break;
    }
  }

  return streak;
}

async function calculateLongestStreak(userId: string): Promise<number> {
  const completedElements = await db
    .select({
      completed_at: ChallengeElements.completed_at,
    })
    .from(ChallengeElements)
    .innerJoin(Challenges, eq(ChallengeElements.challenge_id, Challenges.id))
    .where(
      and(
        eq(Challenges.user_id, userId),
        eq(ChallengeElements.completed, true)
      )
    )
    .orderBy(ChallengeElements.completed_at);

  if (completedElements.length === 0) return 0;

  let longestStreak = 0;
  let currentStreak = 1;
  let prevDate = new Date(completedElements[0].completed_at!);
  prevDate.setHours(0, 0, 0, 0);

  for (let i = 1; i < completedElements.length; i++) {
    const currentDate = new Date(completedElements[i].completed_at!);
    currentDate.setHours(0, 0, 0, 0);

    const dayDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

    if (dayDiff === 1) {
      currentStreak++;
    } else {
      longestStreak = Math.max(longestStreak, currentStreak);
      currentStreak = 1;
    }

    prevDate = currentDate;
  }

  return Math.max(longestStreak, currentStreak);
}