"use client"

import React, { useState } from 'react';
import { 
  MessageCircle, 
  Users, 
  BookOpen, 
  PlusCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import CreatePostModal from '@/components/Dashboard/CreatePostModal';
import PostsList from '@/components/Dashboard/Posts/PostsList';
import { useGetSingleGroup } from '@/hooks/users/groups/useGetSingleGroup';
import { useAllMembersGroup } from '@/hooks/users/groups/members/useGetAllmembers';
import Link  from "next/link"
import GroupMembersDisplay from '@/components/Dashboard/community/GroupMembers';
import { useSession } from 'next-auth/react';
import { List } from 'lucide-react';
import WeeklyChallengesCard from '@/components/Dashboard/challenge/ChallengesPage';
import { useGetPosts } from '@/hooks/users/groups/posts/useGetAllPosts';
import { usegetChallenges } from '@/hooks/challenges/useGetChallenges';

function GroupDetailPage() {
  const { id }: { id: string } = useParams();
  const { data, isPending } = useGetSingleGroup(id);
  const [activeTab, setActiveTab] = useState<'discussions' | 'challenges' | 'members'>('discussions');
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const {data: session } = useSession();

  const params = useParams();
  const groupId = params?.id as string;
  const { posts } = useGetPosts(groupId);
  const { data: getAllChallenges } = usegetChallenges(groupId);
  const { data: AllGroupMembers } = useAllMembersGroup(groupId);

  const postsNumber = posts?.length || 0;
  const challengesNumber = getAllChallenges?.data?.length || 0;
  const members= AllGroupMembers?.data?.length || 0;

  const canManageMembers = ['Admin', 'Specialist', 'SuperAdmin'].includes(session?.user?.role ?? '');

  const renderDiscussionsTab = () => (
    <div className="space-y-4">
      {/* Header with responsive flex layout */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-3 sm:space-y-0">
        <h3 className="text-lg sm:text-xl font-bold flex items-center">
          <MessageCircle className="mr-2 text-purple-600 w-5 h-5 sm:w-6 sm:h-6" /> 
          <span className="hidden sm:inline">Community Discussions</span>
          <span className="sm:hidden">Discussions</span>
        </h3>
        <button 
          className="bg-slate-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-slate-700 flex items-center justify-center text-sm sm:text-base w-full sm:w-auto"
          onClick={() => setIsCreatePostModalOpen(true)}
        >
          <PlusCircle className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" /> 
          <span className="hidden xs:inline">Create Post</span>
          <span className="xs:hidden">New</span>
        </button>
      </div>

      <PostsList 
        groupId={id} 
        onCreatePost={() => setIsCreatePostModalOpen(true)} 
      />

      <CreatePostModal 
        groupId={id}
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
      />
    </div>
  );

  const renderChallengesTab = () => (
    <div className='pr-0 sm:pr-8 md:pr-16 lg:pr-32 xl:pr-52'>
      <WeeklyChallengesCard />
    </div>
  )

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl">
      {isPending ? (
        <div className="animate-pulse">
          {/* Loading skeleton with responsive design */}
          <div className="relative mb-4 sm:mb-8">
            <div className="h-40 sm:h-48 md:h-56 lg:h-64 bg-gray-300 rounded-lg sm:rounded-xl relative">
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-3 sm:p-4 md:p-6">
                <div className="h-6 sm:h-7 md:h-8 bg-gray-400 rounded w-48 sm:w-64 mb-2"></div>
                <div className="h-3 sm:h-4 bg-gray-500 rounded w-64 sm:w-96"></div>
              </div>
            </div>
          </div>

          {/* Tab loading skeleton */}
          <div className="flex border-b mb-4 sm:mb-6 overflow-x-auto">
            {[1, 2, 3].map((tab) => (
              <div key={tab} className="flex items-center px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-300 rounded mr-1 sm:mr-2"></div>
                <div className="h-3 sm:h-4 bg-gray-300 rounded w-16 sm:w-20"></div>
              </div>
            ))}
          </div>

          {/* Content loading skeleton */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
              <div className="flex items-center">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-300 rounded mr-2"></div>
                <div className="h-5 sm:h-6 bg-gray-300 rounded w-32 sm:w-48"></div>
              </div>
              <div className="h-8 sm:h-10 bg-gray-300 rounded w-full sm:w-32"></div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 md:p-6">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <div className="ml-2 sm:ml-3 flex-1 min-w-0">
                      <div className="h-3 sm:h-4 bg-gray-300 rounded w-24 sm:w-32 mb-1 sm:mb-2"></div>
                      <div className="h-2 sm:h-3 bg-gray-200 rounded w-16 sm:w-24"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                    <div className="h-3 sm:h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-3 sm:h-4 bg-gray-300 rounded w-4/5"></div>
                    <div className="h-3 sm:h-4 bg-gray-300 rounded w-3/5"></div>
                  </div>
                  
                  <div className="flex items-center space-x-3 sm:space-x-6 pt-3 sm:pt-4 border-t border-gray-100">
                    <div className="h-6 sm:h-8 bg-gray-200 rounded w-12 sm:w-16"></div>
                    <div className="h-6 sm:h-8 bg-gray-200 rounded w-14 sm:w-20"></div>
                    <div className="h-6 sm:h-8 bg-gray-200 rounded w-12 sm:w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Back button with responsive positioning */}
          <div className="relative mb-4 sm:mb-8">
            <Link 
              href="/dashboard/community" 
              className="inline-flex items-center gap-1 sm:gap-2 bg-white hover:bg-gray-50 font-medium sm:font-bold text-gray-700 py-1.5 px-3 sm:py-2 sm:px-6 rounded-md sm:rounded-lg shadow-sm border border-gray-200 transition-colors duration-200 mb-3 sm:mb-4 text-sm sm:text-base"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>

            {/* Hero section with responsive image */}
            <div className="h-40 sm:h-48 md:h-56 lg:h-64 overflow-hidden rounded-lg sm:rounded-xl relative bg-opacity-50">
              <Image
                src={data?.group?.image || data?.data?.group.image}
                alt={data?.group?.name || data?.data?.group.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
                priority
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-3 sm:p-4 md:p-6 z-10">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight">
                  {data?.group?.name || data?.data?.group.name || "Loading group..."}
                </h1>
                <p className="text-gray-200 mt-1 sm:mt-2 text-sm sm:text-base line-clamp-2 sm:line-clamp-none">
                  {data?.group?.description || data?.data?.group.description || ""}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs with horizontal scroll on mobile */}
          <div className="flex border-b mb-4 sm:mb-6 overflow-x-auto scrollbar-hide">
            {[
              { key: 'discussions', label: 'Discussions', icon: BookOpen, length: postsNumber },
              { key: 'challenges', label: 'Challenges', icon: List, length: challengesNumber},
              { key: 'members', label: 'Members', icon: Users, length: members}
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`
                  flex items-center px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-sm sm:text-base
                  ${activeTab === tab.key 
                    ? 'border-b-2 border-purple-600 text-purple-600' 
                    : 'text-gray-600 hover:text-gray-800'}
                `}
              >
                <tab.icon className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" /> 
                <span className="hidden xs:inline sm:hidden">{tab.label.slice(0, 4)}.</span>
                <span className="xs:hidden sm:inline">{tab.label}</span>
                <span className="ml-0.5 sm:ml-1">({tab.length && tab.length})</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="min-h-[50vh]">
            {activeTab === 'discussions' && renderDiscussionsTab()}
            {activeTab === 'members' && (
              <GroupMembersDisplay 
                groupId={groupId}
                groupName="Your Group Name" 
                canManageMembers={canManageMembers}
              />
            )}
            {activeTab === 'challenges' && renderChallengesTab()}
          </div>
        </>
      )}
    </div>
  );
}

export default GroupDetailPage;