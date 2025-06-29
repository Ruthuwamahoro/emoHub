//API endpoints for onboarding questions
import { NextRequest, NextResponse } from "next/server";
import { sendResponse } from "@/utils/Responses";
import { checkIfIsRegularUser, checkIfUserIsModerator, getUserIdFromSession} from "@/utils/getUserIdFromSession";
import db from "@/server/db";
import { User, userOnBoardingProfile } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest){
  try {
    const userId = await getUserIdFromSession()

    const [isModerator, isRegularUser] = await Promise.all([
      checkIfUserIsModerator(),
      checkIfIsRegularUser(),
    ]);

    if (!userId) {
      return sendResponse(401, null, "User not authenticated");
    }

    const isUser = (isModerator || isRegularUser);
    if (!isUser) {
      return sendResponse(401, null, "Unauthorized");
    }

    const body = await req.json();

    const existingProfile = await db.select()
      .from(userOnBoardingProfile)
      .where(eq(userOnBoardingProfile.userId, userId))
      .limit(1);

    if (existingProfile.length > 0) {
      return sendResponse(409, null, "Onboarding profile already exists");
    }



    await db.insert(userOnBoardingProfile).values({
        userId,
        impression: body.impression,
        currentEmotions: body.currentEmotions,
        expressFellings: body.expressFellings,
        goals: body.goals,
        experienceLevel: body.experienceLevel
      });

    await db.update(User)
        .set({
          onboardingCompleted: true,
          onboardingCompletedAt: new Date()
        })
        .where(eq(User.id, userId));
    return sendResponse(200, null,"Onboarding profile created successfully");

  } catch (error) {
    const err = error instanceof Error ? error?.message : "Unexpected error occurred";
    return sendResponse(500, null, err);
  }
};
