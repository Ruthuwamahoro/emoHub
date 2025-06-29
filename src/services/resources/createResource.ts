import { LearningResource } from "@/types/resources";
import axios from "axios";

export const createResources = async(data: LearningResource) => {
    try {
        const response = await axios.post(`/api/learning-resources`, data)
        return response.data
        
    } catch (error) {
        throw error;
    }
}