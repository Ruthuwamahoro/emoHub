import axios from "axios";

export const UpdateGroup = async (id: string, data: any) => {
  try {
    const response = await axios.patch(`/api/groups/${id}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }
};