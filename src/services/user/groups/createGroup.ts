import axios from "axios";

export const createGroup= async(data: {
    categoryId: string,
    name: string,
    description: string,
    image: string
})=> {
    try {
        const response = await axios.post(`/api/groups`, data)
        return response.data;
    } catch (error) {
        return error;
    }
}