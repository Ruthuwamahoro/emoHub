import db from "@/server/db";
import { learningResources } from "@/server/db/schema";
import { checkIfUserIsAdmin, checkIfUserIsSpecialists, checkIfUserIsSuperAdmin } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export const GET = async(req: NextRequest,
    {params}: {params: Promise<{id: string}>}
) => {
    try {
        const { id } = await params;
        const findResourceId = id;
        const resource = await db.select().from(learningResources).where(eq(learningResources.id, findResourceId)).execute();
        if (resource.length === 0) {
            return sendResponse(404, null, 'Learning resource not found');
        }
        return sendResponse(200, resource[0], 'Learning resource fetched successfully');
        
    } catch (error) {
        const err = error instanceof Error ? error?.message : 'Internal Server Error';
        return sendResponse(500, null, err);    
    }
}

export const PATCH = async (req: NextRequest, 
    {params}: {params: Promise<{id: string}>}

) => {
    try {
        const { id } = await params;
        const [isAdmin, isSpecialists, isSuperAdmin] = await Promise.all([
            checkIfUserIsAdmin(),
            checkIfUserIsSpecialists(),
            checkIfUserIsSuperAdmin()
          ])
      
          const isAuthorized = isAdmin || isSpecialists || isSuperAdmin;
          if(!isAuthorized){
            return sendResponse(401, null, "Unauthorized");
          }

        const resourceId = id;
        const body = await req.json();
        const updateData = {
            ...body,
            updatedAt: new Date(),
        };
        await db.update(learningResources).set(updateData).where(eq(learningResources.id, resourceId)).returning();
        return sendResponse(200, null, 'Learning resource updated successfully');

    } catch (error) {
        const err = error instanceof Error ? error?.message : 'Internal Server Error';
        return sendResponse(500, null, err);    
    }
}

export const DELETE = async(req: NextRequest, 
    {params}: {params: Promise<{id: string}>}

) => {
    try {
        const { id } = await params;
        const [isAdmin, isSpecialists, isSuperAdmin] = await Promise.all([
            checkIfUserIsAdmin(),
            checkIfUserIsSpecialists(),
            checkIfUserIsSuperAdmin()
          ])
      
          const isAuthorized = isAdmin || isSpecialists || isSuperAdmin;
          if(!isAuthorized){
            return sendResponse(401, null, "Unauthorized");
          } 

        const resourceId = id;
        await db.delete(learningResources).where(eq(learningResources.id, resourceId)).returning();
        return sendResponse(200, null, 'Learning resource deleted successfully');

    } catch (error) {
        const err = error instanceof Error ? error?.message : 'Internal Server Error';
        return sendResponse(500, null, err);    
    }
}