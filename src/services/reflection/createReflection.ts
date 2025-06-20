import axios from "axios";

export const createDailyReflection = async(data: {
    reflectionQuestion: string
}) => {
    try {
        const response = await axios.post('/api/reflection', data);
        return response.data;
    } catch(error){
        return error;
    }
}