import { checkIfUserIsAdmin, getUserIdFromSession } from '@/utils/getUserIdFromSession';
import { sendResponse } from '@/utils/Responses';
import { NextResponse, NextRequest } from 'next/server';
import { uploadImage } from '../../route';
import db from '@/server/db';
import { Challenges, ChallengeElements, ChallengeFeedback } from '@/server/db/schema';
import { eq, and, gte, lte, sql } from 'drizzle-orm';
import { userIsGroupMember } from '@/utils/userIsGroupMember';

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

    // Calculate total days of the challenge
    const totalDays = Math.floor((parsedEndDate.getTime() - parsedStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Validate if we have enough questions for each day
    if (questions.length < totalDays) {
      return sendResponse(400, null, `Not enough questions for ${totalDays} days of challenge`);
    }
    
    // Insert the challenge
    console.log("Inserting challenge:", title);
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

    // Calculate points distribution
    const totalQuestionsPoints = questions.reduce((sum: number, q: any) => sum + (q.points || 0), 0);
    const pointsMultiplier = totalQuestionsPoints > 0 ? total_points / totalQuestionsPoints : 0;
    
    // Distribute questions across days
    const questionsPerDay = Math.ceil(questions.length / totalDays);
    const elementsToInsert = [];
    
    for (let day = 0; day < totalDays; day++) {
      const dayQuestions = questions.slice(day * questionsPerDay, (day + 1) * questionsPerDay);
      
      dayQuestions.forEach((question: any, index: number) => {
        const adjustedPoints = Math.round((question.points || 0) * pointsMultiplier);
        
        elementsToInsert.push({
          challenge_id: newChallenge.id,
          questions: question.question,
          description: question.description || "",
          points: adjustedPoints,
          day_number: day + 1, // Set the day number
          order: index + 1
        });
      });
    }
    
    await db.insert(ChallengeElements).values(elementsToInsert);
    
    return sendResponse(200, {
      challengeId: newChallenge.id,
      totalDays: totalDays,
      pointsDistribution: elementsToInsert.map(el => ({
        question: el.questions,
        day: el.day_number,
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
  if (!groupId) {
      return sendResponse(400, null, "Group ID is required");
  }

  const userAuth = await userIsGroupMember(groupId);
  if (!userAuth) {
      return sendResponse(401, null, "Unauthorized");
  }
  
  try {
    const url = new URL(request.url);
    const showActive = url.searchParams.get('active') === 'true';
    const today = new Date();
    
    let query = db.select().from(Challenges).where(eq(Challenges.group_id, groupId));
    
    // Filter for active challenges only if requested
    if (showActive) {
      query = query.where(
        and(
          lte(Challenges.start_date, today),
          gte(Challenges.end_date, today)
        )
      );
    }
    
    const allChallenges = await query;
    
    return sendResponse(200, allChallenges, "Challenges fetched successfully");
  } catch (error) {
    const err = error instanceof Error ? error.message : "Unexpected error occurred";
    return sendResponse(500, null, err);
  }
};