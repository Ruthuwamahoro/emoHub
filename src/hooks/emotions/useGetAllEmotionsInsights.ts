import { getAllEmotionsInputs } from "@/services/emotions/getAllEmotions";
import { useQuery } from "@tanstack/react-query";

export const useGetAllEmotionsInputs = () => {
    const { data, isLoading, isPending, isFetching } = useQuery({
      queryKey: ["AllEmotions"],
      queryFn: () =>getAllEmotionsInputs(),
    });

    return {
      data,
      isLoading,
      isPending,
      isFetching,
    };
};

