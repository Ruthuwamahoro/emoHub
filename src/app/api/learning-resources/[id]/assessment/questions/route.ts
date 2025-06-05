import db from "@/server/db";
import { learningResources, ResourceAssessmentQuestions } from "@/server/db/schema";
import { checkIfUserIsSpecialists } from "@/utils/getUserIdFromSession";
import { checkIfUserIsSuperAdmin } from "@/utils/getUserIdFromSession";
import { checkIfUserIsAdmin } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { desc, eq } from "drizzle-orm";
import { NextRequest } from 'next/server';


export const POST = async (req: NextRequest,
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
        const findResourceId = id;

        const resource = await db.select().from(learningResources).where(eq(learningResources.id, findResourceId))
        if(resource.length === 0){
            return sendResponse(404, null, "Resource not found");
        }
        
        const body = await req.json();
        const insertedData = {
            ...body,
            resourceId: findResourceId,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        await db.insert(ResourceAssessmentQuestions).values(insertedData);
        return sendResponse(200, null, 'Question created successfully');
    } catch (error) {
        const err = error instanceof Error ? error?.message : 'Internal Server Error';
        return sendResponse(500, null, err);
    }
}


export const GET = async (req: NextRequest) => {
    try {
        const allQuestions = await db.select().from(ResourceAssessmentQuestions).orderBy(desc(ResourceAssessmentQuestions.createdAt)).execute();
        return sendResponse(200, allQuestions, 'Assessment questions fetched successfully');
        
    } catch (error) {
        const err = error instanceof Error ? error?.message : 'Internal Server Error';
        return sendResponse(500, null, err);
    }
}