import db from "@/server/db";
import { userSavedResources } from "@/server/db/schema";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export const DELETE = async (req: NextRequest, 
    {params}: {params: Promise<{id: string}>}

) => {
    try {
        const { id } = await params;
        const userId = await getUserIdFromSession();
        if (!userId) {
            return sendResponse(401, null, 'Unauthorized');
        }
        const resourceId = id;
        await db.delete(userSavedResources).where(eq(userSavedResources.id, resourceId)).returning();
        return sendResponse(200, null, 'Saved resource deleted successfully');
        
    } catch (error) {
        const err = error instanceof Error ? error?.message : 'Internal Server Error';
        return sendResponse(500, null, err);   
    }
}