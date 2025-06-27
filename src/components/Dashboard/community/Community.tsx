"use client"
import React, { useState } from 'react';
import { Users, ArrowRight, PlusCircle, RefreshCw, Search, Filter, Heart, Settings, UserPlus, Shield, Clock, Check, X, Eye, Edit } from "lucide-react";
import {  useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from "next-auth/react";
import { useGetAllGroups } from '@/hooks/users/groups/useGetGroups';
import { useJoinGroup } from '@/hooks/users/groups/useJoinGroup';
import { useExitGroup } from '@/hooks/users/groups/useExitGroup';
import showToast from '@/utils/showToast';
import { RequestModal } from './RequestModeratorForm';
import { ManagementModal } from './ManagingRequest';
import { CreateGroupModal } from './CreateGroupFormModal';
import { useAllMembersGroup } from '@/hooks/users/groups/members/useGetAllmembers';

interface Group {
  id: number;
  name: string;
  description: string;
  image: string | null;
  categoryId: number;
  isJoined: boolean;
  memberCount?: number;
  moderators?: string[];
  createdBy?: string;
}

export interface GroupRequest {
  id: number;
  userId: string;
  userName: string;
  groupName: string;
  description: string;
  requestType: 'create' | 'moderator';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  groupId?: number;
}

export function CommunityGroups() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'groups' | 'requests'>('groups');
  // const { data: AllGroupMembers } = useAllMembersGroup(groupId);
  
  const { 
    data, 
    isPending, 
    refetch, 
    isRefetching 
  } = useGetAllGroups(session?.user?.id);

  // const members= AllGroupMembers?.data?.length || 0;

  
  const { joinGroup: joinGroupSubmit } = useJoinGroup();
  const { exitGroup } = useExitGroup();
  
  const groups = data?.data as Group[] | undefined;
  const canManageGroups = ['Admin', 'Specialist', 'SuperAdmin'].includes(session?.user?.role ?? '');
  const isRegularUser = !canManageGroups;

  const [requests] = useState<GroupRequest[]>([
    {
      id: 1,
      userId: 'user1',
      userName: 'John Doe',
      groupName: 'Tech Enthusiasts',
      description: 'A group for discussing latest tech trends',
      requestType: 'create',
      status: 'pending',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      userId: 'user2',
      userName: 'Jane Smith',
      groupName: 'Fitness Community',
      description: '',
      requestType: 'moderator',
      status: 'pending',
      createdAt: '2024-01-16',
      groupId: 2
    }
  ]);

   


  const filteredGroups = groups?.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const joinedGroups = filteredGroups?.filter(group => group.isJoined) || [];
  const discoverGroups = filteredGroups?.filter(group => !group.isJoined) || [];

  const handleJoinGroup = async (group_id: number) => {
    if (!session?.user?.id) {
      showToast('Please login to join groups', 'error');
      return;
    }

    try {
      await joinGroupSubmit({ 
        group_id: group_id.toString(),
        user_id: session.user.id 
      });
      await refetch();
      showToast('Successfully joined the group!', 'success');
    } catch (error) {
      showToast('Failed to join the group', 'error');
    }
  };

  const handleExitGroup = async (group_id: number) => {
    try {
      await exitGroup(group_id.toString());
      await refetch();
      showToast('Successfully left the group!', 'success');
    } catch (error) {
      showToast('Failed to leave the group', 'error');
    }
  };

  const handleViewGroup = (group_id: number) => {
    router.push(`/dashboard/community/groups/${group_id}`);
  };

  const handleApproveRequest = async (requestId: number) => {
    showToast('Request approved successfully!', 'success');
  };

  const handleRejectRequest = async (requestId: number) => {
    showToast('Request rejected', 'error');
  };

  const YourGroupsSkeleton = () => (
    <section className="mb-12">
      <div className="flex items-center mb-6">
        <div className="w-6 h-6 bg-gray-300 rounded mr-2 animate-pulse"></div>
        <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 animate-pulse">
            <div className="p-6 flex items-center">
              <div className="mr-4">
                <div className="w-[100px] h-[100px] rounded-full bg-gray-300"></div>
              </div>
              <div className="flex-grow">
                <div className="h-5 bg-gray-300 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
                <div className="flex space-x-3">
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                  <div className="h-4 bg-gray-200 rounded w-10"></div>
                  <div className="h-4 bg-gray-200 rounded w-14"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const DiscoverGroupsSkeleton = () => (
    <section>
      <div className="h-6 bg-gray-300 rounded w-40 mb-6 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 animate-pulse">
            <div className="h-48 w-full bg-gray-300"></div>
            <div className="p-6">
              <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="space-y-2 mb-6">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-gray-300 rounded-xl w-full"></div>
                <div className="flex gap-2">
                  <div className="flex-1 h-8 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 h-8 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="bg-gray-400 rounded-xl p-8 mb-10 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Community Groups</h1>
            <p className="text-purple-100">Connect, collaborate, and grow with passonate comminities world wide.<br/>Discover your emotions and unlock endless possibilities</p>
          </div>
          
          <div className="flex gap-3">
            {canManageGroups && (
              <>
                <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center bg-white text-black px-5 py-3 text-lg rounded-lg hover:bg-purple-50 transition duration-300 shadow-md font-medium"
                >
                  <PlusCircle className="mr-2" /> Create Group
                </button>
                <button 
                  onClick={() => setIsManageModalOpen(true)}
                  className="flex items-center bg-white text-black text-lg px-5 py-3 rounded-lg hover:bg-purple-50 transition duration-300 shadow-md font-medium"
                >
                  <Settings className="mr-2" /> Manage
                </button>
              </>
            )}
            {isRegularUser && (
              <button 
                onClick={() => setIsRequestModalOpen(true)}
                className="flex items-center bg-white text-purple-700 px-5 py-3 rounded-lg hover:bg-purple-50 transition duration-300 shadow-md font-medium"
              >
                <UserPlus className="mr-2" /> Request
              </button>
            )}
          </div>
        </div>
      </div>

      
      <div className='bg-white shadow-xl p-10'>
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={() => refetch()}
              disabled={isRefetching}
              className="flex items-center text-purple-600 bg-white px-4 py-2 rounded-lg hover:bg-purple-50 border border-purple-200 disabled:opacity-50 shadow-sm transition duration-300"
            >
              <RefreshCw className={`mr-2 ${isRefetching ? 'animate-spin' : ''}`} size={18} /> 
              Refresh
            </button>
            
            <button className="flex items-center text-gray-700 bg-white px-4 py-2 rounded-lg hover:bg-gray-50 border border-gray-200 shadow-sm transition duration-300">
              <Filter className="mr-2" size={18} /> 
              Filter
            </button>
          </div>
        </div>

        {isPending ? (
          <div className="animate-pulse">
            <YourGroupsSkeleton />
            <DiscoverGroupsSkeleton />
          </div>
        ) : (
          <>
            {joinedGroups.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                  <Heart className="mr-2 text-red-500" size={24} />
                  Your Groups
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {joinedGroups.map((group) => (
                    <div 
                      key={group.id} 
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300 border border-gray-100"
                    >
                      <div className="p-6 flex items-center">
                      <div className="mr-4 relative">
                        {group.image ? (
                          <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-2 border-purple-100">
                            <Image
                              src={group.image}
                              alt={group.name}
                              width={200}
                              height={200}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ) : (
                          <div className="w-[100px] h-[100px] rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                            <Users className="w-16 h-16 text-purple-600" />
                          </div>
                        )}
                      </div>
                        <div className="flex-grow">
                          <h3 className="text-xl font-semibold text-gray-800">{group.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {group.memberCount || '10+'} members
                          </p>
                          <div className="flex space-x-3 mt-4">
                            <button 
                              onClick={() => handleViewGroup(group.id)}
                              className="text-purple-600 hover:text-purple-800 flex items-center font-medium"
                            >
                              View <ArrowRight className="ml-1 w-4 h-4" />
                            </button>
                            {canManageGroups && (
                              <button 
                                className="text-blue-500 hover:text-blue-700 flex items-center font-medium"
                              >
                                <Edit className="mr-1 w-4 h-4" /> Edit
                              </button>
                            )}
                            <button 
                              onClick={() => handleExitGroup(group.id)}
                              className="text-red-500 hover:text-red-700 font-medium"
                            >
                              Leave
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Discover Groups</h2>
              {discoverGroups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {discoverGroups.map((group) => (
                    <div 
                      key={group.id} 
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300 border border-gray-100"
                    >
                      <div className="h-48 w-full relative">
                        {group.image ? (
                          <Image 
                            src={group.image} 
                            alt={group.name} 
                            fill 
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
                            <Users className="w-12 h-12 text-purple-300" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                          {group.memberCount || '10+'} members
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-800">{group.name}</h3>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2 h-10">{group.description || 'Join this group to connect with others who share your interests!'}</p>
                        <div className="mt-6 space-y-2">
                          <button 
                            onClick={() => handleJoinGroup(group.id)}
                            className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition shadow-md font-medium"
                          >
                            Join Group
                          </button>
                          {canManageGroups && (
                            <div className="flex gap-2">
                              <button className="flex-1 flex items-center justify-center text-blue-600 bg-blue-50 py-2 rounded-lg hover:bg-blue-100 transition font-medium">
                                <Edit className="mr-1 w-4 h-4" /> Edit
                              </button>
                              <button className="flex-1 flex items-center justify-center text-green-600 bg-green-50 py-2 rounded-lg hover:bg-green-100 transition font-medium">
                                <Eye className="mr-1 w-4 h-4" /> Manage
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
 

                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="w-20 h-20 mx-auto bg-purple-50 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-10 h-10 text-purple-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No groups found</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {searchTerm ? 'No groups match your search criteria' : 'No groups available at the moment'}
                  </p>
                </div>
              )}
            </section>
          </>
        )}

        {/* Create Group Modal - Admin/Specialist/SuperAdmin only */}
        {isCreateModalOpen && canManageGroups && (
          <CreateGroupModal 
            onClose={() => setIsCreateModalOpen(false)}
            onGroupCreated={() => {
              refetch();
              setIsCreateModalOpen(false);
            }}
          />
        )}

        {/* Request Modal - Regular Users only */}
        {isRequestModalOpen && isRegularUser && (
          <RequestModal 
            onClose={() => setIsRequestModalOpen(false)}
            onRequestSent={() => {
              setIsRequestModalOpen(false);
              showToast('Request sent successfully! You will be notified once reviewed.', 'success');
            }}
          />
        )}

        {isManageModalOpen && canManageGroups && (
          <ManagementModal 
            requests={requests}
            onClose={() => setIsManageModalOpen(false)}
            onApproveRequest={handleApproveRequest}
            onRejectRequest={handleRejectRequest}
          />
        )}
      </div>
    </div>
  );
}

export default CommunityGroups;