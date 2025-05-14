"use client";

import React from 'react';

import { PlusCircle } from 'lucide-react';
import { useGetPosts } from '@/hooks/users/groups/posts/useGetAllPosts';
import PostItem from './PostItem';

interface PostsListProps {
  groupId: string;
  onCreatePost: () => void;
}

const PostsList: React.FC<PostsListProps> = ({ groupId, onCreatePost }) => {
  const { posts, isPending, error } = useGetPosts(groupId);

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        Failed to load posts. Please try again later.
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <h3 className="text-xl font-medium text-gray-600 mb-2">No posts yet</h3>
        <p className="text-gray-500 mb-4">Be the first to start a discussion in this group</p>
        <button 
          onClick={onCreatePost}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <PlusCircle className="mr-2 w-5 h-5" /> Create a Post
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostsList;