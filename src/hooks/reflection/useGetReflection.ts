import { getReflection } from "@/services/reflection/getReflection";
import { useQuery } from "@tanstack/react-query";

export const usegetReflection = () => {
    const { data, isLoading, isPending, isFetching, error } = useQuery({
      queryKey: ["Reflection"],
      queryFn: getReflection,
      staleTime: 5 * 60 * 1000, 
      gcTime: 10 * 60 * 1000, 
      refetchOnWindowFocus: false,
      refetchOnMount: false,
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





