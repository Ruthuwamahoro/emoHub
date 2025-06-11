import axios from "axios";

export interface CreateChallengeData {
  weekNumber: string;
  startDate: string;
  endDate: string;
  theme: string;
}

export const AddChallenge = async (data: CreateChallengeData) => {
  try {
    console.log('Service: Sending data to API:', data);
    const response = await axios.post('/api/challenges', data);
    console.log('Service: API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Service: API error:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }
};