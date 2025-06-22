import { getEmotions } from "@/services/emotions/getEmotions";
import { useQuery } from "@tanstack/react-query";

export const usegetEmotions = () => {
    const { data, isLoading, isPending, isFetching } = useQuery({
      queryKey: ["Emotions"],
      queryFn: () =>getEmotions(),
    });

    return {
      data,
      isLoading,
      isPending,
      isFetching,
    };
};

