import { getReflectionsSummary } from "@/services/reflection/getAllReflectionSummary";
import { useQuery } from "@tanstack/react-query";

export const usegetReflectionsSummary = () => {
    const { data, isLoading, isPending, isFetching, error } = useQuery({
      queryKey: ["ReflectionsSummary"],
      queryFn: getReflectionsSummary,
      staleTime: 0,
      gcTime: 10 * 60 * 1000, 
      refetchOnWindowFocus: true,      
      refetchOnMount: true,
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