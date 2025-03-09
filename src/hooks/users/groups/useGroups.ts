import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGroups = () => {
  return useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const response = await axios.get("/api/groups");
      return response.data;
    },
  });
};

export const useGroupMembers = (groupId: string) => {
  return useQuery({
    queryKey: ["group-members", groupId],
    queryFn: async () => {
      const response = await axios.get(`/api/groups/${groupId}/members`);
      return response.data;
    },
    enabled: !!groupId,
  });
};
