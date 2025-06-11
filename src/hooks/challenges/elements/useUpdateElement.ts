import { UpdateElementChallenge } from "@/services/challenges/questions/updateElement";
import showToast from "@/utils/showToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateElementChallenge = () => {
  const queryClient = useQueryClient();
  
  const { mutate, isPending } = useMutation({
    mutationFn: ({ id,ids, data }: { id: string; ids: string ;data: any }) => UpdateElementChallenge(id,ids, data),
    onSuccess: (response) => {
      console.log('Challenge updated successfully:', response);
      showToast(response.message || "Challenge updated successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["Challenges"] });
    },
    onError: (err: unknown) => {
      const error = err as Error;
      const errorMessage = error.message || "An error occurred while updating the challenge";
      showToast(errorMessage, "error");
    }
  });

  return { mutate, isPending };
};
