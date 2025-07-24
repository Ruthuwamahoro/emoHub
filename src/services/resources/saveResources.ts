import axios from "axios";

export const UpdateSavedResources = async (data: {
    resourceId: string,
    isSaved: boolean
}) => {
    try {
      const response = await axios.patch(`/api/saved`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  };