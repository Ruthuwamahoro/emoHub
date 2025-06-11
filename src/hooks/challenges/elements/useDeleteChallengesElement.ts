import { DeleteChallengeElement } from "@/services/challenges/questions/deleteElement";
import showToast from "@/utils/showToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteChallengeElement = () => {
    const queryClient = useQueryClient();
    
    const { mutate, isPending } = useMutation({
      mutationFn: ({ challengeId, elementId }: { challengeId: string; elementId: string }) => 
        DeleteChallengeElement(challengeId, elementId),
      onSuccess: (response) => {
        console.log('Challenge element deleted successfully:', response);
        showToast(response.message || "Challenge element deleted successfully", "success");
        queryClient.invalidateQueries({ queryKey: ["Challenges"] });
      },
      onError: (err: unknown) => {
        const error = err as Error;
        const errorMessage = error.message || "An error occurred while deleting the challenge element";
        showToast(errorMessage, "error");
      }
    });
  
    return { mutate, isPending };
  };