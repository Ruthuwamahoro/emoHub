import db from "@/server/db";
import { learningResources, ResourceAssessmentQuestions } from "@/server/db/schema";
import { checkIfUserIsAdmin } from "@/utils/getUserIdFromSession";
import { checkIfUserIsSpecialists } from "@/utils/getUserIdFromSession";
import { eq } from "drizzle-orm";
import { checkIfUserIsSuperAdmin } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { NextRequest } from "next/server";

export const PATCH = async(req:NextRequest,
    {params}: {params: Promise<{id: string, ids: string}>}

) => {
    try {
        const { id, ids} = await params;
        const findResourceId = id;
        const findQuestionId = ids;
        const resource = await db.select().from(learningResources).where(eq(learningResources.id, findResourceId))
        if(resource.length === 0){
            return sendResponse(404, null, "Resource not found");
        }
        const question = await db.select().from(ResourceAssessmentQuestions).where(eq(ResourceAssessmentQuestions.id, findQuestionId))
        if(question.length === 0){
            return sendResponse(404, null, "Question not found");
        }
        const [isAdmin, isSpecialists, isSuperAdmin] = await Promise.all([
            checkIfUserIsAdmin(),
            checkIfUserIsSpecialists(),
            checkIfUserIsSuperAdmin()
        ])
        const isAuthorized = isAdmin || isSpecialists || isSuperAdmin;
        if(!isAuthorized){
            return sendResponse(401, null, "Unauthorized");
        }
        const body = await req.json();
        await db.update(ResourceAssessmentQuestions).set({
            ...body,
            updatedAt: new Date(),
        }).where(eq(ResourceAssessmentQuestions.id, findQuestionId))
        return sendResponse(200, null, "Question updated successfully");
    } catch (error) {
        const err = error instanceof Error ? error?.message : 'Internal Server Error';
        return sendResponse(500, null, err);
    }
}

export const DELETE = async(req:NextRequest,
    {params}: {params: Promise<{id: string, ids: string}>}
) => {
    try {
        const { id, ids} = await params;
        const findQuestionId = ids;
        const question = await db.select().from(ResourceAssessmentQuestions).where(eq(ResourceAssessmentQuestions.id, findQuestionId))
        if(question.length === 0){
            return sendResponse(404, null, "Question not found");
        }
        const [isAdmin, isSpecialists, isSuperAdmin] = await Promise.all([
            checkIfUserIsAdmin(),
            checkIfUserIsSpecialists(),
            checkIfUserIsSuperAdmin()
        ])
        const isAuthorized = isAdmin || isSpecialists || isSuperAdmin;
        if(!isAuthorized){
            return sendResponse(401, null, "Unauthorized");
        }
        await db.delete(ResourceAssessmentQuestions).where(eq(ResourceAssessmentQuestions.id, findQuestionId))
        return sendResponse(200, null, "Question deleted successfully");
    } catch (error) {
        const err = error instanceof Error ? error?.message : 'Internal Server Error';
        return sendResponse(500, null, err);
    }
}

export const GET = async(req:NextRequest,
    {params}: {params: Promise<{ids: string}>}

) => {
    try {
        const { ids} = await params;

        const findQuestionId = ids;
        const question = await db.select().from(ResourceAssessmentQuestions).where(eq(ResourceAssessmentQuestions.id, findQuestionId))
        if(question.length === 0){
            return sendResponse(404, null, "Question not found");
        }
        return sendResponse(200, question, "Question fetched successfully");
    } catch (error) {
        const err = error instanceof Error ? error?.message : 'Internal Server Error';
        return sendResponse(500, null, err);
    }
}