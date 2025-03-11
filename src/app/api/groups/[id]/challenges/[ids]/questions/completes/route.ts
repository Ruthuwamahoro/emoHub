import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import db from "@/server/db";
import { 
  ChallengeElementProgress, 
  UserChallengeParticipation,
  ChallengeElements 
} from "@/server/db/schema";

interface RequestBody {
  elementId: string;
  completed: boolean;
  notes?: string | null;
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromSession();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { elementId, completed, notes }: RequestBody = await req.json();

    if (!elementId) {
      return NextResponse.json({ message: "Element ID is required" }, { status: 400 });
    }

    // Find existing progress
    const [existingProgress] = await db
      .select()
      .from(ChallengeElementProgress)
      .where(
        and(
          eq(ChallengeElementProgress.user_id, userId),
          eq(ChallengeElementProgress.element_id, elementId)
        )
      );

    if (existingProgress) {
      // Update existing progress
      await db
        .update(ChallengeElementProgress)
        .set({
          is_completed: completed,
          notes: notes ?? existingProgress.notes,
          completion_date: completed ? new Date() : null,
          updated_at: new Date(),
        })
        .where(
          and(
            eq(ChallengeElementProgress.user_id, userId),
            eq(ChallengeElementProgress.element_id, elementId)
          )
        );
    } else {
      // Create new progress entry
      await db.insert(ChallengeElementProgress).values({
        user_id: userId,
        element_id: elementId,
        is_completed: completed,
        notes: notes ?? null,
        completion_date: completed ? new Date() : null,
      });
    }

    // Get element details to update points
    const [element] = await db
      .select()
      .from(ChallengeElements)
      .where(eq(ChallengeElements.id, elementId));

    if (element && completed) {
      // Update user's participation record with earned points
      const [participation] = await db
        .select()
        .from(UserChallengeParticipation)
        .where(
          and(
            eq(UserChallengeParticipation.user_id, userId),
            eq(UserChallengeParticipation.challenge_id, element.challenge_id)
          )
        );

      if (participation) {
        // Update points only if the element was newly completed
        if (!existingProgress?.is_completed && completed) {
          await db
            .update(UserChallengeParticipation)
            .set({
              total_points_earned: participation.total_points_earned + (element.points || 0),
              updated_at: new Date(),
            })
            .where(eq(UserChallengeParticipation.id, participation.id));
        }
      } else {
        // Create new participation record
        await db.insert(UserChallengeParticipation).values({
          user_id: userId,
          challenge_id: element.challenge_id,
          total_points_earned: element.points || 0,
          is_active: true,
        });
      }
    }

    return NextResponse.json({ 
      message: "Element progress updated successfully",
      completed
    });
  } catch (error) {
    console.error("Error updating element progress:", error);
    return NextResponse.json(
      { message: "Failed to update element progress" },
      { status: 500 }
    );
  }
}