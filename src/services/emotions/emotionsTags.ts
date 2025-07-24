import axios from "axios";

export const getAllEmotionsTags = async() => {
    try {
        const response = await axios.get(`/api/tags/checkins`);
        return response.data
        
    } catch (error) {
        throw error;
    }
}