import axios from "axios";

export const getChallengeQuestion = async({group_id, challengeId}: {group_id: string; challengeId: string}) => {
    try {
        const response = await axios.get(`/api/groups/${group_id}/challenges/${challengeId}/elements`);
        return response.data;
        
    } catch (error) {
        return error;  
    }
}