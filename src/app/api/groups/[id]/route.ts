import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import db from "@/server/db";
import {
  Group,
  Challenges,
  ChallengeElements,
  UserChallengeParticipation
} from "@/server/db/schema";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";

// GET - Fetch a single group with all its challenges and challenge elements
export async function GET(
  request: NextRequest,
  segmentedData: { params: Promise<{ id: string }> }
) {
  try {
    const user_id = await getUserIdFromSession();
    
    if (!user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const params = await segmentedData.params;
    const groupId = params.id;
    
    const [group] = await db.select()
      .from(Group)
      .where(eq(Group.id, groupId))
      .limit(1);
    
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }
    
    const challenges = await db.select()
      .from(Challenges)
      .where(eq(Challenges.group_id, groupId))
      .orderBy(Challenges.created_at);
    
    const challengeIds = challenges.map(challenge => challenge.id);
    
    if (challengeIds.length === 0) {
      return NextResponse.json({
        group,
        challenges: [],
        userParticipations: []
      });
    }
    
    const elements = await db
      .select()
      .from(ChallengeElements)
      .where(
        eq(ChallengeElements.challenge_id, challengeIds[0])
      );
    
    const userParticipations = await db
      .select()
      .from(UserChallengeParticipation)
      .where(
        eq(UserChallengeParticipation.user_id, user_id)
      );
    
    const enhancedChallenges = await Promise.all(
      challenges.map(async (challenge) => {
        const challengeElements = await db
          .select()
          .from(ChallengeElements)
          .where(eq(ChallengeElements.challenge_id, challenge.id))
          .orderBy(ChallengeElements.order);
        
        const participation = userParticipations.find(
          p => p.challenge_id === challenge.id
        );
        
        return {
          ...challenge,
          elements: challengeElements,
          participation: participation || null
        };
      })
    );
    
    return NextResponse.json({status: 200, data:{
        group,
        challenges: enhancedChallenges,
    },
    message: "Group details fetched successfully"});
    
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch group details" }, { status: 500 });
  }
}