import { checkIfUserIsAdmin, getUserIdFromSession } from '@/utils/getUserIdFromSession';
import { sendResponse } from '@/utils/Responses';
import { NextResponse, NextRequest } from 'next/server';
import db from '@/server/db';
import { Challenges, ChallengeElements } from '@/server/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { userIsGroupMember } from '@/utils/userIsGroupMember';
import { uploadImage } from '@/utils/cloudinary';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userIdSession = await getUserIdFromSession();
    const userAuth = await checkIfUserIsAdmin();

    if (!userAuth) {
      return sendResponse(401, null, 'Unauthorized');
    }

    const groupId = params.id;

    if (!groupId) {
      return sendResponse(400, null, 'Group ID is required');
    }

    const {
      title,
      description,
      start_date,
      end_date,
      image,
      total_points,
      questions,
    } = await req.json();

    if (!title || !description || !start_date || !end_date || !questions || !total_points) {
      return sendResponse(400, null, 'All fields are required');
    }

    let processedImage: string | null = null;
    if (image) {
      processedImage = await uploadImage(image);
    }

    const parsedStartDate = new Date(start_date);
    const parsedEndDate = new Date(end_date);

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      return sendResponse(400, null, 'Invalid date format');
    }

    const totalDays = Math.floor((parsedEndDate.getTime() - parsedStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    if (questions.length < totalDays) {
      return sendResponse(400, null, `Not enough questions for ${totalDays} days of challenge`);
    }

    const [newChallenge] = await db
      .insert(Challenges)
      .values({
        group_id: groupId,
        user_id: userIdSession,
        title,
        description,
        start_date: parsedStartDate,
        end_date: parsedEndDate,
        image: processedImage,
        total_points,
      })
      .returning();

    const totalQuestionsPoints = questions.reduce(
      (sum: number, q: { points?: number }) => sum + (q.points || 0),
      0
    );
    const pointsMultiplier = totalQuestionsPoints > 0 ? total_points / totalQuestionsPoints : 0;

    const questionsPerDay = Math.ceil(questions.length / totalDays);
    const elementsToInsert: {
      challenge_id: string;
      questions: string;
      description: string;
      points: number;
      day_number: number;
      order: number;
    }[] = [];

    for (let day = 0; day < totalDays; day++) {
      const dayQuestions = questions.slice(day * questionsPerDay, (day + 1) * questionsPerDay);

      dayQuestions.forEach((question: any, index: number) => {
        const adjustedPoints = Math.round((question.points || 0) * pointsMultiplier);

        elementsToInsert.push({
          challenge_id: newChallenge.id,
          questions: question.question,
          description: question.description || '',
          points: adjustedPoints,
          day_number: day + 1,
          order: index + 1,
        });
      });
    }

    await db.insert(ChallengeElements).values(elementsToInsert);

    return sendResponse(
      200,
      {
        challengeId: newChallenge.id,
        totalDays,
        pointsDistribution: elementsToInsert.map((el) => ({
          question: el.questions,
          day: el.day_number,
          points: el.points,
        })),
      },
      'Challenge Created Successfully'
    );
  } catch (error) {
    const err = error instanceof Error ? error.message : 'Unexpected error occurred';
    return sendResponse(500, null, err);
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const groupId = params.id;

    if (!groupId) {
      return sendResponse(400, null, 'Group ID is required');
    }

    const userAuth = await userIsGroupMember(groupId);
    if (!userAuth) {
      return sendResponse(401, null, 'Unauthorized');
    }

    const url = new URL(req.url);
    const showActive = url.searchParams.get('active') === 'true';
    const today = new Date();

    let query = db.select().from(Challenges).where(eq(Challenges.group_id, groupId));

    // if (showActive) {
    //   query = query.where(
    //     and(lte(Challenges.start_date, today), gte(Challenges.end_date, today))
    //   );
    // }

    const allChallenges = await query;

    return sendResponse(200, allChallenges, 'Challenges fetched successfully');
  } catch (error) {
    const err = error instanceof Error ? error.message : 'Unexpected error occurred';
    return sendResponse(500, null, err);
  }
}
