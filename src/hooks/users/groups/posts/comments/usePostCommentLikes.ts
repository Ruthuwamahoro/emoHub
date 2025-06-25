import { useMutation, useQueryClient } from '@tanstack/react-query';
import showToast from '@/utils/showToast';
import { createCommentLikes } from '@/services/user/groups/comments/postCommentsLikes';

interface CommentLikeData {
  commentId: string;
  groupId: string;
  postId: string;
  isLiked?: boolean;
  likesCount?: number;
}

interface CommentMutationParams {
  commentId: string;
  groupId: string;
  postId: string;
}

export const useCommentLikes = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ commentId, groupId, postId }: CommentMutationParams) => {
      return createCommentLikes({
        id: groupId,
        ids: postId,
        commentId
      });
    },

    onMutate: async ({ commentId, groupId, postId }) => {
      await queryClient.cancelQueries({
        queryKey: ["Posts", groupId, postId]
      });

      const previousData = queryClient.getQueryData(["Posts", groupId, postId]);

      queryClient.setQueryData(["Posts", groupId, postId], (old: any) => {
        if (!old?.data?.posts) return old;

        return {
          ...old,
          data: {
            ...old.data,
            posts: old.data.posts.map((post: any) => ({
              ...post,
              comments: post.comments?.map((comment: any) => {
                if (comment.id === commentId) {
                  const currentLiked = comment.isLiked || false;
                  const currentCount = comment.likesCount || 0;
                  
                  return {
                    ...comment,
                    isLiked: !currentLiked,
                    likesCount: currentLiked ? currentCount - 1 : currentCount + 1
                  };
                }
                return comment;
              }) || []
            }))
          }
        };
      });

      return { previousData, commentId, groupId, postId };
    },

    onSuccess: (response, variables) => {
      queryClient.setQueryData(["Posts", variables.groupId, variables.postId], (old: any) => {
        if (!old?.data?.posts) return old;

        return {
          ...old,
          data: {
            ...old.data,
            posts: old.data.posts.map((post: any) => ({
              ...post,
              comments: post.comments?.map((comment: any) => {
                if (comment.id === variables.commentId) {
                  return {
                    ...comment,
                    isLiked: response.data.liked,

                  };
                }
                return comment;
              }) || []
            }))
          }
        };
      });

      queryClient.invalidateQueries({
        queryKey: ["Posts", variables.groupId, variables.postId]
      });
      queryClient.invalidateQueries({ 
        queryKey: ['Posts'] 
    });
    },

    onError: (error: any, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["Posts", context.groupId, context.postId], 
          context.previousData
        );
      }

      const errorMessage = error?.response?.data?.message ||
        error?.message ||
        'Failed to update like. Please try again.';
      
      showToast(errorMessage, 'error');
      console.error('Comment like error:', error);
    },

    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["Posts", variables.groupId, variables.postId]
      });
    },
  });

  const toggleCommentLike = (commentId: string, groupId: string, postId: string) => {
    console.log('👆 toggleCommentLike called with:', { commentId, groupId, postId });
    mutate({ commentId, groupId, postId });
  };
  

  return {
    toggleCommentLike,
    isPending
  };
};