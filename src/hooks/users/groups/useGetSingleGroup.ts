import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetSingleGroup = (groupId: string) => {
  const { data, isPending } = useQuery({
    queryKey: ["group", groupId],
    queryFn: async () => {
      const response = await axios.get(`/api/groups/${groupId}`);
      return response.data;
    },
  });
  return { data, isPending };
};