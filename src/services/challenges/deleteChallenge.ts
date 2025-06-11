import axios from "axios";

export const DeleteChallenge = async (id: string) => {
  try {
    const response = await axios.delete(`/api/challenges/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }
};