import axios from "axios";

export const getChallenges = async(groupId: string) => {
    try {
        const response = await axios.get(`/api/groups/${groupId}/challenges`);
        return response.data;
    } catch (error) {
        return error;
    }
}