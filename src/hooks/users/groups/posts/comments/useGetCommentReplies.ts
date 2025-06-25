import { useQuery } from "@tanstack/react-query";
import { getCommentReplies, type CommentReply } from "@/services/user/groups/comments/getCommentReplies";

export const useGetCommentReplies = (
  groupId: string,
  postId: string,
  commentId: string,
  options?: {
    page?: number;
    limit?: number;
    enabled?: boolean;
  }
) => {
  const { page = 1, limit = 10, enabled = true } = options || {};

  return useQuery({
    queryKey: ['commentReplies', groupId, postId, commentId, page, limit],
    queryFn: () => getCommentReplies({
      groupId,
      postId,
      commentId,
      page,
      limit
    }),
    enabled: enabled && !!groupId && !!postId && !!commentId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};