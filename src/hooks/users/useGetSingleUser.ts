import { getUserById } from "@/services/user/profile";
import { useQuery } from "@tanstack/react-query";

export const useGetUserById = (id: string) => {
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