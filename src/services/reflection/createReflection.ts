import axios from "axios";

export const createDailyReflection = async(data: {
    reflectionQuestion: string
}) => {
    try {
        const response = await axios.post('/api/reflection', data);
        return response.data;
    } catch(error){
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'An error occurred');
        }
        throw error;
    }
}