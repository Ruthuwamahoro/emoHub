import { NextRequest, NextResponse } from "next/server";
import { eq, asc, desc } from "drizzle-orm";
import db from "@/server/db";
import { ChallengeElements, Challenges } from "@/server/db/schema";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";

export async function GET(
  request: NextRequest,
  { params }: { params: { ids: string } }
) {
  try {
    const challengeId = params.ids;
    
    const elements = await db.select()
      .from(ChallengeElements)
      .where(eq(ChallengeElements.challenge_id, challengeId))
      .orderBy(asc(ChallengeElements.order));
    
    return NextResponse.json({status: 200, data: elements, message: "Challenge elements fetched successfully"});
  } catch (error) {
    console.error("Error fetching challenge elements:", error);
    return NextResponse.json({ error: "Failed to fetch challenge elements" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  segmentedData: { params: Promise<{ ids: string }> }
) {
  try {
    const user_id = await getUserIdFromSession();
    const params = await segmentedData.params;
    
    const challengeId = params.ids;
    const body = await request.json();
    console.log(body);
    
    const [challenge] = await db.select()
      .from(Challenges)
      .where(eq(Challenges.id, challengeId))
      .limit(1);
    
    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }
    
    if (challenge.user_id !== user_id) {
      return NextResponse.json({ error: "Not authorized to add elements to this challenge" }, { status: 403 });
    }
    
    if (Array.isArray(body)) {
      const existingElements = await db.select()
        .from(ChallengeElements)
        .where(eq(ChallengeElements.challenge_id, challengeId))
        .orderBy(desc(ChallengeElements.order))
        .limit(1);
      
      let startOrder = 0;
      if (existingElements.length > 0 && existingElements[0].order !== null) {
        startOrder = existingElements[0].order + 1;
      }
      
      const elementsToInsert = body.map((element: any, index: number) => {
        return {
          challenge_id: challengeId,
          title: element.title,
          question: element.question || null,
          points: element.points || 0,
          order: startOrder + index,
          notes: element.notes || null,
        };
      });
      
      const insertedElements = await db.insert(ChallengeElements)
        .values(elementsToInsert)
        .returning();
      
      const totalPoints = elementsToInsert.reduce((sum, element) => sum + (element.points || 0), 0);
      
      await db.update(Challenges)
        .set({
          total_points: (challenge.total_points || 0) + totalPoints,
          updated_at: new Date(),
        })
        .where(eq(Challenges.id, challengeId));
      
      return NextResponse.json(insertedElements);
    } else {
      const { title, question, points = 0, notes } = body as { 
        title: string;
        question?: string; 
        points?: number;
        notes?: string;
      };
      
      const existingElements = await db.select()
        .from(ChallengeElements)
        .where(eq(ChallengeElements.challenge_id, challengeId))
        .orderBy(desc(ChallengeElements.order))
        .limit(1);
      
      let order = 0;
      if (existingElements.length > 0 && existingElements[0].order !== null) {
        order = existingElements[0].order + 1;
      }
      
      // Create the element
      const [element] = await db.insert(ChallengeElements)
        .values({
          title,
          challenge_id: challengeId,
          question: question || null,
          points: points || 0,
          order,
          notes: notes || null,
        })
        .returning();
      
      // Update total points on the challenge
      await db.update(Challenges)
        .set({
          total_points: (challenge.total_points || 0) + (points || 0),
          updated_at: new Date(),
        })
        .where(eq(Challenges.id, challengeId));
      
      return NextResponse.json({status:200, data: null, message: "questions added successfully"});
    }
  } catch (error) {
    console.error("Error creating challenge elements:", error);
    return NextResponse.json({ error: "Failed to create challenge elements" }, { status: 500 });
  }
}