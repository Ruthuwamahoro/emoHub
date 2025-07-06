import { getUserById } from "@/services/user/profile";
import { useQuery } from "@tanstack/react-query";

export const useGetUserById = (id: string, p0: { enabled: any; staleTime: number; refetchOnWindowFocus: boolean; }) => {
    const { data, isLoading, isPending, isFetching } = useQuery({
        queryKey: ["users"],
        queryFn: () => getUserById(id),
      });
  
      return {
        data,
        isLoading,
        isPending,
        isFetching,
      };
    
}