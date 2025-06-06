"use client"
import React, { useState } from 'react';
import { Users, ArrowRight, PlusCircle, RefreshCw, Search, Filter, Heart } from "lucide-react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from "next-auth/react";
import { useGetAllGroups } from '@/hooks/users/groups/useGetGroups';
import { useJoinGroup } from '@/hooks/users/groups/useJoinGroup';
import { useExitGroup } from '@/hooks/users/groups/useExitGroup';
import showToast from '@/utils/showToast';

interface Group {
  id: number;
  name: string;
  description: string;
  image: string | null;
  categoryId: number;
  isJoined: boolean;
  memberCount?: number; // Optional property for displaying member count
}

export function CommunityGroups() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { 
    data, 
    isPending, 
    refetch, 
    isRefetching 
  } = useGetAllGroups(session?.user?.id);
  
  const { joinGroup: joinGroupSubmit } = useJoinGroup();
  const { exitGroup } = useExitGroup();
  console.log("sesionnsss", session)
  
  const groups = data?.data as Group[] | undefined;
  const isAdmin = session?.user?.role === 'admin'; 

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

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-xl p-8 mb-10 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Community Groups</h1>
            <p className="text-purple-100">Connect, share, and grow with like-minded people</p>
          </div>
          {isAdmin && (
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center bg-white text-purple-700 px-5 py-3 rounded-lg hover:bg-purple-50 transition duration-300 shadow-md font-medium"
            >
              <PlusCircle className="mr-2" /> Create Group
            </button>
          )}
        </div>
      </div>

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
        {isPending ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <RefreshCw className="mx-auto animate-spin w-12 h-12 text-purple-600" />
            <p className="mt-4 text-gray-600">Loading groups...</p>
          </div>
        ) : discoverGroups.length > 0 ? (
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
                  <div className="mt-6">
                    <button 
                      onClick={() => handleJoinGroup(group.id)}
                      className="w-full bg-gray-900 text-white py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition shadow-md font-medium"
                    >
                      Join Group
                    </button>
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

      {isCreateModalOpen && (
        <CreateGroupModal 
          onClose={() => setIsCreateModalOpen(false)}
          onGroupCreated={() => {
            refetch();
            setIsCreateModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

function CreateGroupModal({ 
  onClose, 
  onGroupCreated 
}: { 
  onClose: () => void, 
  onGroupCreated: () => void 
}) {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!groupName.trim()) {
      showToast('Group name is required', 'error');
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onGroupCreated();
      showToast('Group created successfully!', 'success');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Group</h2>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              placeholder="Describe the purpose of this group"
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group Image</label>
            <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
              <PlusCircle className="mx-auto w-10 h-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Click to upload image</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium disabled:opacity-70 flex items-center"
          >
            {isSubmitting && <RefreshCw className="animate-spin mr-2" size={18} />}
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommunityGroups;