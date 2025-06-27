import axios from "axios"
export const getGroupsCategory= async() => {
    try{
        const response = await axios.get("/api/groups/categories");
        return response.data;
    } catch(err){
        return err
    }
}