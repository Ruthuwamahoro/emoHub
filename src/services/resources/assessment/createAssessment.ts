import { QuestionInput } from "@/hooks/users/resources/assessment/useCreateAssessment";
import axios from "axios";

export const createAssessment = async(id: string, quizData: {
    title: string;
    description?: string;
    passingScore?: number;
    maxAttempts?: number;
    questions: {
      questionText: string;
      questionType: 'multiple-choice' | 'true-false' | 'short-answer';
      points?: number;
      explanation?: string;
      options?: {
        optionText: string;
        isCorrect: boolean;
        orderIndex?: number;
      }[];
    }[];
  }) => {
    try {
        const response = await axios.post(`/api/learning-resources/${id}/assessment`, quizData)
        return response.data
        
    } catch (error) {
        return error;
    }
}