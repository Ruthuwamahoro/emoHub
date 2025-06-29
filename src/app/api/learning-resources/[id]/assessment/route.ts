import db from '@/server/db';
import { questionOptions, quizQuestions, quizzes } from '@/server/db/schema';
import { getUserIdFromSession } from '@/utils/getUserIdFromSession';
import { sendResponse } from '@/utils/Responses';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest,     {params}: {params: Promise<{id: string}>}
) {
  try {
    const { id: resourceId } = await params;
    const userId = await getUserIdFromSession();
    if (!userId) {
      return sendResponse(401, null, 'Unauthorized');
    }

    const body = await request.json();
    const { title, description, passingScore, maxAttempts, questions } = body;


    if (!resourceId || !title || !questions || questions.length === 0) {
      return sendResponse(400, null, 'Missing required fields');
    }

    const [quiz] = await db.insert(quizzes).values({
      resourceId,
      creatorId: userId,
      title,
      description,
      passingScore: passingScore || 70,
      maxAttempts,
    }).returning();

    try {
      for (let i = 0; i < questions.length; i++) {
        const questionData = questions[i];
        
        const [question] = await db.insert(quizQuestions).values({
          quizId: quiz.id,
          questionText: questionData.questionText,
          questionType: questionData.questionType,
          points: questionData.points || 1,
          orderIndex: i,
          explanation: questionData.explanation,
        }).returning();

        // Create options for the question
        if (questionData.options && questionData.options.length > 0) {
          const optionValues = questionData.options.map((option: any, optionIndex: number) => ({
            questionId: question.id,
            optionText: option.optionText,
            isCorrect: option.isCorrect,
            orderIndex: optionIndex,
          }));

          await db.insert(questionOptions).values(optionValues);
        }
      }

      return NextResponse.json({ success: true, quiz });
    } catch (questionError) {
      try {
        await db.delete(quizzes).where(eq(quizzes.id, quiz.id));
      } catch (cleanupError) {
        console.error('Failed to cleanup quiz after question creation error:', cleanupError);
      }
      throw questionError;
    }

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}