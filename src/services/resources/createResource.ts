import { LearningResource } from "@/types/resources";
import axios from "axios";

export const createResources = async(data: LearningResource) => {
    try {
        const response = await axios.post(`/api/learning-resources`, data)
        console.log(response.data);
        return response.data
        
    } catch (error) {
        console.log(error);
        throw error;
    }
}