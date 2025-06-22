import axios from "axios";

export const getAllEmotionsInputs = async() => {
    try {
        const response = await axios.get(`/api/emotions/all`)
        return response.data
        
    } catch (error) {
        throw error;
    }
}