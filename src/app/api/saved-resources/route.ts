import db from "@/server/db";
import { learningResources, userSavedResources } from "@/server/db/schema";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { and, desc, eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export const POST = async(req: NextRequest) => {
    try {
        const userId = await getUserIdFromSession();
        const body = await req.json();

        const isSaved = await db.select().from(userSavedResources).where(and(eq(userSavedResources.userId, userId as string), eq(userSavedResources.resourceId, body.resourceId)));
        if(isSaved.length > 0){
            return sendResponse(400, null, 'Resource already saved');
        }

        await db.insert(userSavedResources).values({
            ...body,
            userId: userId,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning();

        await db.update(learningResources).set({
            isSaved: true
        }).where(eq(learningResources.id, body.resourceId));
        return sendResponse(200, null, 'Saved resource created successfully');
        
    } catch (error) {
        const err = error instanceof Error ? error?.message : 'Internal Server Error';
        return sendResponse(500, null, err);       
    }
}

export const GET = async(req: NextRequest) => {
    try {
        const userIds = await getUserIdFromSession();
        if (!userIds) {
            return sendResponse(401, null, 'Unauthorized');
        }
        const allSavedResources = await db
        .select({
          id: userSavedResources.id,
          savedAt: userSavedResources.savedAt,
          notes: userSavedResources.notes,
  
          resourceId: learningResources.id,
          title: learningResources.title,
          description: learningResources.description,
          thumbnailUrl: learningResources.thumbnailUrl,
          url: learningResources.url,
          duration: learningResources.duration,
          category: learningResources.category
        })
        .from(userSavedResources)
        .where(eq(userSavedResources.userId, userIds))
        .innerJoin(learningResources, eq(userSavedResources.resourceId, learningResources.id))
        .orderBy(desc(userSavedResources.savedAt));
        return sendResponse(200, allSavedResources, 'Saved resources fetched successfully');
        
    } catch (error) {
        const err = error instanceof Error ? error?.message : 'Internal Server Error';
        return sendResponse(500, null, err);       
    }
}