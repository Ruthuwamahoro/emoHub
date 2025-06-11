"use client"
import React, { useState } from 'react';
import { Users, ArrowRight, PlusCircle, RefreshCw, Search, Filter, Heart, Settings, UserPlus, Shield, Clock, Check, X, Eye, Edit } from "lucide-react";
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
  memberCount?: number;
  moderators?: string[];
  createdBy?: string;
}

interface GroupRequest {
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
  
  const { 
    data, 
    isPending, 
    refetch, 
    isRefetching 
  } = useGetAllGroups(session?.user?.id);
  
  const { joinGroup: joinGroupSubmit } = useJoinGroup();
  const { exitGroup } = useExitGroup();
  
  const groups = data?.data as Group[] | undefined;
  const canManageGroups = ['Admin', 'Specialist', 'SuperAdmin'].includes(session?.user?.role ?? '');
  const isRegularUser = !canManageGroups;

  // Mock requests data - replace with actual API call
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
    // Implement approve request logic
    showToast('Request approved successfully!', 'success');
  };

  const handleRejectRequest = async (requestId: number) => {
    // Implement reject request logic
    showToast('Request rejected', 'error');
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-xl p-8 mb-10 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Community Groups</h1>
            <p className="text-purple-100">Connect, share, and grow with like-minded people</p>
          </div>
          <div className="flex gap-3">
            {canManageGroups && (
              <>
                <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center bg-white text-purple-700 px-5 py-3 rounded-lg hover:bg-purple-50 transition duration-300 shadow-md font-medium"
                >
                  <PlusCircle className="mr-2" /> Create Group
                </button>
                <button 
                  onClick={() => setIsManageModalOpen(true)}
                  className="flex items-center bg-white text-purple-700 px-5 py-3 rounded-lg hover:bg-purple-50 transition duration-300 shadow-md font-medium"
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

      {/* Management Modal - Admin/Specialist/SuperAdmin only */}
      {isManageModalOpen && canManageGroups && (
        <ManagementModal 
          requests={requests}
          onClose={() => setIsManageModalOpen(false)}
          onApproveRequest={handleApproveRequest}
          onRejectRequest={handleRejectRequest}
        />
      )}
    </div>
  );
}

// Create Group Modal (Admin/Specialist/SuperAdmin)
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

// Request Modal (Regular Users)
function RequestModal({ 
  onClose, 
  onRequestSent 
}: { 
  onClose: () => void, 
  onRequestSent: () => void 
}) {
  const [requestType, setRequestType] = useState<'create' | 'moderator'>('create');
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (requestType === 'create' && !groupName.trim()) {
      showToast('Group name is required', 'error');
      return;
    }
    if (requestType === 'moderator' && !selectedGroupId) {
      showToast('Please select a group', 'error');
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onRequestSent();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Send Request</h2>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Request Type</label>
            <div className="flex space-x-4">
              <button
                onClick={() => setRequestType('create')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                  requestType === 'create' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Create Group
              </button>
              <button
                onClick={() => setRequestType('moderator')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                  requestType === 'moderator' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Become Moderator
              </button>
            </div>
          </div>

          {requestType === 'create' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter proposed group name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  placeholder="Explain why this group should be created"
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Group</label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="">Choose a group...</option>
                  <option value="1">Fitness Community</option>
                  <option value="2">Tech Enthusiasts</option>
                  <option value="3">Book Club</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Why do you want to be a moderator?</label>
                <textarea
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  placeholder="Explain your motivation and qualifications"
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </>
          )}
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
            Send Request
          </button>
        </div>
      </div>
    </div>
  );
}

// Management Modal (Admin/Specialist/SuperAdmin)
function ManagementModal({ 
  requests,
  onClose, 
  onApproveRequest,
  onRejectRequest
}: { 
  requests: GroupRequest[],
  onClose: () => void,
  onApproveRequest: (id: number) => void,
  onRejectRequest: (id: number) => void
}) {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  
  const filteredRequests = requests.filter(request => request.status === activeTab);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manage Requests</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {(['pending', 'approved', 'rejected'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition capitalize ${
                activeTab === tab 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab} ({requests.filter(r => r.status === tab).length})
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="mx-auto w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-500">No {activeTab} requests</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div key={request.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.requestType === 'create' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {request.requestType === 'create' ? 'Create Group' : 'Become Moderator'}
                      </span>
                      <span className="text-sm text-gray-500">{request.createdAt}</span>
                    </div>
                    <h4 className="font-semibold text-gray-800">{request.userName}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {request.requestType === 'create' 
                        ? `Wants to create: "${request.groupName}"` 
                        : `Wants to moderate: "${request.groupName}"`
                      }
                    </p>
                    {request.description && (
                      <p className="text-sm text-gray-500">{request.description}</p>
                    )}
                  </div>
                  
                  {activeTab === 'pending' && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => onApproveRequest(request.id)}
                        className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                      >
                        <Check size={16} className="mr-1" /> Approve
                      </button>
                      <button
                        onClick={() => onRejectRequest(request.id)}
                        className="flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                      >
                        <X size={16} className="mr-1" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="flex justify-end mt-6">
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommunityGroups;




























// "use client"
// import React, { useState } from 'react';
// import { Users, ArrowRight, PlusCircle, RefreshCw, Search, Filter, Heart, Settings, UserPlus, Shield, Clock, Check, X, Eye, Edit } from "lucide-react";
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Badge } from '@/components/ui/badge';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// interface Group {
//   id: number;
//   name: string;
//   description: string;
//   image: string | null;
//   categoryId: number;
//   isJoined: boolean;
//   memberCount?: number;
//   moderators?: string[];
//   createdBy?: string;
// }

// interface GroupRequest {
//   id: number;
//   userId: string;
//   userName: string;
//   groupName: string;
//   description: string;
//   requestType: 'create' | 'moderator';
//   status: 'pending' | 'approved' | 'rejected';
//   createdAt: string;
//   groupId?: number;
// }

// export function CommunityGroups() {
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
//   const [isManageModalOpen, setIsManageModalOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isRefetching, setIsRefetching] = useState(false);
  
//   // Mock session data
//   const session = { user: { id: '1', role: 'Admin' } };
  
//   // Mock groups data
//   const groups: Group[] = [
//     {
//       id: 1,
//       name: "Tech Enthusiasts",
//       description: "A community for technology lovers to share insights and discuss the latest trends",
//       image: null,
//       categoryId: 1,
//       isJoined: true,
//       memberCount: 124
//     },
//     {
//       id: 2,
//       name: "Fitness Community",
//       description: "Join us for fitness tips, workout routines, and healthy lifestyle discussions",
//       image: null,
//       categoryId: 2,
//       isJoined: true,
//       memberCount: 89
//     },
//     {
//       id: 3,
//       name: "Book Club",
//       description: "Monthly book discussions and literary conversations",
//       image: null,
//       categoryId: 3,
//       isJoined: false,
//       memberCount: 67
//     },
//     {
//       id: 4,
//       name: "Photography Hub",
//       description: "Share your photos and learn from fellow photographers",
//       image: null,
//       categoryId: 4,
//       isJoined: false,
//       memberCount: 156
//     }
//   ];

//   const requests: GroupRequest[] = [
//     {
//       id: 1,
//       userId: 'user1',
//       userName: 'John Doe',
//       groupName: 'AI & Machine Learning',
//       description: 'A group for discussing AI developments and ML techniques',
//       requestType: 'create',
//       status: 'pending',
//       createdAt: '2024-01-15'
//     },
//     {
//       id: 2,
//       userId: 'user2',
//       userName: 'Jane Smith',
//       groupName: 'Fitness Community',
//       description: 'I want to help moderate this community',
//       requestType: 'moderator',
//       status: 'pending',
//       createdAt: '2024-01-16',
//       groupId: 2
//     }
//   ];

//   const canManageGroups = ['Admin', 'Specialist', 'SuperAdmin'].includes(session?.user?.role ?? '');
//   const isRegularUser = !canManageGroups;

//   const filteredGroups = groups.filter(group => 
//     group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     group.description.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const joinedGroups = filteredGroups.filter(group => group.isJoined);
//   const discoverGroups = filteredGroups.filter(group => !group.isJoined);

//   const handleRefresh = () => {
//     setIsRefetching(true);
//     setTimeout(() => setIsRefetching(false), 1000);
//   };

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header Section */}
//         <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-8 mb-10 shadow-lg border border-slate-700">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-4xl font-bold text-white mb-2">Community Groups</h1>
//               <p className="text-slate-300">Connect, share, and grow with like-minded people</p>
//             </div>
//             <div className="flex gap-3">
//               {canManageGroups && (
//                 <>
//                   <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
//                     <DialogTrigger asChild>
//                       <Button className="bg-orange-500 hover:bg-orange-600 text-white border-none">
//                         <PlusCircle className="mr-2 h-4 w-4" />
//                         Create Group
//                       </Button>
//                     </DialogTrigger>
//                     <CreateGroupModal onClose={() => setIsCreateModalOpen(false)} />
//                   </Dialog>
                  
//                   <Dialog open={isManageModalOpen} onOpenChange={setIsManageModalOpen}>
//                     <DialogTrigger asChild>
//                       <Button variant="outline" className="bg-white text-slate-900 border-slate-300 hover:bg-slate-100">
//                         <Settings className="mr-2 h-4 w-4" />
//                         Manage
//                       </Button>
//                     </DialogTrigger>
//                     <ManagementModal requests={requests} onClose={() => setIsManageModalOpen(false)} />
//                   </Dialog>
//                 </>
//               )}
//               {isRegularUser && (
//                 <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
//                   <DialogTrigger asChild>
//                     <Button className="bg-orange-500 hover:bg-orange-600 text-white border-none">
//                       <UserPlus className="mr-2 h-4 w-4" />
//                       Request
//                     </Button>
//                   </DialogTrigger>
//                   <RequestModal onClose={() => setIsRequestModalOpen(false)} />
//                 </Dialog>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Search and Controls */}
//         <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
//           <div className="relative w-full md:w-1/2">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
//             <Input
//               type="text"
//               placeholder="Search groups..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 bg-white border-slate-200 focus:border-orange-500 focus:ring-orange-500"
//             />
//           </div>
          
//           <div className="flex gap-4 w-full md:w-auto">
//             <Button 
//               onClick={handleRefresh}
//               disabled={isRefetching}
//               variant="outline"
//               className="bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
//             >
//               <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
//               Refresh
//             </Button>
            
//             <Button variant="outline" className="bg-white text-slate-700 border-slate-300 hover:bg-slate-50">
//               <Filter className="mr-2 h-4 w-4" />
//               Filter
//             </Button>
//           </div>
//         </div>

//         {/* Your Groups Section */}
//         {joinedGroups.length > 0 && (
//           <section className="mb-12">
//             <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center">
//               <Heart className="mr-2 text-orange-500 h-6 w-6" />
//               Your Groups
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {joinedGroups.map((group) => (
//                 <Card key={group.id} className="bg-white border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
//                   <CardContent className="p-6">
//                     <div className="flex items-center">
//                       <div className="mr-4">
//                         {group.image ? (
//                           <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200">
//                             <img
//                               src={group.image}
//                               alt={group.name}
//                               className="object-cover w-full h-full"
//                             />
//                           </div>
//                         ) : (
//                           <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
//                             <Users className="w-8 h-8 text-slate-600" />
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex-grow">
//                         <h3 className="text-xl font-semibold text-slate-800">{group.name}</h3>
//                         <Badge variant="secondary" className="mt-1 bg-slate-100 text-slate-600">
//                           {group.memberCount} members
//                         </Badge>
//                         <div className="flex space-x-3 mt-4">
//                           <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
//                             View <ArrowRight className="ml-1 w-3 h-3" />
//                           </Button>
//                           {canManageGroups && (
//                             <Button size="sm" variant="outline" className="text-slate-600 border-slate-300">
//                               <Edit className="mr-1 w-3 h-3" /> Edit
//                             </Button>
//                           )}
//                           <Button size="sm" variant="destructive" className="bg-slate-600 hover:bg-slate-700">
//                             Leave
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Discover Groups Section */}
//         <section>
//           <h2 className="text-2xl font-bold mb-6 text-slate-800">Discover Groups</h2>
//           {discoverGroups.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {discoverGroups.map((group) => (
//                 <Card key={group.id} className="bg-white border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
//                   <div className="h-48 w-full relative rounded-t-lg overflow-hidden">
//                     {group.image ? (
//                       <img 
//                         src={group.image} 
//                         alt={group.name} 
//                         className="object-cover w-full h-full"
//                       />
//                     ) : (
//                       <div className="w-full h-full bg-slate-100 flex items-center justify-center">
//                         <Users className="w-12 h-12 text-slate-400" />
//                       </div>
//                     )}
//                     <Badge className="absolute top-3 right-3 bg-white text-slate-700 border border-slate-200">
//                       {group.memberCount} members
//                     </Badge>
//                   </div>
//                   <CardContent className="p-6">
//                     <h3 className="text-xl font-semibold text-slate-800 mb-2">{group.name}</h3>
//                     <p className="text-sm text-slate-600 mb-6 line-clamp-2 h-10">
//                       {group.description || 'Join this group to connect with others who share your interests!'}
//                     </p>
//                     <div className="space-y-2">
//                       <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">
//                         Join Group
//                       </Button>
//                       {canManageGroups && (
//                         <div className="flex gap-2">
//                           <Button variant="outline" className="flex-1 text-orange-600 border-orange-200 hover:bg-orange-50">
//                             <Edit className="mr-1 w-4 h-4" /> Edit
//                           </Button>
//                           <Button variant="outline" className="flex-1 text-slate-600 border-slate-300 hover:bg-slate-50">
//                             <Eye className="mr-1 w-4 h-4" /> Manage
//                           </Button>
//                         </div>
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           ) : (
//             <Card className="bg-white border-slate-200">
//               <CardContent className="text-center py-16">
//                 <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
//                   <Users className="w-10 h-10 text-slate-400" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-slate-700 mb-2">No groups found</h3>
//                 <p className="text-slate-500 max-w-md mx-auto">
//                   {searchTerm ? 'No groups match your search criteria' : 'No groups available at the moment'}
//                 </p>
//               </CardContent>
//             </Card>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// }

// // Create Group Modal
// function CreateGroupModal({ onClose }: { onClose: () => void }) {
//   const [groupName, setGroupName] = useState('');
//   const [groupDescription, setGroupDescription] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async () => {
//     if (!groupName.trim()) {
//       return;
//     }
    
//     setIsSubmitting(true);
//     setTimeout(() => {
//       setIsSubmitting(false);
//       onClose();
//     }, 1000);
//   };

//   return (
//     <DialogContent className="bg-white border-slate-200 max-w-md">
//       <DialogHeader>
//         <DialogTitle className="text-slate-800">Create New Group</DialogTitle>
//       </DialogHeader>
      
//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-slate-700 mb-2">Group Name</label>
//           <Input
//             type="text"
//             value={groupName}
//             onChange={(e) => setGroupName(e.target.value)}
//             placeholder="Enter group name"
//             className="border-slate-300 focus:border-orange-500 focus:ring-orange-500"
//           />
//         </div>
        
//         <div>
//           <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
//           <Textarea
//             value={groupDescription}
//             onChange={(e) => setGroupDescription(e.target.value)}
//             placeholder="Describe the purpose of this group"
//             rows={4}
//             className="border-slate-300 focus:border-orange-500 focus:ring-orange-500"
//           />
//         </div>
        
//         <div>
//           <label className="block text-sm font-medium text-slate-700 mb-2">Group Image</label>
//           <div className="border border-dashed border-slate-300 rounded-lg p-6 text-center bg-slate-50">
//             <PlusCircle className="mx-auto w-10 h-10 text-slate-400 mb-2" />
//             <p className="text-sm text-slate-500">Click to upload image</p>
//           </div>
//         </div>
//       </div>
      
//       <div className="flex justify-end space-x-3 mt-6">
//         <Button variant="outline" onClick={onClose} className="border-slate-300 text-slate-700">
//           Cancel
//         </Button>
//         <Button 
//           onClick={handleSubmit}
//           disabled={isSubmitting}
//           className="bg-orange-500 hover:bg-orange-600 text-white"
//         >
//           {isSubmitting && <RefreshCw className="animate-spin mr-2 h-4 w-4" />}
//           Create Group
//         </Button>
//       </div>
//     </DialogContent>
//   );
// }

// // Request Modal
// function RequestModal({ onClose }: { onClose: () => void }) {
//   const [requestType, setRequestType] = useState<'create' | 'moderator'>('create');
//   const [groupName, setGroupName] = useState('');
//   const [groupDescription, setGroupDescription] = useState('');
//   const [selectedGroupId, setSelectedGroupId] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     setTimeout(() => {
//       setIsSubmitting(false);
//       onClose();
//     }, 1000);
//   };

//   return (
//     <DialogContent className="bg-white border-slate-200 max-w-md">
//       <DialogHeader>
//         <DialogTitle className="text-slate-800">Send Request</DialogTitle>
//       </DialogHeader>
      
//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-slate-700 mb-2">Request Type</label>
//           <div className="flex space-x-2">
//             <Button
//               onClick={() => setRequestType('create')}
//               variant={requestType === 'create' ? 'default' : 'outline'}
//               className={requestType === 'create' 
//                 ? 'flex-1 bg-orange-500 hover:bg-orange-600 text-white' 
//                 : 'flex-1 border-slate-300 text-slate-700 hover:bg-slate-50'
//               }
//             >
//               Create Group
//             </Button>
//             <Button
//               onClick={() => setRequestType('moderator')}
//               variant={requestType === 'moderator' ? 'default' : 'outline'}
//               className={requestType === 'moderator' 
//                 ? 'flex-1 bg-orange-500 hover:bg-orange-600 text-white' 
//                 : 'flex-1 border-slate-300 text-slate-700 hover:bg-slate-50'
//               }
//             >
//               Become Moderator
//             </Button>
//           </div>
//         </div>

//         {requestType === 'create' ? (
//           <>
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">Group Name</label>
//               <Input
//                 type="text"
//                 value={groupName}
//                 onChange={(e) => setGroupName(e.target.value)}
//                 placeholder="Enter proposed group name"
//                 className="border-slate-300 focus:border-orange-500 focus:ring-orange-500"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
//               <Textarea
//                 value={groupDescription}
//                 onChange={(e) => setGroupDescription(e.target.value)}
//                 placeholder="Explain why this group should be created"
//                 rows={4}
//                 className="border-slate-300 focus:border-orange-500 focus:ring-orange-500"
//               />
//             </div>
//           </>
//         ) : (
//           <>
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">Select Group</label>
//               <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
//                 <SelectTrigger className="border-slate-300 focus:border-orange-500 focus:ring-orange-500">
//                   <SelectValue placeholder="Choose a group..." />
//                 </SelectTrigger>
//                 <SelectContent className="bg-white border-slate-200">
//                   <SelectItem value="1">Fitness Community</SelectItem>
//                   <SelectItem value="2">Tech Enthusiasts</SelectItem>
//                   <SelectItem value="3">Book Club</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">Why do you want to be a moderator?</label>
//               <Textarea
//                 value={groupDescription}
//                 onChange={(e) => setGroupDescription(e.target.value)}
//                 placeholder="Explain your motivation and qualifications"
//                 rows={4}
//                 className="border-slate-300 focus:border-orange-500 focus:ring-orange-500"
//               />
//             </div>
//           </>
//         )}
//       </div>
      
//       <div className="flex justify-end space-x-3 mt-6">
//         <Button variant="outline" onClick={onClose} className="border-slate-300 text-slate-700">
//           Cancel
//         </Button>
//         <Button 
//           onClick={handleSubmit}
//           disabled={isSubmitting}
//           className="bg-orange-500 hover:bg-orange-600 text-white"
//         >
//           {isSubmitting && <RefreshCw className="animate-spin mr-2 h-4 w-4" />}
//           Send Request
//         </Button>
//       </div>
//     </DialogContent>
//   );
// }

// // Management Modal
// function ManagementModal({ 
//   requests,
//   onClose
// }: { 
//   requests: GroupRequest[],
//   onClose: () => void
// }) {
//   return (
//     <DialogContent className="bg-white border-slate-200 max-w-4xl max-h-[80vh] overflow-y-auto">
//       <DialogHeader>
//         <DialogTitle className="text-slate-800">Manage Requests</DialogTitle>
//       </DialogHeader>
      
//       <Tabs defaultValue="pending" className="w-full">
//         <TabsList className="grid w-full grid-cols-3 bg-slate-100">
//           <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:text-orange-600">
//             Pending ({requests.filter(r => r.status === 'pending').length})
//           </TabsTrigger>
//           <TabsTrigger value="approved" className="data-[state=active]:bg-white data-[state=active]:text-orange-600">
//             Approved ({requests.filter(r => r.status === 'approved').length})
//           </TabsTrigger>
//           <TabsTrigger value="rejected" className="data-[state=active]:bg-white data-[state=active]:text-orange-600">
//             Rejected ({requests.filter(r => r.status === 'rejected').length})
//           </TabsTrigger>
//         </TabsList>
        
//         {(['pending', 'approved', 'rejected'] as const).map((status) => (
//           <TabsContent key={status} value={status} className="mt-4">
//             <div className="space-y-4">
//               {requests.filter(r => r.status === status).length === 0 ? (
//                 <div className="text-center py-8">
//                   <Clock className="mx-auto w-12 h-12 text-slate-300 mb-4" />
//                   <p className="text-slate-500">No {status} requests</p>
//                 </div>
//               ) : (
//                 requests.filter(r => r.status === status).map((request) => (
//                   <Card key={request.id} className="bg-slate-50 border-slate-200">
//                     <CardContent className="p-4">
//                       <div className="flex justify-between items-start">
//                         <div className="flex-1">
//                           <div className="flex items-center gap-2 mb-2">
//                             <Badge 
//                               variant="secondary"
//                               className={request.requestType === 'create' 
//                                 ? 'bg-orange-100 text-orange-800' 
//                                 : 'bg-slate-100 text-slate-800'
//                               }
//                             >
//                               {request.requestType === 'create' ? 'Create Group' : 'Become Moderator'}
//                             </Badge>
//                             <span className="text-sm text-slate-500">{request.createdAt}</span>
//                           </div>
//                           <h4 className="font-semibold text-slate-800">{request.userName}</h4>
//                           <p className="text-sm text-slate-600 mb-2">
//                             {request.requestType === 'create' 
//                               ? `Wants to create: "${request.groupName}"` 
//                               : `Wants to moderate: "${request.groupName}"`
//                             }
//                           </p>
//                           {request.description && (
//                             <p className="text-sm text-slate-500">{request.description}</p>
//                           )}
//                         </div>
                        
//                         {status === 'pending' && (
//                           <div className="flex gap-2 ml-4">
//                             <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
//                               <Check className="mr-1 h-4 w-4" /> Approve
//                             </Button>
//                             <Button size="sm" variant="destructive" className="bg-slate-600 hover:bg-slate-700">
//                               <X className="mr-1 h-4 w-4" /> Reject
//                             </Button>
//                           </div>
//                         )}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))
//               )}
//             </div>
//           </TabsContent>
//         ))}
//       </Tabs>
      
//       <div className="flex justify-end mt-6">
//         <Button variant="outline" onClick={onClose} className="border-slate-300 text-slate-700">
//           Close
//         </Button>
//       </div>
//     </DialogContent>
//   );
// }

// export default CommunityGroups;