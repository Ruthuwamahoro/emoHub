import { QuestionInput } from "@/hooks/users/resources/assessment/useCreateAssessment";
import axios from "axios";

export const createAssessment = async(id: string,data: QuestionInput) => {
    try {
        const response = await axios.post(`/api/learning-resources/${id}/assessment`, data)
        console.log(response.data);
        return response.data
        
    } catch (error) {
        console.log(error);
        return error;
    }
}