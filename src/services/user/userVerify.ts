import axios from "axios";

export const userVerify = async (token: string) => {
  try {
    const response = await axios.post(`/api/verify-email?token=${token}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Verification failed");
    }
    throw new Error("An unexpected error occurred");
  }
};