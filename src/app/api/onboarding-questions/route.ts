//API endpoints for onboarding questions
import { NextRequest } from "next/server";
import { sendResponse } from "@/utils/Responses";
import { getUserIdFromSession} from "@/utils/getUserIdFromSession";
import db from "@/server/db";
import { User, userOnBoardingProfile } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest){
  try {
    const userId = await getUserIdFromSession()
    console.log("User ID from session:", userId);

    if (!userId) {
      return sendResponse(401, null, "User not authenticated");
    }


    const body = await req.json();

    const existingUser = await db.select({
      id: User.id,
      onboardingCompleted: User.onboardingCompleted
    })
    .from(User)
    .where(eq(User.id, userId))
    .limit(1);

    if (existingUser.length === 0) {
      return sendResponse(401, null, "Unauthorized");
    }

    if (existingUser[0].onboardingCompleted) {
      return sendResponse(409, null, "Onboarding already completed");

    }

    const existingProfile = await db.select({ id: userOnBoardingProfile.id })
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
