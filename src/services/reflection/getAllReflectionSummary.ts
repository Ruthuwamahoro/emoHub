import axios from "axios";

export const getReflectionsSummary = async () => {
    try {
        const response = await axios.get('/api/reflectionoverview');
        console.log("++++++++++++++++++++++++++++", response.data)

        return response.data;
    } catch (error) {
        console.error("Failed to fetch reflection:", error);
        throw error;
    }
}