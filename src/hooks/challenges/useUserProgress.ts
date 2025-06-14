import { getUserProgress, UserProgressResponse } from '@/services/challenges/challengeProgressService';
import { useQuery } from '@tanstack/react-query';

export const useUserProgress = () => {
    return useQuery<UserProgressResponse, Error>({
      queryKey: ['user-progress'],
      queryFn: getUserProgress,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
    });
  };