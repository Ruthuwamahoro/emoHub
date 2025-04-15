import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetChallenges = (groupId: string) => {
  return useQuery({
    queryKey: ["challenges", groupId],
    queryFn: async () => {
      const response = await axios.get(`/api/groups/${groupId}/challenges`);
      return response.data;
    },
    enabled: !!groupId,
  });
};
