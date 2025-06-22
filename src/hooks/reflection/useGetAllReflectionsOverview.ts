import { getReflectionsSummary } from "@/services/reflection/getAllReflectionSummary";
import { useQuery } from "@tanstack/react-query";

export const usegetReflectionsSummary = () => {
    const { data, isLoading, isPending, isFetching, error } = useQuery({
      queryKey: ["ReflectionsSummary"],
      queryFn: getReflectionsSummary,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      refetchOnMount: false, // Prevent refetch on component mount
      refetchOnReconnect: true,
      retry: 1,
    });

    
  
    return {
      data,
      isLoading,
      isPending,
      isFetching,
      error,
    };
  };