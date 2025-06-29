import { Challenge } from "@/types/challenges";
import axios from "axios";

export const UpdateElementChallenge = async (id: string, ids: string, data: Challenge) => {
  try {
    const response = await axios.patch(`/api/challenges/${id}/questions/${ids}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }
};