// /api/challenges/[ids]/completed/route.ts - FIXED VERSION
import db from "@/server/db";
import { ChallengeElements, Challenges, UserProgress } from "@/server/db/schema";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
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
        console.log("idssss", id)
        const challengeId = id;

        console.log('API Route - Received data:', { challengeId, elementId, completed, userId });

        const updateResult = await db.update(ChallengeElements).set({
            is_completed: completed, // Fixed column name
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
        
        console.log("API Route - All elements for challenge:", allElementsDebug);

        const elementsStats = await db.select({
            total: sql<number>`count(*)`.as('total'),
            completed: sql<number>`count(case when ${ChallengeElements.is_completed} = true then 1 end)`.as('completed'), // Fixed column name
        }).from(ChallengeElements)
            .where(eq(ChallengeElements.challenge_id, challengeId));

        console.log("API Route - Element stats query result:", elementsStats);

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

        console.log('API Route - Challenge updated:', challengeUpdateResult);

        const updatedChallenge = await db.select()
            .from(Challenges)
            .where(eq(Challenges.id, challengeId))
            .limit(1);
        
        console.log('API Route - Updated challenge verification:', updatedChallenge);

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

export const updateUserProgress = async (userId: string) => {
    try {
        console.log('API Route - Updating user progress for userId:', userId);

        const allChallengesDebug = await db.select()
            .from(Challenges)
            .where(eq(Challenges.user_id, userId));
        
        console.log('API Route - All challenges for user:', allChallengesDebug);

        const challengeStats = await db.select({
            totalWeeks: sql<number>`count(*)`.as("totalWeeks"),
            completedWeeks: sql<number>`count(case when ${Challenges.is_week_completed} = true then 1 end)`.as('completedWeeks'),
            totalChallenges: sql<number>`coalesce(sum(${Challenges.total_elements}), 0)`.as('totalChallenges'), // Fixed: use coalesce to handle null
            completedChallenges: sql<number>`coalesce(sum(${Challenges.completed_elements}), 0)`.as('completedChallenges'), // Fixed: use coalesce to handle null
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
    // FIXED: Use correct column name 'is_completed'
    const completedElements = await db
        .select({
            completed_at: ChallengeElements.completed_at,
        })
        .from(ChallengeElements)
        .innerJoin(Challenges, eq(ChallengeElements.challenge_id, Challenges.id))
        .where(
            and(
                eq(Challenges.user_id, userId),
                eq(ChallengeElements.is_completed, true) // Fixed column name
            )
        )
        .orderBy(sql`${ChallengeElements.completed_at} DESC`);

    if (completedElements.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // FIXED: Better streak calculation logic
    const uniqueDates = new Set<string>();
    
    for (const element of completedElements) {
        if (!element.completed_at) continue;

        const completedDate = new Date(element.completed_at);
        completedDate.setHours(0, 0, 0, 0);
        
        // Add to unique dates set to count unique days
        uniqueDates.add(completedDate.toISOString().split('T')[0]);
    }

    // Convert to sorted array of dates
    const sortedDates = Array.from(uniqueDates)
        .map(dateStr => new Date(dateStr))
        .sort((a, b) => b.getTime() - a.getTime()); // Most recent first

    if (sortedDates.length === 0) return 0;

    // Check if streak is current (last activity was today or yesterday)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysDiff = Math.floor((today.getTime() - sortedDates[0].getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff > 1) return 0; // Streak is broken

    // Count consecutive days
    streak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = sortedDates[i - 1];
        const currDate = sortedDates[i];
        const diff = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diff === 1) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}

async function calculateLongestStreak(userId: string): Promise<number> {
    // FIXED: Use correct column name 'is_completed'
    const completedElements = await db
        .select({
            completed_at: ChallengeElements.completed_at,
        })
        .from(ChallengeElements)
        .innerJoin(Challenges, eq(ChallengeElements.challenge_id, Challenges.id))
        .where(
            and(
                eq(Challenges.user_id, userId),
                eq(ChallengeElements.is_completed, true) // Fixed column name
            )
        )
        .orderBy(ChallengeElements.completed_at);

    if (completedElements.length === 0) return 0;

    // Get unique dates
    const uniqueDates = new Set<string>();
    
    for (const element of completedElements) {
        if (!element.completed_at) continue;
        const date = new Date(element.completed_at);
        date.setHours(0, 0, 0, 0);
        uniqueDates.add(date.toISOString().split('T')[0]);
    }

    // Convert to sorted array
    const sortedDates = Array.from(uniqueDates)
        .map(dateStr => new Date(dateStr))
        .sort((a, b) => a.getTime() - b.getTime()); // Chronological order

    if (sortedDates.length === 0) return 0;

    let longestStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = sortedDates[i - 1];
        const currDate = sortedDates[i];
        const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

        if (dayDiff === 1) {
            currentStreak++;
            longestStreak = Math.max(longestStreak, currentStreak);
        } else {
            currentStreak = 1;
        }
    }

    return longestStreak;
}