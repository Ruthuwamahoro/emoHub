import { getAllUsers } from "@/services/user/getUsersInfo";
import { useQuery } from "@tanstack/react-query";

export const usegetAllUsers = () => {
    const { data, isLoading, isPending, isFetching, error } = useQuery({
      queryKey: ["Users"],
      queryFn: getAllUsers,
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