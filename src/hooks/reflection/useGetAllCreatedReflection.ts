import { getCreatedReflectionOfUser } from "@/services/reflection/getCreatedReflection";
import { useQuery } from "@tanstack/react-query";

export const usegetAllCreatedReflection = () => {
    const { data, isLoading, isPending, isFetching, error } = useQuery({
      queryKey: ["AllCreatedReflection"],
      queryFn: getCreatedReflectionOfUser,
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