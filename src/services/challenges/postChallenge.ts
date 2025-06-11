import axios from "axios";

export interface CreateChallengeData {
  weekNumber: string;
  startDate: string;
  endDate: string;
  theme: string;
}

export const AddChallenge = async (data: CreateChallengeData) => {
  try {
    const response = await axios.post('/api/challenges', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }
};