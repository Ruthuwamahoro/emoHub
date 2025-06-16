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
      }[];
    }[];
  }) => {
    try {
        const response = await axios.post(`/api/learning-resources/${id}/assessment`, quizData)
        console.log(response.data);
        return response.data
        
    } catch (error) {
        console.log(error);
        return error;
    }
}