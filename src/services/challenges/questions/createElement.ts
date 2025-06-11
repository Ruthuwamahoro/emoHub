import axios from "axios";

export interface CreateElementChallengeData {
  title: string;
  description: string;
  completed: boolean;
}

export const CreateElement = async ({id, data}: {
    id: string;
    data: CreateElementChallengeData
}) => {
  try {
    const response = await axios.post(`/api/challenges/${id}/questions`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }
};