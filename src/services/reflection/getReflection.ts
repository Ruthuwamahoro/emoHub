import axios from "axios";

export const getReflection = async () => {
    try {
        const response = await axios.get(`/api/reflection`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch reflection:", error);
        throw error;
    }
}

