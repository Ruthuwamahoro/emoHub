import axios from "axios"
export const getAllGroups = async() => {
    try{
        const response = await axios.get("/api/groups");
        return response.data;
    } catch(err){
        return err
    }
}