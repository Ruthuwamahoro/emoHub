import { getAllChallenges } from "@/services/challenges/getChallenges";
import { useQuery } from "@tanstack/react-query";

export const usegetChallenges = () => {
    const { data, isLoading, isPending, isFetching } = useQuery({
      queryKey: ["Challenges"],
      queryFn: () =>getAllChallenges(),
    });

    return {
      data,
      isLoading,
      isPending,
      isFetching,
    };
};

