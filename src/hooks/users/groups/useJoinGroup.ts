import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Join Group Hook
export const useJoinGroup = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: { group_id: string; user_id: string }) => {
      // Add logging to debug the values
      console.log("Joining group with data:", data);

      const response = await axios.post("/api/groups/join", {
        group_id: data.group_id,
        user_id: data.user_id,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: (error) => {
      console.error("Failed to join group", error);
    },
  });

  return {
    joinGroup: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};
