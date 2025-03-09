import axios from "axios";
export const joinGroup = async (data: any) => {
    try {
        const response = await axios.post("/api/groups/join", data);
        return response.data;
    } catch (err) {
        return err;
    }
}