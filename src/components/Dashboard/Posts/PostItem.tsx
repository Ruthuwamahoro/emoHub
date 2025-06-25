"use client";

import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, ExternalLink, Send, MoreHorizontal, Bookmark, Eye, Play, X, ChevronDown, Reply, ThumbsUp } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Post } from '@/types/posts';
import { useCreateComment } from '@/hooks/users/groups/posts/comments/usePostComments';
import { useParams } from 'next/navigation';
import { Avatar as AvatarImages } from "@/utils/genderAvatar";
import { useCommentLikes } from '@/hooks/users/groups/posts/comments/usePostCommentLikes';
import { usePostLikes } from '@/hooks/users/groups/posts/comments/usePostLikes';
import CommentReplies from './CommentReplies';

interface PostItemProps {
  post: Post;
}

interface Comment {
  id: string | number;
  content: string;
  author: {
    id?: string;
    name: string;
    username?: string;
    image?: string;
    gender?: string;
  };
  createdAt: string;
  likes?: number;
  likesCount?: number;
  isLiked?: boolean;
  repliesCount?: number;
  replies?: any[]; // Add replies to the interface
}

const PostItem: React.FC<{ post: any }> = ({ post }) => {
  const { data: session } = useSession();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [displayedComments, setDisplayedComments] = useState<Comment[]>([]);
  const [commentsPage, setCommentsPage] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const params = useParams();
  const groupId = params?.id as string;

  const COMMENTS_PER_PAGE = 3;

  const {
    mutate,
    formData,
    setFormData,
    isPending,
    errors,
    setErrors,
    handleSubmit,
    handleInputField
  } = useCreateComment(groupId);

  const { toggleCommentLike, isPending: isLikePending } = useCommentLikes();
  const { togglePostLike, isPending: isPostLikePending } = usePostLikes();

  useEffect(() => {
    if (post.comments && Array.isArray(post.comments)) {
      const formattedComments: Comment[] = post.comments.map((comment: any) => ({
        id: comment.id,
        content: comment.content,
        author: {
          id: comment.author?.id,
          name: comment.author?.name || 'Anonymous',
          username: comment.author?.username,
          image: comment.author?.image,
          gender: comment.author?.gender || 'other'
        },
        createdAt: comment.createdAt,
        likes: comment.likes || 0,
        likesCount: comment.likesCount || comment.likes || 0,
        isLiked: comment.isLiked || false,
        repliesCount: comment.repliesCount || 0,
        replies: comment.replies || [] // Map the replies properly
      }));
      setComments(formattedComments);
      setDisplayedComments(formattedComments.slice(0, COMMENTS_PER_PAGE));
    }
  }, [post.comments]);

  const loadMoreComments = () => {
    if (isLoadingMore) return;
    
    setIsLoadingMore(true);
    
    setTimeout(() => {
      const nextPage = commentsPage + 1;
      const startIndex = nextPage * COMMENTS_PER_PAGE;
      const endIndex = startIndex + COMMENTS_PER_PAGE;
      const moreComments = comments.slice(startIndex, endIndex);
      
      if (moreComments.length > 0) {
        setDisplayedComments(prev => [...prev, ...moreComments]);
        setCommentsPage(nextPage);
      }
      setIsLoadingMore(false);
    }, 800);
  };

  const getUserAvatar = () => {
    if (post.author?.image) {
      return (
        <div className="relative">
          <img 
            src={post.author.image}
            alt={post.author?.username || 'User'} 
            className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-lg"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
        </div>
      );
    }

    return (
        <AvatarImages
        gender={post.author?.gender || 'other'} 
        name={post.author?.username || 'Anonymous'} 
        />
    );
  };

  const getUserDisplayName = () => {
    if (session?.user?.username === post.author?.username) {
      return "You";
    }
    return post.author?.name || 'Anonymous User';
  };

  const getCurrentUserAvatar = () => {
    if (session?.user?.profilePicUrl) {
      return (
        <div className="relative">
          <img 
            src={session.user.profilePicUrl}
            alt="Your avatar" 
            className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-200 shadow-sm"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-blue-400 border-2 border-white rounded-full"></div>
        </div>
      );
    }
    return (
        <AvatarImages
        gender={session?.user?.gender || 'other'} 
        name={session?.user?.username || 'You'} 
        size={36}
        />
    );
  };

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

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content?.trim()) return;

    try {
      await handleSubmit(post.id, groupId);
      const newComment: Comment = {
        id: Date.now(),
        content: formData.content,
        author: {
          name: session?.user?.fullName || "You",
          username: session?.user?.username,
          image: session?.user?.profilePicUrl,
          gender: session?.user?.gender || 'other'
        },
        createdAt: new Date().toISOString(),
        likes: 0,
        likesCount: 0,
        isLiked: false,
        repliesCount: 0,
        replies: [] // Initialize empty replies array
      };
      
      setComments(prev => [newComment, ...prev]);
      setDisplayedComments(prev => [newComment, ...prev.slice(0, COMMENTS_PER_PAGE - 1)]);
      setFormData({ content: '' });
    } catch (error) {
      return error;
    }
  };

  const handlePostLike = () => {
    if (isPostLikePending) return;
    togglePostLike(groupId, post.id);
  };

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const handleCommentLike = (commentId: string | number) => {
    const commentIdStr = commentId.toString();
    toggleCommentLike(commentIdStr, groupId, post.id);
  };

  const getCommentUserAvatar = (comment: Comment) => {
    if (comment.author.image) {
      return (
        <div className="relative">
          <img 
            src={comment.author.image} 
            alt={comment.author.name} 
            className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></div>
        </div>
      );
    }
    return (
        <AvatarImages
        gender={comment.author.gender || 'other'} 
        name={comment.author?.username || comment.author.name} 
        size={48}
        />
    );
  };

  const getCommentUserDisplayName = (comment: Comment) => {
    if (session?.user?.username === comment.author.username) {
      return "You";
    }
    return comment.author.name || 'Anonymous';
  };

  // Callback to refresh comments when a reply is added
  const handleReplyAdded = () => {
    // You can implement logic here to refresh comments if needed
    // For now, this is a placeholder for future implementation
    console.log('Reply added, refreshing comments...');
  };

  const renderPostContent = () => {
    switch (post.contentType) {
      case 'image':
        return (
          <div className="mt-3 group relative overflow-hidden rounded-xl">
            <img 
              src={post.mediaUrl || '/api/placeholder/600/300'} 
              alt={post.mediaAlt || 'Post image'} 
              className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        );
        
      case 'video':
        return (
          <div className="mt-3 relative group rounded-xl overflow-hidden">
            <video 
              src={post.mediaUrl} 
              controls 
              className="w-full h-52 object-cover"
              poster="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=300&fit=crop"
            />
            <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs flex items-center font-medium shadow-lg">
              <Play className="w-3 h-3 mr-1.5" />
              Video
            </div>
          </div>
        );
        
      case 'link':
        return (
          <div className="mt-3">
            <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg transition-all duration-300">
              <a 
                href={post.linkUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block"
              >
                <div className="flex">
                  {post.linkPreviewImage && (
                    <div className="w-24 h-24 flex-shrink-0">
                      <img 
                        src={post.linkPreviewImage} 
                        alt="Link preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-4">
                    <div className="flex items-center text-blue-600 text-xs font-semibold mb-2">
                      {post.linkUrl?.replace(/^https?:\/\//, '').split('/')[0]}
                      <ExternalLink className="ml-1.5 w-3 h-3" />
                    </div>
                    {post.linkDescription && (
                      <p className="text-gray-700 text-sm line-clamp-2 leading-relaxed">{post.linkDescription}</p>
                    )}
                  </div>
                </div>
              </a>
            </div>
            {post.textContent && (
              <p className="text-gray-800 mt-3 text-sm leading-relaxed line-clamp-3">{post.textContent}</p>
            )}
          </div>
        );
        
      case 'text':
        return (
          <div className="mt-3">
            <p className="text-gray-800 text-sm leading-relaxed line-clamp-6 whitespace-pre-wrap">{post.textContent}</p>
          </div>
        );
        
      default:
        return null;
    }
  };

  const hasMoreComments = displayedComments.length < comments.length;

  return (
    <div className="relative w-full max-w-3xl">
      {/* Main Post Card */}
      <article className={`rounded-2xl shadow-md border overflow-hidden hover:shadow-lg transition-all duration-300 w-full`}>
        {/* Post Header */}
        <div className="p-5 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getUserAvatar()}
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">{getUserDisplayName()}</h4>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{formatDate(post.createdAt)}</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <div className="flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    <span>{formatCount(post.views || 0)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={toggleBookmark}
                className={`p-2 rounded-full hover:bg-yellow-50 transition-all duration-200 ${bookmarked ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:text-yellow-500'}`}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-all duration-200">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Post Title */}
        {post.title && (
          <div className="px-5 pb-2">
            <h3 className="font-semibold text-gray-900 text-base leading-tight">{post.title}</h3>
          </div>
        )}

        {/* Post Content */}
        <div className="px-5 pb-3">
          {renderPostContent()}
        </div>

        {/* Post Actions */}
        <div className={`px-5 py-3 border-t transition-all duration-300`}>
          <div className="flex items-center space-x-6">
            <button
              onClick={handlePostLike}
              disabled={isPostLikePending}
              className={`flex items-center space-x-2 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed ${
                post.isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 transition-all duration-200 group-hover:scale-110 ${
                post.isLiked ? 'fill-current' : ''
              } ${isPostLikePending ? 'animate-pulse' : ''}`} />
              <span className="text-sm font-medium">{formatCount(post.likes || 0)}</span>
            </button>
            <button
              onClick={toggleComments}
              className={`flex items-center space-x-2 transition-all duration-200 group ${
                showComments ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              <MessageCircle className="w-4 h-4 transition-all duration-200 group-hover:scale-110" />
              <span className="text-sm font-medium">{formatCount(comments.length)}</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-all duration-200 group">
              <Share2 className="w-4 h-4 transition-all duration-200 group-hover:scale-110" />
              <span className="text-sm font-medium">{formatCount(post.shares || 0)}</span>
            </button>
          </div>
        </div>
      </article>

      {/* Comments Panel */}
      {showComments && (
        <div className="absolute top-0 left-full ml-4 w-96 bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col max-h-[calc(100vh-120px)] z-10">
          {/* Comments Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
            <div>
              <h3 className="font-semibold text-gray-900 text-base">Comments</h3>
              <p className="text-xs text-gray-500">{comments.length} comments</p>
            </div>
            <button
              onClick={() => setShowComments(false)}
              className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Comment Input */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex space-x-3">
              {getCurrentUserAvatar()}
              <div className="flex-1 relative">
                <textarea
                  value={formData.content || ''}
                  name="content"
                  id="content"
                  onChange={handleInputField}
                  placeholder="Add a comment..."
                  className="w-full p-3 pr-10 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-gray-50 focus:bg-white"
                  rows={2}
                />
                <button
                  onClick={submitComment}
                  disabled={!formData.content?.trim() || isPending}
                  className="absolute bottom-2 right-2 p-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto">
            {displayedComments.map((comment, index) => (
              <div key={comment.id} className="group p-4 border-b border-gray-50 last:border-b-0">
                <div className="flex space-x-3">
                  {getCommentUserAvatar(comment)}
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-50 rounded-xl px-3 py-2.5 hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm text-gray-900 truncate">
                          {getCommentUserDisplayName(comment)}
                        </span>
                        <span className="text-xs text-gray-500 flex-shrink-0">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-800 text-sm leading-relaxed break-words">{comment.content}</p>
                    </div>

                    {/* Comment Actions */}
                    <div className="flex items-center mt-2 ml-3 space-x-4">
                      <button
                        onClick={() => handleCommentLike(comment.id)}
                        disabled={isLikePending}
                        className={`flex items-center space-x-1 text-xs transition-all duration-200 disabled:opacity-50 px-2 py-1 rounded-full ${
                          comment.isLiked 
                            ? 'text-white bg-black hover:bg-gray-800' 
                            : 'text-gray-500 hover:text-black hover:bg-gray-100'
                        }`}
                      >
                        <ThumbsUp className={`w-3 h-3 ${comment.isLiked ? 'fill-current' : ''} ${isLikePending ? 'animate-pulse' : ''}`} />
                        <span className="font-medium">{comment.likesCount || comment.likes || 0}</span>
                      </button>
                    </div>

                    {/* CommentReplies Component - Fixed props */}
                    <CommentReplies
                      groupId={groupId}
                      postId={post.id}
                      commentReplies={comment.replies || []} // Pass the actual comment replies
                      commentId={comment.id.toString()}
                      commentAuthorName={getCommentUserDisplayName(comment)}
                      initialRepliesCount={comment.repliesCount || (comment.replies?.length || 0)}
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Load More Comments */}
            {hasMoreComments && (
              <div className="p-4 text-center">
                <button
                  onClick={loadMoreComments}
                  disabled={isLoadingMore}
                  className="text-sm text-blue-500 hover:text-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingMore ? 'Loading...' : 'Load more comments'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostItem;