import axios from "axios";

export const getCreatedReflectionOfUser = async () => {
    try {
        const response = await axios.get(`/api/reflection/created`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

