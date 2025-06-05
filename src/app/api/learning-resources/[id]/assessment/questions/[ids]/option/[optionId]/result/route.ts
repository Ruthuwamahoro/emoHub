import db from "@/server/db";
import { ResourceAssessmentOptions, ResourceAssessmentQuestions, ResourceAssessmentResults } from "@/server/db/schema";
import { getUserIdFromSession } from "@/utils/getUserIdFromSession";
import { sendResponse } from "@/utils/Responses";
import { eq } from "drizzle-orm";
import { NextRequest} from "next/server";

export async function POST(req:NextRequest,
    {params}: {params: Promise<{optionId: string, ids: string}>}

){
    try {
        const userId = await getUserIdFromSession();
        const { ids , optionId } = await params;
        const questionId =ids

        if(!userId){
            sendResponse(400, null, "unauthorized");
        }
        await db.insert(ResourceAssessmentResults).values({
            userId: userId as string,
            questionId,
            choiceId: optionId,
            answeredAt: new Date
        })
        
        return sendResponse(200, null, "Assessment responses submitted successfully.");
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal Server Error";
        return sendResponse(500, null, message);
    }
}
export const GET = async (
    req: NextRequest,
    {params}: {params: Promise<{optionId: string}>}

  ) => {
    try {
      const { optionId } = await params;
      const optionIds = optionId
      const allResults = await db
        .select({
          id: ResourceAssessmentResults.id,
          questionId: ResourceAssessmentResults.questionId,
          choiceId: ResourceAssessmentResults.choiceId,
          userId: ResourceAssessmentResults.userId,
          answeredAt: ResourceAssessmentResults.answeredAt,
          questionScore: ResourceAssessmentQuestions.score,
          isCorrect: ResourceAssessmentOptions.isCorrect,
        })
        .from(ResourceAssessmentResults)
        .innerJoin(
          ResourceAssessmentQuestions,
          eq(ResourceAssessmentResults.questionId, ResourceAssessmentQuestions.id)
        )
        .innerJoin(
          ResourceAssessmentOptions,
          eq(ResourceAssessmentResults.choiceId, ResourceAssessmentOptions.id)
        )
        .where(eq(ResourceAssessmentResults.choiceId, optionIds));
  
      const transformedResults = allResults.map((result) => ({
        id: result.id,
        questionId: result.questionId,
        choiceId: result.choiceId,
        score: result.isCorrect ? result.questionScore : 0, 
        isCorrect: result.isCorrect,
      }));
  
      const totalQuestions = transformedResults.length;
      const totalSuccessScore = transformedResults
        .filter((result) => result.isCorrect)
        .reduce((sum, result) => sum + result.score, 0);
      const totalScore = transformedResults.reduce((sum, result) => sum + result.score, 0);
  
      const responseData = {
        results: transformedResults,
        totalSuccessScore,
        totalScore,
        totalQuestions,
      };
    
      return sendResponse(200, responseData, "Results returned successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Internal Server Error";
      return sendResponse(500, null, message);
    }
  };