import { createPostsInterface } from "@/types/posts";
import axios from "axios";

export const createPostsService = async({
  data, 
  groupId
} : {
  data: FormData, 
  groupId: string 
}) => {
  try {
    const response = await axios.post(
      `/api/groups/${groupId}/posts`, 
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  } catch (error) {
    const err = error instanceof Error ? error.message : "Unexpected error occurred";
    throw new Error(err);
  }
};