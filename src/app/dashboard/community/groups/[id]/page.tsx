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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold flex items-center">
          <MessageCircle className="mr-2 text-purple-600" /> 
          Community Discussions
        </h3>
        <button 
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
          onClick={() => setIsCreatePostModalOpen(true)}
        >
          <PlusCircle className="mr-2 w-5 h-5" /> Create Post
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
    <div className='pr-52'>
      <WeeklyChallengesCard />
    </div>
  )


  return (
    <div className="container mx-auto px-4 py-8">
      {isPending ? (
        <div className="animate-pulse">
          <div className="relative mb-8">
            <div className="h-64 bg-gray-300 rounded-xl relative">
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-6">
                <div className="h-8 bg-gray-400 rounded w-64 mb-2"></div>
                <div className="h-4 bg-gray-500 rounded w-96"></div>
              </div>
            </div>
          </div>

          <div className="flex border-b mb-6">
            {[1, 2, 3].map((tab) => (
              <div key={tab} className="flex items-center px-4 py-3">
                <div className="w-5 h-5 bg-gray-300 rounded mr-2"></div>
                <div className="h-4 bg-gray-300 rounded w-20"></div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-300 rounded mr-2"></div>
                <div className="h-6 bg-gray-300 rounded w-48"></div>
              </div>
              <div className="h-10 bg-gray-300 rounded w-32"></div>
            </div>

            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div className="ml-3 flex-1">
                      <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-4/5"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/5"></div>
                  </div>
                  
                  <div className="flex items-center space-x-6 pt-4 border-t border-gray-100">
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="relative mb-8">
            <Link 
              href="/dashboard/community" 
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 font-bold text-gray-700 py-2 px-6 rounded-lg shadow-sm border border-gray-200 transition-colors duration-200 mb-4"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>

            <div className="h-64 overflow-hidden rounded-xl relative">
              <Image 
                src={data?.group?.image || data?.data?.group.image} 
                alt={data?.group?.name || data?.data?.group.name} 
                width={600}
                height={300}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-6">
                <h1 className="text-3xl font-bold text-white">
                  {data?.group?.name || "Loading group..."}
                </h1>
                <p className="text-gray-200 mt-2">
                  {data?.group?.description || ""}
                </p>
              </div>
            </div>
          </div>

          <div className="flex border-b mb-6">
            {[
              { key: 'discussions', label: 'Discussions', icon: BookOpen, length: postsNumber },
              { key: 'challenges', label: 'challenges', icon: List, length: challengesNumber},
              { key: 'members', label: 'Members', icon: Users, length: members}
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`
                  flex items-center px-4 py-3 
                  ${activeTab === tab.key 
                    ? 'border-b-2 border-purple-600 text-purple-600' 
                    : 'text-gray-600 hover:text-gray-800'}
                `}
              >
                <tab.icon className="mr-2" /> {tab.label} <span className="">({ tab.length && tab.length })</span>
              </button>
            ))}
          </div>

          {activeTab === 'discussions' && renderDiscussionsTab()}
          {activeTab === 'members' && (
          <GroupMembersDisplay 
            groupId={groupId}
            groupName="Your Group Name" 
            canManageMembers={canManageMembers}
          />)}

          { activeTab === 'challenges' && renderChallengesTab()}
        </>
      )}
    </div>
  );
}

export default GroupDetailPage;