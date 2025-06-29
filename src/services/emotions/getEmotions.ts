import axios from "axios";

export const getEmotions = async() => {
    try {
        const response = await axios.get(`/api/emotions`)
        return response.data
        
    } catch (error) {
        throw error;
    }
}