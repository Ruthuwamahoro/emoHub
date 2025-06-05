import { eq } from "drizzle-orm";
import db from "@/server/db";
import { ResourceAssessmentOptions } from "@/server/db/schema";
import { sendResponse } from "@/utils/Responses";
import { NextRequest } from "next/server";

export const PATCH = async(req:NextRequest, 
    {params}: {params: Promise<{optionId: string}>}

) => {
    try {
        const { optionId } = await params;
        const findOptionId = optionId;
        const option = await db.select().from(ResourceAssessmentOptions).where(eq(ResourceAssessmentOptions.id, findOptionId))
        if(option.length === 0){
            return sendResponse(404, null, "Option not found");
        }
        const body = await req.json();
        await db.update(ResourceAssessmentOptions).set({
            ...body,
            updatedAt: new Date(),
        }).where(eq(ResourceAssessmentOptions.id, findOptionId))
        return sendResponse(200, null, "Option updated successfully");
    } catch (error) {
        const err = error instanceof Error ? error?.message : 'Internal Server Error';
        return sendResponse(500, null, err);
    }
}

export const DELETE = async(req:NextRequest,
    {params}: {params: Promise<{optionId: string}>}

) => {

    try {
        const { optionId } = await params;
       const id = optionId;
       const findOptionId = await db.select().from(ResourceAssessmentOptions).where(eq(ResourceAssessmentOptions.id, id)) ;
       if(!findOptionId){
         return sendResponse(400, null, "Unauthorized");
       }

       await db.delete(ResourceAssessmentOptions).where(eq(ResourceAssessmentOptions.id, id));
       return sendResponse(200, null, "options deleted successfully")
    } catch(err){
        const error = err instanceof Error ? err?.message : "Unexpected error occured";
        return sendResponse(500, null, error)
    }
}