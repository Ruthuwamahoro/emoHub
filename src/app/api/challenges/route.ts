import db from "@/server/db";
import { ChallengeElements, Challenges } from "@/server/db/schema";
import { 
  checkIfUserIsAdmin, 
  checkIfUserIsSpecialists, 
  checkIfUserIsSuperAdmin, 
  getUserIdFromSession 
} from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { desc } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log('API: POST request received');
    
    const [isAdmin, isSpecialists, isSuperAdmin] = await Promise.all([
      checkIfUserIsAdmin(),
      checkIfUserIsSpecialists(),
      checkIfUserIsSuperAdmin()
    ]);

    const isAuthorized = isAdmin || isSpecialists || isSuperAdmin;
    const userId = await getUserIdFromSession();

    if (!isAuthorized || !userId) {
      console.log('API: Unauthorized access attempt');
      return sendResponse(401, null, "Unauthorized");
    }

    const body = await req.json();
    console.log('API: Request body:', body);

    // Validate required fields
    if (!body.weekNumber || !body.startDate || !body.endDate || !body.theme) {
      console.log('API: Missing required fields');
      return sendResponse(400, null, "Missing required fields");
    }

    const now = new Date();
    const insertedData = {
      weekNumber: parseInt(body.weekNumber) || 0, // Convert to number if needed
      theme: body.theme,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      user_id: userId,
      created_at: now,
      updated_at: now,
    };

    console.log('API: Data to insert:', insertedData);

    const result = await db.insert(Challenges).values(insertedData);
    console.log('API: Insert result:', result);

    return sendResponse(200, insertedData, 'Challenge created successfully');
    
  } catch (error) {
    console.error('API: Error in POST:', error);
    const err = error instanceof Error ? error.message : 'An unexpected error occurred';
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
    }).from(Challenges).orderBy(desc(Challenges.created_at));

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