import axios from "axios"
export const getAllChallenges = async() => {
    try{
        const response = await axios.get("/api/challenges");
        return response.data;
    } catch(err){
        return err
    }
}