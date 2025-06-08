// API routes for challenges elements

import { checkIfUserIsAdmin } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { NextResponse, NextRequest } from "next/server";
import { ChallengeElements } from "@/server/db/schema";
import db from "@/server/db";
import { eq } from "drizzle-orm";

export async function GET (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
){
  try {
    const { id } = await params;
    const challengeId = id;

    const elements = await db
      .select()
      .from(ChallengeElements)
      .where(eq(ChallengeElements.challenge_id, challengeId));

    return sendResponse(
      200,
      elements,
      "Challenge elements fetched successfully"
    );
  } catch (error) {
    console.error("Error fetching challenge elements:", error);
    const err =
      error instanceof Error ? error.message : "Unexpected error occurred";
    return sendResponse(500, null, err);
  }
};

export async function POST (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
){
  try {
    const { id } = await params;
    const challengeId = id;
    const { questions, day_number } = await req.json();

    if (!Array.isArray(questions)) {
      return sendResponse(400, null, "Questions must be an array");
    }

    const elementsToInsert = questions.map((q, index) => ({
      challenge_id: challengeId,
      questions: q.question,
      description: q.description,
      points: q.points,
      order: index + 1,
      day_number: day_number,
    }));

    await db.insert(ChallengeElements).values(elementsToInsert);

    return sendResponse(
      200,
      {
        elementsCreated: elementsToInsert.length,
        dayNumber: day_number,
      },
      "Challenge elements created successfully"
    );
  } catch (error) {
    console.error("Error creating challenge elements:", error);
    const err =
      error instanceof Error ? error.message : "Unexpected error occurred";
    return sendResponse(500, null, err);
  }
};
