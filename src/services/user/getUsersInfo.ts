import axios from "axios";

export const getAllUsers = async () => {
    try {
        const response = await axios.get('/api/users');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch users:", error);
        throw error;
    }
}