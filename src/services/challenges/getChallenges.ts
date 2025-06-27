import axios from "axios"
export const getAllChallenges = async(groupId?: string) => {
    try{
        const url = groupId ? `/api/challenges?groupId=${groupId}` : '/api/challenges';
        const response = await axios.get(url);
        return response.data;
    } catch(err){
        return err
    }
}