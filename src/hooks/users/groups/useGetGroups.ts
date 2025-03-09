import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetAllGroups = (userId?: string) => {
  return useQuery({
    queryKey: ["groups", userId],
    queryFn: async () => {
      const url = userId ? `/api/groups?userId=${userId}` : "/api/groups";
      const response = await axios.get(url);
      return response.data;
    },
  });
};
