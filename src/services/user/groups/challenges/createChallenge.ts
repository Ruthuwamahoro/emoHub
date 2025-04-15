import axios from "axios";



export const createChallenges = async(data: CreateChallengesInterfaceAllInputs) => {
    try {

        const response = await axios.post(`/api/groups/${data.group_id}/challenges`, {
            ...data.challengesFields
        })

        return response.data;
        
    } catch (error) {
        return error
    }
}