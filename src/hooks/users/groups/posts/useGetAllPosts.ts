import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Post {
  id: string;
  userId: string;
  groupId: string;
  title: string;
  contentType: "text" | "image" | "video" | "audio" | "link";
  textContent?: string;
  mediaUrl?: string;
  mediaAlt?: string;
  linkUrl?: string;
  linkDescription?: string;
  linkPreviewImage?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    image?: string;
  };
}

export const useGetPosts = (groupId: string) => {
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["Posts", groupId],
    queryFn: async () => {
      const response = await axios.get(`/api/groups/${groupId}/posts`);
      return response.data;
    },
  });

  return {
    posts: data?.data || [],
    isPending,
    error,
    refetch
  };
};