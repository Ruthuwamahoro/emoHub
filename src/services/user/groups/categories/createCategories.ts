import axios from "axios";

export const createCategories = async(data: {
    name: string,
    description: string
})=> {
    try {
        const response = await axios.post(`/api/groups/categories`, data)
        return response.data;
    } catch (error) {
        return error;
    }
}