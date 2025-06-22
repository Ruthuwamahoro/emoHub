import db from "@/server/db";
import { ChallengeElements, Challenges, UserProgress } from "@/server/db/schema";
import { and, eq, sql } from "drizzle-orm";

export const updateUserProgress = async (userId: string) => {
    try {
        console.log('Updating user progress for userId:', userId);

        const allChallengesDebug = await db.select()
            .from(Challenges)
            .where(eq(Challenges.user_id, userId));
        
        console.log('All challenges for user:', allChallengesDebug);

        const challengeStats = await db.select({
            totalWeeks: sql<number>`count(*)`.as("totalWeeks"),
            completedWeeks: sql<number>`count(case when ${Challenges.is_week_completed} = true then 1 end)`.as('completedWeeks'),
            totalChallenges: sql<number>`coalesce(sum(${Challenges.total_elements}), 0)`.as('totalChallenges'),
            completedChallenges: sql<number>`coalesce(sum(${Challenges.completed_elements}), 0)`.as('completedChallenges'),
        }).from(Challenges)
            .where(eq(Challenges.user_id, userId));

        console.log('Challenge stats raw:', challengeStats);

        const stats = challengeStats[0] || {
            totalWeeks: 0,
            completedWeeks: 0,
            totalChallenges: 0,
            completedChallenges: 0
        };

        console.log('Processed stats:', stats);

        const overallPercentage = stats.totalChallenges > 0
            ? (stats.completedChallenges / stats.totalChallenges) * 100 : 0;

        const currentStreak = await calculateCurrentStreak(userId);
        const longestStreak = await calculateLongestStreak(userId);

        console.log('Calculated streaks:', { currentStreak, longestStreak });

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
            console.log('Creating new user progress:', progressData);
            await db.insert(UserProgress).values({
                ...progressData,
                created_at: new Date()
            });
        } else {
            // Update existing progress record
            console.log('Updating existing user progress:', progressData);
            await db.update(UserProgress).set(progressData)
                .where(eq(UserProgress.user_id, userId));
        }

        console.log('User progress updated successfully');

    } catch (error) {
        console.error('Error updating user progress:', error);
        throw error;
    }
}

export async function calculateCurrentStreak(userId: string): Promise<number> {
    const completedElements = await db
        .select({
            completed_at: ChallengeElements.completed_at,
        })
        .from(ChallengeElements)
        .innerJoin(Challenges, eq(ChallengeElements.challenge_id, Challenges.id))
        .where(
            and(
                eq(Challenges.user_id, userId),
                eq(ChallengeElements.is_completed, true)
            )
        )
        .orderBy(sql`${ChallengeElements.completed_at} DESC`);

    if (completedElements.length === 0) return 0;

    const uniqueDates = new Set<string>();
    
    for (const element of completedElements) {
        if (!element.completed_at) continue;

        const completedDate = new Date(element.completed_at);
        completedDate.setHours(0, 0, 0, 0);
        
        uniqueDates.add(completedDate.toISOString().split('T')[0]);
    }

    const sortedDates = Array.from(uniqueDates)
        .map(dateStr => new Date(dateStr))
        .sort((a, b) => b.getTime() - a.getTime());

    if (sortedDates.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysDiff = Math.floor((today.getTime() - sortedDates[0].getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff > 1) return 0;

    let streak = 1;
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

export async function calculateLongestStreak(userId: string): Promise<number> {
    const completedElements = await db
        .select({
            completed_at: ChallengeElements.completed_at,
        })
        .from(ChallengeElements)
        .innerJoin(Challenges, eq(ChallengeElements.challenge_id, Challenges.id))
        .where(
            and(
                eq(Challenges.user_id, userId),
                eq(ChallengeElements.is_completed, true)
            )
        )
        .orderBy(ChallengeElements.completed_at);

    if (completedElements.length === 0) return 0;

    const uniqueDates = new Set<string>();
    
    for (const element of completedElements) {
        if (!element.completed_at) continue;
        const date = new Date(element.completed_at);
        date.setHours(0, 0, 0, 0);
        uniqueDates.add(date.toISOString().split('T')[0]);
    }

    const sortedDates = Array.from(uniqueDates)
        .map(dateStr => new Date(dateStr))
        .sort((a, b) => a.getTime() - b.getTime());

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