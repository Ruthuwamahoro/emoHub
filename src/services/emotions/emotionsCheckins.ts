import { Emotion } from "@/types/emotions";
import axios from "axios";

export const createEmotions = async(data: Emotion) => {
    try {
        const response = await axios.post(`/api/emotions`, data)
        console.log(response.data);
        return response.data
        
    } catch (error) {
        console.log(error);
        throw error;
    }
}