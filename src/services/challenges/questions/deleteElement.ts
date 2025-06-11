import axios from "axios";

export interface CreateElementChallengeData {
  title: string;
  description: string;
  completed: boolean;
}

export const DeleteChallengeElement = async (id: string, ids: string) => {
    try {
      const response = await axios.delete(`/api/challenges/${id}/questions/${ids}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  };