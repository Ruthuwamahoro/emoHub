"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ThumbsUp, MoreHorizontal, Reply } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useCreateRepliesComment } from '@/hooks/users/groups/posts/comments/useCreateReplies';
import { Avatar as AvatarImages } from "@/utils/genderAvatar";
import type { CommentReply } from '@/services/user/groups/comments/getCommentReplies';

interface CommentRepliesProps {
  groupId: string;
  postId: string;
  commentId: string;
  commentAuthorName: string;
  commentReplies: any;
  initialRepliesCount?: number;
}

const CommentReplies: React.FC<CommentRepliesProps> = ({
  groupId,
  postId,
  commentId,
  commentAuthorName,
  commentReplies,
  initialRepliesCount = 0
}) => {
  const { data: session } = useSession();
  const [showReplies, setShowReplies] = useState(false);
  const [page, setPage] = useState(1);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  console.log("_________", commentReplies);

  // Create reply hook
  const {
    formData: replyFormData,
    setformData: setReplyFormData,
    isPending: isReplyPending,
    errors: replyErrors,
    handleSubmit: handleReplySubmit,
    handleInputField: handleReplyInputField
  } = useCreateRepliesComment(groupId);

  const replies = commentReplies || [];
  const totalCount = commentReplies?.length || initialRepliesCount;

  // Ensure replies are shown when starting to reply
  useEffect(() => {
    if (replyingTo === commentId && !showReplies) {
      setShowReplies(true);
    }
  }, [replyingTo, commentId, showReplies]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const getUserAvatar = (reply: CommentReply) => {
    if (reply.author.image) {
      return (
        <div className="relative">
          <img 
            src={reply.author.image} 
            alt={reply.author.name} 
            className="w-7 h-7 rounded-full object-cover ring-1 ring-white shadow-sm"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-400 border border-white rounded-full"></div>
        </div>
      );
    }
    return (
      <AvatarImages
        gender={reply.author.gender || 'other'} 
        name={reply.author.username || reply.author.name} 
        size={28}
      />
    );
  };

  const getCurrentUserAvatar = () => {
    if (session?.user?.profilePicUrl) {
      return (
        <div className="relative">
          <img 
            src={session.user.profilePicUrl}
            alt="Your avatar" 
            className="w-7 h-7 rounded-full object-cover ring-1 ring-blue-200 shadow-sm"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-blue-400 border border-white rounded-full"></div>
        </div>
      );
    }
    return (
      <AvatarImages
        gender={session?.user?.gender || 'other'} 
        name={session?.user?.username || 'You'} 
        size={28}
      />
    );
  };

  const getUserDisplayName = (reply: CommentReply) => {
    if (session?.user?.username === reply.author.username) {
      return "You";
    }
    return reply.author.name || 'Anonymous';
  };

  const toggleReplies = () => {
    setShowReplies(!showReplies);
    if (!showReplies) {
      setPage(1);
    }
  };

  const loadMoreReplies = () => {
    setPage(prev => prev + 1);
  };

  const submitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyFormData.commentReplies?.trim()) return;

    try {
      await handleReplySubmit(groupId, postId, commentId);
      setReplyingTo(null);
      setReplyFormData({ commentReplies: '' });
    } catch (error) {
      console.error('Reply submission error:', error);
    }
  };

  const startReply = () => {
    console.log('Starting reply for commentId:', commentId);
    setReplyingTo(commentId);
    // Always show replies when starting to reply
    setShowReplies(true);
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyFormData({ commentReplies: '' });
  };

  // Debug logging
  console.log('Render state:', {
    commentId,
    replyingTo,
    showReplies,
    shouldShowTextarea: replyingTo === commentId
  });

  if (totalCount === 0) {
    return (
      <div className="ml-3 mt-2">
        <button
          onClick={startReply}
          className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-500 transition-colors duration-200"
        >
          <Reply className="w-3 h-3" />
          <span className="font-medium">Reply</span>
        </button>

        {/* Reply form for comments with no existing replies */}
        {replyingTo === commentId && (
          <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
            <form onSubmit={submitReply}>
              <div className="flex space-x-2">
                {getCurrentUserAvatar()}
                <div className="flex-1 relative">
                  <textarea
                    id="commentReplies"
                    name="commentReplies"
                    value={replyFormData.commentReplies || ''}
                    onChange={handleReplyInputField}
                    placeholder={`Reply to ${commentAuthorName}...`}
                    className="w-full p-2 pr-8 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-xs bg-white"
                    rows={2}
                    autoFocus
                  />
                  {replyErrors.commentReplies && (
                    <p className="text-red-500 text-xs mt-1">{replyErrors.commentReplies}</p>
                  )}
                  <div className="flex items-center justify-end space-x-2 mt-2">
                    <button
                      type="button"
                      onClick={cancelReply}
                      className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!replyFormData.commentReplies?.trim() || isReplyPending}
                      className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {isReplyPending ? 'Replying...' : 'Reply'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="ml-3 mt-2">
      {/* Toggle Replies Button */}
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleReplies}
          className="flex items-center space-x-2 text-xs text-gray-600 hover:text-blue-600 transition-colors duration-200"
        >
          {showReplies ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
          <span className="font-medium">
            {totalCount} {totalCount === 1 ? 'reply' : 'replies'}
          </span>
        </button>
        
        <button
          onClick={startReply}
          className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-500 transition-colors duration-200"
        >
          <Reply className="w-3 h-3" />
          <span className="font-medium">Reply</span>
        </button>
      </div>

      {/* Replies List */}
      {showReplies && (
        <div className="mt-3 space-y-3 animate-in slide-in-from-top-2 duration-200">
          {replies.map((reply: any) => (
            <div key={reply.id} className="flex space-x-2">
              {getUserAvatar(reply)}
              <div className="flex-1 min-w-0">
                <div className="bg-gray-50 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-xs text-gray-900 truncate">
                      {getUserDisplayName(reply)}
                    </span>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {formatDate(reply.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-800 text-xs leading-relaxed break-words">
                    {reply.commentReplies}
                  </p>
                </div>

                <div className="flex items-center mt-1 ml-3 space-x-3">
                  <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-black transition-colors duration-200">
                    <ThumbsUp className="w-2.5 h-2.5" />
                    <span className="font-medium">{reply.likesCount || 0}</span>
                  </button>
                  <button className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all duration-200">
                    <MoreHorizontal className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Reply Form */}
          {replyingTo === commentId && (
            <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
              <form onSubmit={submitReply}>
                <div className="flex space-x-2">
                  {getCurrentUserAvatar()}
                  <div className="flex-1 relative">
                    <textarea
                      id="commentReplies"
                      name="commentReplies"
                      value={replyFormData.commentReplies || ''}
                      onChange={handleReplyInputField}
                      placeholder={`Reply to ${commentAuthorName}...`}
                      className="w-full p-2 pr-8 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-xs bg-white"
                      rows={2}
                      autoFocus
                    />
                    {replyErrors.commentReplies && (
                      <p className="text-red-500 text-xs mt-1">{replyErrors.commentReplies}</p>
                    )}
                    <div className="flex items-center justify-end space-x-2 mt-2">
                      <button
                        type="button"
                        onClick={cancelReply}
                        className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!replyFormData.commentReplies?.trim() || isReplyPending}
                        className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        {isReplyPending ? 'Replying...' : 'Reply'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentReplies;