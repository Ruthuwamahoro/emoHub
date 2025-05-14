"use client";

import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { Post } from '@/hooks/users/groups/posts/useGetAllPosts';

interface PostItemProps {
  post: Post;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const renderPostContent = () => {
    switch (post.contentType) {
      case 'text':
        return (
          <div className="mt-4">
            <p className="text-gray-800 whitespace-pre-wrap">{post.textContent}</p>
          </div>
        );
        
      case 'image':
        return (
          <div className="mt-4">
            <div className="rounded-lg overflow-hidden">
              <Image 
                src={post.mediaUrl || '/api/placeholder/600/400'} 
                alt={post.mediaAlt || 'Post image'} 
                width={600} 
                height={400} 
                className="w-full object-cover"
              />
            </div>
            {post.mediaAlt && (
              <p className="text-sm text-gray-500 mt-2">{post.mediaAlt}</p>
            )}
          </div>
        );
        
      case 'video':
        return (
          <div className="mt-4">
            <div className="rounded-lg overflow-hidden">
              <video 
                src={post.mediaUrl} 
                controls 
                className="w-full" 
                poster="/api/placeholder/600/400"
              />
            </div>
            {post.mediaAlt && (
              <p className="text-sm text-gray-500 mt-2">{post.mediaAlt}</p>
            )}
          </div>
        );
        
      case 'audio':
        return (
          <div className="mt-4">
            <audio src={post.mediaUrl} controls className="w-full" />
            {post.mediaAlt && (
              <p className="text-sm text-gray-500 mt-2">{post.mediaAlt}</p>
            )}
          </div>
        );
        
      case 'link':
        return (
          <div className="mt-4">
            <a 
              href={post.linkUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-start">
                {post.linkPreviewImage && (
                  <div className="flex-shrink-0 mr-4">
                    <Image 
                      src={post.linkPreviewImage} 
                      alt="Link preview" 
                      width={120} 
                      height={120} 
                      className="rounded-md object-cover"
                    />
                  </div>
                )}
                <div className="flex-grow">
                  <h4 className="font-medium text-blue-600 flex items-center">
                    {post.linkUrl?.replace(/^https?:\/\//, '').split('/')[0]}
                    <ExternalLink className="ml-1 w-4 h-4" />
                  </h4>
                  {post.linkDescription && (
                    <p className="text-gray-600 mt-1">{post.linkDescription}</p>
                  )}
                </div>
              </div>
            </a>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm mb-4">
      <div className="flex items-center">
        <Image 
          src={post.user?.image || '/api/placeholder/40/40'} 
          alt={post.user?.name || 'User'} 
          width={40} 
          height={40} 
          className="rounded-full mr-3"
        />
        <div>
          <h4 className="font-semibold">{post.user?.name || 'Anonymous User'}</h4>
          <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
        </div>
      </div>
      
      {/* Post Title */}
      <h3 className="font-medium text-lg mt-3">{post.title}</h3>
      
      {/* Post Content */}
      {renderPostContent()}
      
      {/* Post Actions */}
      <div className="flex items-center mt-4 pt-3 border-t">
        <button 
          className={`flex items-center mr-4 ${liked ? 'text-red-500' : 'text-gray-600'} hover:text-red-500`}
          onClick={handleLike}
        >
          <Heart className={`mr-1 w-5 h-5 ${liked ? 'fill-current' : ''}`} /> 
          <span>{likeCount}</span>
        </button>
        
        <button className="flex items-center mr-4 text-gray-600 hover:text-blue-500">
          <MessageCircle className="mr-1 w-5 h-5" /> Comment
        </button>
        
        <button className="flex items-center text-gray-600 hover:text-green-500">
          <Share2 className="mr-1 w-5 h-5" /> Share
        </button>
      </div>
    </div>
  );
};

export default PostItem;