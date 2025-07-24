import axios from "axios";

export const getAllResourcesTags = async() => {
    try {
        const response = await axios.get(`/api/tags/resources`);
        return response.data
        
    } catch (error) {
        throw error;
    }
}