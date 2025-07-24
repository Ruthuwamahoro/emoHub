import db from "@/server/db";
import { learningResources } from "@/server/db/schema";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { eq, and } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const userId = await getUserIdFromSession();
    const body = await req.json();
    
    const { resourceId, isSaved } = body;

    if (!userId) {
      return sendResponse(401, null, 'Unauthorized: User not found');
    }

    if (!resourceId) {
      return sendResponse(400, null, 'Resource ID is required');
    }

    if (typeof isSaved !== 'boolean') {
      return sendResponse(400, null, 'isSaved must be a boolean value');
    }

    const updatedResource = await db
      .update(learningResources)
      .set({ 
        isSaved,
        updatedAt: new Date() 
      })
      .where(
        and(
          eq(learningResources.id, resourceId),
          eq(learningResources.userId, userId as string)
        )
      )
      .returning();

    if (updatedResource.length === 0) {
      return sendResponse(404, null, 'Resource not found or you do not have permission to update it');
    }

    return sendResponse(
      200, 
      updatedResource[0], 
      `Resource ${isSaved ? 'saved' : 'unsaved'} successfully!`
    );

  } catch (error) {
    return sendResponse(
      500, 
      null, 
      error instanceof Error ? error.message : 'An unexpected error occurred'
    );
  }
}