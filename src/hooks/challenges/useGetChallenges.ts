import { getAllChallenges } from "@/services/challenges/getChallenges";
import { useQuery } from "@tanstack/react-query";

export const usegetChallenges = (groupId?: string) => {
    const { data, isLoading, isPending, isFetching } = useQuery({
      queryKey: ["Challenges", groupId],
      queryFn: () =>getAllChallenges(groupId),
    });

    return {
      data,
      isLoading,
      isPending,
      isFetching,
    };
};

