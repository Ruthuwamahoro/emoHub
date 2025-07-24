import { updateElementProgress, UpdateElementProgressRequest, UpdateElementProgressResponse } from '@/services/challenges/challengeProgressService';
import showToast from '@/utils/showToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateElementProgressMutationParams {
  challengeId: string;
  data: UpdateElementProgressRequest;
}

export const useUpdateElementProgress = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateElementProgressResponse,
    Error,
    UpdateElementProgressMutationParams
  >({
    mutationFn: ({ challengeId, data }) => updateElementProgress(challengeId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['Challenges', variables.challengeId] });
      queryClient.invalidateQueries({ queryKey: ['Challenges'] });
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
      
      const message = data.completed 
        ? 'Challenge element completed!' 
        : 'Challenge element marked as incomplete';
      showToast(message, 'success');
      
      queryClient.setQueryData(['challenges'], (oldData: any) => {
        if (!oldData?.data) return oldData;
        
        return {
          ...oldData,
          data: oldData.data.map((challenge: any) => {
            if (challenge.id === variables.challengeId) {
              return {
                ...challenge,
                challenges: challenge.challenges.map((element: any) => {
                  if (element.id === data.elementId) {
                    return {
                      ...element,
                      completed: data.completed
                    };
                  }
                  return element;
                }),
                total_elements: data.challengeStats.total,
                completed_elements: data.challengeStats.completed,
                completed_percentage: data.challengeStats.percentage,
                is_week_completed: data.challengeStats.isCompleted
              };
            }
            return challenge;
          })
        };
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update challenge progress. Please try again.';
      showToast(errorMessage, 'error')
    },
  });
};