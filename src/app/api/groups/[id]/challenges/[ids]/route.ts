import { NextRequest, NextResponse } from "next/server";
import { eq, and, inArray } from "drizzle-orm";
import db from "@/server/db";
import {
  Challenges,
  ChallengeElements,
  ChallengeElementProgress,
  UserChallengeParticipation,
} from "@/server/db/schema";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";

// GET - Fetch a single challenge with its elements
export async function GET(
  request: NextRequest,
  { params }: { params: { ids: string } }
) {
  try {
    const user_id = await getUserIdFromSession();
    
    if (!user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const challengeId = params.ids;
    
    // Get the challenge
    const [challenge] = await db.select()
      .from(Challenges)
      .where(eq(Challenges.id, challengeId))
      .limit(1);
    
    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }
    
    // Get all challenge elements
    const elements = await db.select()
      .from(ChallengeElements)
      .where(eq(ChallengeElements.challenge_id, challengeId))
      .orderBy(ChallengeElements.order);
    
    // Get user's progress on this challenge
    const elementIds = elements.map(element => element.id);
    
    let userProgress: typeof ChallengeElementProgress.$inferSelect[] = [];
    let userParticipation: typeof UserChallengeParticipation.$inferSelect | null = null;
    
    if (elementIds.length > 0) {
      userProgress = await db.select()
        .from(ChallengeElementProgress)
        .where(and(
          eq(ChallengeElementProgress.user_id, user_id),
          inArray(ChallengeElementProgress.element_id, elementIds)
        ));
      
      const participationResults = await db.select()
        .from(UserChallengeParticipation)
        .where(and(
          eq(UserChallengeParticipation.user_id, user_id),
          eq(UserChallengeParticipation.challenge_id, challengeId)
        ))
        .limit(1);

      userParticipation = participationResults[0] || null;
      
      // If user hasn't joined the challenge yet, create a participation record
      if (!userParticipation) {
        const insertResults = await db.insert(UserChallengeParticipation)
          .values({
            user_id,
            challenge_id: challengeId,
            total_points_earned: 0,
            streak_days: 0,
            is_active: true
          })
          .returning();
        
        userParticipation = insertResults[0];
      }
    }
    
    // Calculate completion percentage
    const totalElements = elements.length;
    const completedElements = userProgress.filter(progress => progress.is_completed).length;
    const completionPercentage = totalElements > 0 ? Math.round((completedElements / totalElements) * 100) : 0;
    
    // Combine data and format response
    const enhancedElements = elements.map(element => {
      const progress = userProgress.find(p => p.element_id === element.id);
      return {
        ...element,
        progress: progress || null
      };
    });
    
    return NextResponse.json({status:200, data:{
        challenge: challenge,
        elements: enhancedElements,
        participation: userParticipation,
        stats: {
            totalElements,
            completedElements,
            completionPercentage,
            totalPointsPossible: challenge.total_points,
            pointsEarned: userParticipation?.total_points_earned || 0,
            streakDays: userParticipation?.streak_days || 0
        },
    },
    message: "Challenge details fetched successfully"
    });
    
  } catch (error) {
    console.error("Error fetching challenge details:", error);
    return NextResponse.json({ error: "Failed to fetch challenge details" }, { status: 500 });
  }
}