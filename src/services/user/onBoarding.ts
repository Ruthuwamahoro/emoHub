import { userOnBoardingProfileInterface } from "@/types/user";
import axios from "axios";

export const onBoardingQuestions = async(data: userOnBoardingProfileInterface) => {
    try {
        const response = await axios.post(`/api/onboarding-questions`, data)
        return response.data
        
    } catch (error) {
        console.log(error);
        throw error;
    }
}