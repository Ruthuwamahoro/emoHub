// app/api/groups/[id]/challenges/route.ts
import { checkIfUserIsAdmin, getUserIdFromSession } from '@/utils/getUserIdFromSession';
import { sendResponse } from '@/utils/Responses';
import { NextResponse, NextRequest } from 'next/server';
import { uploadImage } from '../../route';
import db from '@/server/db';
import { Challenges, ChallengeElements } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export const POST = async(
  req: NextRequest,
  segmentedData: { params: Promise<{id: string}>}
) => {
  try {
    const userIdSession = await getUserIdFromSession();
    const userAuth = await checkIfUserIsAdmin();
    console.log("User ID from session:", userAuth);
    
    if (!userAuth) {
      return sendResponse(401, null, "Unauthorized");
    }
    
    const params = await segmentedData.params;
    const groupId = params.id;
    
    if (!groupId) {
      return sendResponse(400, null, "Group ID is required");
    }
    
    const { title, description, start_date, end_date, image, total_points, questions } = await req.json();
    
    if (!title || !description || !start_date || !end_date || !questions || !total_points) {
      return sendResponse(400, null, "All fields are required");
    }
    
    let processedImage = null;
    if (image) {
      processedImage = await uploadImage(image);
    }
    
    const parsedStartDate = new Date(start_date);
    const parsedEndDate = new Date(end_date);
    
    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      return sendResponse(400, null, "Invalid date format");
    }

    // Insert the challenge
    console.log("Inserting data", title)
    const [newChallenge] = await db.insert(Challenges).values({
      group_id: groupId,
      user_id: userIdSession,
      title,
      description,
      start_date: parsedStartDate,
      end_date: parsedEndDate,
      image: processedImage,
      total_points
    }).returning();

    const totalDays = Math.floor((parsedEndDate.getTime() - parsedStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const totalQuestionsPoints = questions.reduce((sum: number, q: any) => sum + (q.points || 0), 0);
    const pointsMultiplier = totalQuestionsPoints > 0 ? total_points / totalQuestionsPoints : 0;
    
    const elementsToInsert = questions.map((question: any, index: number) => {
      const adjustedPoints = Math.round((question.points || 0) * pointsMultiplier);
      
      return {
        challenge_id: newChallenge.id,
        questions: question.question,
        description: question.description || "",
        points: adjustedPoints,
        day_number: 0,
        order: index + 1
      };
    });

    await db.insert(ChallengeElements).values(elementsToInsert);
    
    return sendResponse(200, { 
      challengeId: newChallenge.id,
      totalDays: totalDays,
      pointsDistribution: elementsToInsert.map(el => ({
        questions: el.question,
        points: el.points
      }))
    }, "Challenge Created Successfully");
  } catch (error) {
    const err = error instanceof Error ? error.message : "Unexpected error occurred";
    return sendResponse(500, null, err);
  }
};

export const GET = async(
    request: Request,
    segmentedData: { params: Promise<{id: string}>}
) => {
    const params = await segmentedData.params;
    const groupId = await params.id;
    const userSession = await getUserIdFromSession();
    if (!userSession) {
        return sendResponse(401, null, "Unauthorized");
    }
    try {
      const allChallenges = await db.select().from(Challenges).where(eq(Challenges.group_id, groupId));
      return sendResponse(200, allChallenges,"All challenges fetched successfully");
    } catch (error) {
        const err = error instanceof Error ? error.message : "Unexpected error occurred";
        return sendResponse(500, null, err);
    }
}