import { DeleteChallenge } from "@/services/challenges/deleteChallenge";
import showToast from "@/utils/showToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteChallenge = () => {
    const queryClient = useQueryClient();
    
    const { mutate, isPending } = useMutation({
      mutationFn: ({ id }: { id: string }) => DeleteChallenge(id),
      onSuccess: (response) => {
        console.log('Challenge deleted successfully:', response);
        showToast(response.message || "Challenge deleted successfully", "success");
        queryClient.invalidateQueries({ queryKey: ["Challenges"] });
      },
      onError: (err: unknown) => {
        const error = err as Error;
        const errorMessage = error.message || "An error occurred while deleting the challenge";
        showToast(errorMessage, "error");
      }
    });
  
    return { mutate, isPending };
  };