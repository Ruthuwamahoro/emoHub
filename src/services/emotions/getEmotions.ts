import axios from "axios";

export const getEmotions = async() => {
    try {
        const response = await axios.get(`/api/emotions`)
        console.log("you are",response.data);
        return response.data
        
    } catch (error) {
        console.log(error);
        throw error;
    }
}