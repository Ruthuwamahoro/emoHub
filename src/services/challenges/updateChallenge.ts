import axios from "axios";
import { CreateChallengeData } from "./postChallenge";

export const UpdateChallenge = async (id: string, data: CreateChallengeData) => {
  try {
    const response = await axios.patch(`/api/challenges/${id}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }
};