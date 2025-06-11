import db from "@/server/db";
import { ChallengeElements, Challenges } from "@/server/db/schema";
import { checkIfUserIsAdmin, checkIfUserIsSpecialists, checkIfUserIsSuperAdmin, getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { WeekNumber } from "react-day-picker";
import { BsGooglePlay } from "react-icons/bs";

export async function POST(req:NextRequest){
    try {
        const [isAdmin, isSpecialists, isSuperAdmin] = await Promise.all([
            checkIfUserIsAdmin(),
            checkIfUserIsSpecialists(),
            checkIfUserIsSuperAdmin()
          ])
      
          const isAuthorized = isAdmin || isSpecialists || isSuperAdmin;
          const userId = await getUserIdFromSession();
      
          if(!isAuthorized || !userId){
            return sendResponse(401, null, "Unauthorized");
          }

        const body  = await req.json();
        const now = new Date();
        const insertedData = {
            ...body,
            user_id: userId,
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            created_at: now,
            updated_at: now,
        }
        await db.insert(Challenges).values(
          insertedData
        )

        return sendResponse(200, null, 'Challenge created successful')

    } catch (error) {
        const err = error instanceof Error ? error?.message : 'An expected error occured';
        return sendResponse(500, null, err);
    }
}


export async function GET(req: NextRequest) {
  try {
    const challenges = await db.select({
      id: Challenges.id,
      weekNumber: Challenges.weekNumber,
      startDate: Challenges.startDate,
      endDate: Challenges.endDate,
      theme: Challenges.theme,
    }).from(Challenges);

    const challengeElements = await db.select({
      id: ChallengeElements.id,
      challenge_id: ChallengeElements.challenge_id,
      title: ChallengeElements.title,
      description: ChallengeElements.description,
      completed: ChallengeElements.completed,
    }).from(ChallengeElements);

    const elementsMap = challengeElements.reduce((acc, element) => {
      const challengeId = element.challenge_id ?? '';
      if (!acc[challengeId]) {
        acc[challengeId] = [];
      }
      acc[challengeId].push({
        id: element.id,
        title: element.title,
        description: element.description,
        completed: element.completed,
      });
      return acc;
    }, {} as Record<string, any[]>);

    const result = challenges.map(challenge => ({
      id: challenge.id,
      weekNumber: challenge.weekNumber,
      startDate: challenge.startDate.toISOString().split('T')[0],
      endDate: challenge.endDate.toISOString().split('T')[0], 
      theme: challenge.theme,
      challenges: elementsMap[challenge.id] || [],
    }));

    return sendResponse(200, result, 'Challenges retrieved successfully');
  } catch (error) {
    const err = error instanceof Error ? error?.message : 'An unexpected error occurred';
    return sendResponse(500, null, err);
  }
}