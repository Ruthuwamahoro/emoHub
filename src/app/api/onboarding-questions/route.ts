import { NextRequest, NextResponse } from "next/server";
import { sendResponse } from "@/utils/Responses";
import { checkIfIsRegularUser, checkIfUserIsModerator, getUserIdFromSession} from "@/utils/getUserIdFromSession";
import db from "@/server/db";
import { User, userOnBoardingProfile } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest){
  try {
    const [isModerator, isRegularUser, userId] = await Promise.all([
      checkIfUserIsModerator(),
      checkIfIsRegularUser(),
      getUserIdFromSession()
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

    const requiredFields = ['primaryPurpose', 'goals', 'experienceLevel'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return sendResponse(400, null, `Missing required fields: ${missingFields.join(', ')}`);
    }



    await db.insert(userOnBoardingProfile).values({
        userId,
        primaryPurpose: body.primaryPurpose,
        goals: body.goals,
        experienceLevel: body.experienceLevel,
        preferences: body.preferences || {},
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