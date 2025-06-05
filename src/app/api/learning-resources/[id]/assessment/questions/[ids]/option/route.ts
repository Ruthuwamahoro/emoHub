import { NextRequest } from "next/server";
import db from "@/server/db";
import { ResourceAssessmentOptions, ResourceAssessmentQuestions, ResourceAssessmentResults } from "@/server/db/schema";
import { sendResponse } from "@/utils/Responses";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { eq, inArray } from "drizzle-orm";


export const POST = async (req: NextRequest, 
  {params}: {params: Promise<{ids: string}>}
) => {
    try {
      const { ids } = await params;
      const findQuestionId = ids

      const question = await db.select().from(ResourceAssessmentQuestions).where(eq(ResourceAssessmentQuestions.id, findQuestionId))
      if(question.length === 0){
        return sendResponse(404, null, "Question not found");
      }
      const body = await req.json(); 
      await db.insert(ResourceAssessmentOptions).values({
        questionId: findQuestionId,
        ...body,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
  
      return sendResponse(200, null, "Assessment Option saved successfully");
    } catch (error) {
      const err = error instanceof Error ? error.message : "Internal Server Error";
      return sendResponse(500, null, err);
    }
};

export const GET = async(req:NextRequest) => {
    try {
        const AllOptions = await db.select().from(ResourceAssessmentOptions);
        if(AllOptions.length === 0){
            return sendResponse(404, null, "Options not found");
        }
        return sendResponse(200, AllOptions, "Options fetched successfully");
    } catch (error) {
        const err = error instanceof Error ? error?.message : 'Internal Server Error';
        return sendResponse(500, null, err);
    }
}





 


