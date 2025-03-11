"use client"
import React, { useState } from 'react';
import { Users, ArrowRight, PlusCircle, RefreshCw } from "lucide-react";
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
}

export function CommunityGroups() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { 
    data, 
    isPending, 
    refetch, 
    isRefetching 
  } = useGetAllGroups(session?.user?.id);
  
  const { joinGroup: joinGroupSubmit } = useJoinGroup();
  const { exitGroup } = useExitGroup();
  
  const groups = data?.data as Group[] | undefined;

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Community Groups</h1>
        {session?.user && (
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            <PlusCircle className="mr-2" /> Create Group
          </button>
        )}
      </div>

      <div className="flex justify-end mb-4">
        <button 
          onClick={() => refetch()}
          disabled={isRefetching}
          className="flex items-center text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          <RefreshCw className={`mr-2 ${isRefetching ? 'animate-spin' : ''}`} /> 
          Refresh Groups
        </button>
      </div>

      {(groups ?? []).filter(group => group.isJoined).length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Your Groups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups
              ?.filter(group => group.isJoined)
              .map((group) => (
                <div 
                  key={group.id} 
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-4 flex items-center">
                    <div className="mr-4">
                      {group.image ? (
                        <Image 
                          src={group.image} 
                          alt={group.name} 
                          width={56} 
                          height={56} 
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <Users className="w-14 h-14 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold">{group.name}</h3>
                      <div className="flex space-x-2 mt-2">
                        <button 
                          onClick={() => handleViewGroup(group.id)}
                          className="text-purple-600 hover:text-purple-800 flex items-center"
                        >
                          View Group <ArrowRight className="ml-1 w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleExitGroup(group.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Leave Group
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
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Discover Groups</h2>
        {isPending ? (
          <div className="text-center py-8">
            <RefreshCw className="mx-auto animate-spin w-12 h-12 text-purple-600" />
            <p className="mt-4 text-gray-600">Loading groups...</p>
          </div>
        ) : groups && groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups
              ?.filter(group => !group.isJoined)
              .map((group) => (
                <div 
                  key={group.id} 
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
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
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Users className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{group.name}</h3>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{group.description}</p>
                    <button 
                      onClick={() => handleJoinGroup(group.id)}
                      className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
                    >
                      Join Group
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-100 rounded-lg">
            <Users className="mx-auto w-16 h-16 text-gray-400 mb-4" />
            <p className="text-gray-600">No groups available at the moment</p>
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
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Create New Group</h2>
        <div className="flex justify-end space-x-2 mt-4">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button 
            onClick={onGroupCreated}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommunityGroups;