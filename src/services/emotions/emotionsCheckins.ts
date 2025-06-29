import { Emotion } from "@/types/emotions";
import axios from "axios";

export const createEmotions = async(data: Emotion) => {
    try {
        const response = await axios.post(`/api/emotions`, data)
        return response.data
        
    } catch (error) {
        throw error;
    }
}