import axios from "axios";

export const getReflectionsSummary = async () => {
    try {
        const response = await axios.get('/api/reflectionoverview');

        return response.data;
    } catch (error) {
        throw error;
    }
}