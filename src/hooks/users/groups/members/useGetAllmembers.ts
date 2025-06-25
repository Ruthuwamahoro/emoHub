import { getAllMembers } from "@/services/user/groups/members/getMembers";
import { useQuery } from "@tanstack/react-query";

export const useAllMembersGroup = (id: string) => {
    const { data, isLoading, isPending, isFetching, error } = useQuery({
        queryKey: ["Members", id],
        queryFn: () => getAllMembers(id)
      });
    
      return {
        data,
        isLoading,
        isPending,
        isFetching,
        error,
      };
}