import axios from "axios";

export type CommentFormData = {
  id: string;
  content: string;
  ids?: string;
};

export type CommentLikesFormData = {
  id: string;
  commentId: string;
};

export const createComment = async ({ id,ids,content }: CommentFormData) => {
  try {
    const response = await axios.post(`/api/groups/${id}/posts/${ids}/comments`, { 
      content
    });
    console.log('API Call Response:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error;
    }
    throw error;
  }
};