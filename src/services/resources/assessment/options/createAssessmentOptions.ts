import { QuestionInput } from "@/hooks/users/resources/assessment/useCreateAssessment";
import axios from "axios";

export const createAssessmentOptions = async(id: string,questionsId: string, data: QuestionInput) => {
    try {
        const response = await axios.post(`/api/learning-resources/${id}/assessment/questions/${questionsId}/options`, data)
        console.log(response.data);
        return response.data
        
    } catch (error) {
        console.log(error);
        return error;
    }
}