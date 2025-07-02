import axios from "axios";

export const getReflectionsSummary = async () => {
    try {
        const response = await axios.get('/api/reflectionoverview');
        console.log("response", response.data);
        return response.data;
    } catch (error) {
        throw error;
    }
}