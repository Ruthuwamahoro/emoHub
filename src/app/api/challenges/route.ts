import db from "@/server/db";
import { ChallengeElements, Challenges } from "@/server/db/schema";
import { 
  checkIfUserIsAdmin, 
  checkIfUserIsSpecialists, 
  checkIfUserIsSuperAdmin, 
  getUserIdFromSession 
} from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { desc, eq, isNull, or } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    
    const [isAdmin, isSpecialists, isSuperAdmin] = await Promise.all([
      checkIfUserIsAdmin(),
      checkIfUserIsSpecialists(),
      checkIfUserIsSuperAdmin()
    ]);

    const isAuthorized = isAdmin || isSpecialists || isSuperAdmin;
    const userId = await getUserIdFromSession();

    if (!isAuthorized || !userId) {
      return sendResponse(401, null, "Unauthorized");
    }

    const body = await req.json();

    if (!body.weekNumber || !body.startDate || !body.endDate || !body.theme) {
      return sendResponse(400, null, "Missing required fields");
    }

    const now = new Date();
    const insertedData = {
      weekNumber: parseInt(body.weekNumber) || 0,
      theme: body.theme,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      group_id: (body.group_id && body.group_id.trim() !== '') ? body.group_id : null,
      user_id: userId,
      created_at: now,
      updated_at: now,
    };


    const result = await db.insert(Challenges).values(insertedData);

    return sendResponse(200, insertedData, 'Challenge created successfully');
    
  } catch (error) {
    const err = error instanceof Error ? error.message : 'An unexpected error occurred';
    return sendResponse(500, null, err);
  }
}



export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const groupId = url.searchParams.get("groupId");
    
    const baseQuery = db.select({
      id: Challenges.id,
      weekNumber: Challenges.weekNumber,
      startDate: Challenges.startDate,
      endDate: Challenges.endDate,
      theme: Challenges.theme,
      group_id: Challenges.group_id, 
    }).from(Challenges);

    let challengesQuery;
    if (groupId) {
      challengesQuery = baseQuery.where(eq(Challenges.group_id, groupId));
    } else {

      challengesQuery = baseQuery.where(isNull(Challenges.group_id));

    }

    console.log('SQL Query:', challengesQuery.toSQL());

    const challenges = await challengesQuery.orderBy(desc(Challenges.created_at));
    


    const challengeElements = await db.select({
      id: ChallengeElements.id,
      challenge_id: ChallengeElements.challenge_id,
      title: ChallengeElements.title,
      description: ChallengeElements.description,
      completed: ChallengeElements.is_completed,
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