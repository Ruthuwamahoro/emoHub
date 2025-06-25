import axios from "axios";

export const getAllMembers = async(id: string) => {
    try {
        const allmembers = await axios.get(`/api/groups/${id}/members`)
        console.log("all members", allmembers.data);
        return allmembers.data;
    } catch (error) {
        return error;
    }
}