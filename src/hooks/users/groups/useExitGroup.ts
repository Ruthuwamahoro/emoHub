import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


export const useExitGroup = () => {
    const queryClient = useQueryClient();
  
    const mutation = useMutation({
      mutationFn: async (group_id: string) => {
        const response = await axios.post("/api/groups/exit", { group_id });
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['groups'] });
      },
      onError: (error) => {
        console.error("Failed to exit group", error);
      }
    });
  
    return {
      exitGroup: mutation.mutate, // Properly typed mutation method
      isPending: mutation.isPending,
      error: mutation.error
    };
  };