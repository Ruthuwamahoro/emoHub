import axios from "axios";

export const createResponseReflection = async(id: string, data: {
    response: string;
}) => {
    try {
        const response = await axios.post(`/api/reflection/${id}/response`, data);

        return response.data;
    } catch (error) {
        console.error("Failed to provide response:", error);
        throw error;
    }
}