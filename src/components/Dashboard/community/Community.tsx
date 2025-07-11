"use client"
import React, { useState } from 'react';
import { Users, ArrowRight, PlusCircle, RefreshCw, Search, Filter, Heart, Settings, UserPlus, Shield, Clock, Check, X, Eye, Edit, AlertTriangle, Flame, Zap, Star, MessageCircle, ThumbsUp, Flag, ChevronLeft } from "lucide-react";
import { useRouter } from 'next/navigation';
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
import { Edit2 } from 'lucide-react';
import { Delete } from 'lucide-react';
import { DeleteIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

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
  userId: string;
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

interface ReportedPost {
  id: number;
  title: string;
  content: string;
  author: string;
  authorAvatar?: string;
  groupName: string;
  reportReason: string;
  reportedBy: string;
  reportedAt: string;
  status: 'pending' | 'reviewed' | 'resolved';
  severity: 'low' | 'medium' | 'high';
}

export default function CommunityGroups() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showReportedPosts, setShowReportedPosts] = useState(false);
  
  const { 
    data, 
    isPending, 
    refetch, 
  } = useGetAllGroups(session?.user?.id);

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


  const [reportedPosts] = useState<ReportedPost[]>([
    {
      id: 1,
      title: "Inappropriate content in discussion",
      content: "This post contains offensive language and violates community guidelines...",
      author: "user123",
      authorAvatar: "/api/placeholder/40/40",
      groupName: "Tech Enthusiasts",
      reportReason: "Harassment/Bullying",
      reportedBy: "moderator1",
      reportedAt: "2024-06-28T10:30:00Z",
      status: "pending",
      severity: "high"
    },
    {
      id: 2,
      title: "Spam promotion post",
      content: "Check out this amazing product! Click here to buy now...",
      author: "spammer456",
      groupName: "Fitness Community",
      reportReason: "Spam/Self-promotion",
      reportedBy: "user789",
      reportedAt: "2024-06-28T09:15:00Z",
      status: "pending",
      severity: "medium"
    },
    {
      id: 3,
      title: "Off-topic discussion",
      content: "Let's talk about politics instead of fitness...",
      author: "offtopic789",
      groupName: "Fitness Community",
      reportReason: "Off-topic",
      reportedBy: "groupmember",
      reportedAt: "2024-06-28T08:45:00Z",
      status: "reviewed",
      severity: "low"
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

  const isGroupCreator = (group: Group) => {
    return group.userId === session?.user?.id;
  };

  const handleReportAction = (postId: number, action: 'resolve' | 'dismiss') => {
    showToast(`Post ${action === 'resolve' ? 'resolved' : 'dismissed'} successfully!`, 'success');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const YourGroupsSkeleton = () => (
    <section className="mb-8">
      <div className="flex items-center mb-6">
        <div className="w-6 h-6 bg-gray-200 rounded mr-2 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 animate-pulse">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-200 mr-4"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-100 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const DiscoverGroupsSkeleton = () => (
    <section>
      <div className="h-6 bg-gray-200 rounded w-40 mb-6 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 animate-pulse overflow-hidden">
            <div className="h-48 w-full bg-gray-200"></div>
            <div className="p-6">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-100 rounded w-full mb-1"></div>
              <div className="h-4 bg-gray-100 rounded w-2/3 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded-full w-full"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  if (showReportedPosts) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setShowReportedPosts(false)}
                  className="mr-2 sm:mr-4 p-1.5 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                    Reported Posts
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 hidden sm:block">Review and manage reported content from community groups</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-2 sm:p-3 bg-red-100 rounded-xl sm:rounded-2xl">
                  <Flag className="w-4 h-4 sm:w-6 sm:h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Reported Posts Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            {reportedPosts.map((post) => (
              <div key={post.id} className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 p-4 sm:p-6 hover:shadow-2xl transition-all duration-300">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                      {post.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">@{post.author}</p>
                      <p className="text-xs sm:text-sm text-gray-500">{post.groupName}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(post.severity)}`}>
                      {post.severity.toUpperCase()}
                    </span>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                      {post.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{post.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm line-clamp-3 bg-gray-50 rounded-xl p-3">
                    {post.content}
                  </p>
                </div>

                {/* Report Details */}
                <div className="bg-red-50 rounded-xl p-3 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Flag className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                    <span className="text-xs sm:text-sm font-medium text-red-800">Report Reason</span>
                  </div>
                  <p className="text-xs sm:text-sm text-red-700">{post.reportReason}</p>
                  <p className="text-xs text-red-600 mt-1">
                    Reported by {post.reportedBy} • {new Date(post.reportedAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                {post.status === 'pending' && (
                  <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={() => handleReportAction(post.id, 'resolve')}
                      className="w-full sm:flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 sm:px-4 py-2 rounded-full font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
                    >
                      <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Resolve</span>
                    </button>
                    <button
                      onClick={() => handleReportAction(post.id, 'dismiss')}
                      className="w-full sm:flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-3 sm:px-4 py-2 rounded-full font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Dismiss</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {reportedPosts.length === 0 && (
            <div className="text-center py-8 sm:py-12 bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">All Clear!</h3>
              <p className="text-sm sm:text-base text-gray-500">No reported posts to review at the moment</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl bg-gradient-to-r from-slate-600 via-orange-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  Community Groups ✨
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Connect, collaborate, and grow with passionate communities worldwide.<br className="hidden sm:block"/>
                  <span className="hidden sm:inline">Discover your emotions and unlock endless possibilities 🚀</span>
                  <span className="sm:hidden">Discover emotions & possibilities 🚀</span>
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                {canManageGroups && (
                  <>
                    <Button 
                      onClick={() => setIsCreateModalOpen(true)}
                      className="flex-1 sm:flex-none flex items-center justify-center bg-slate-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                    >
                      <PlusCircle className="mr-1 sm:mr-2" size={16} /> 
                      <span className="hidden xs:inline">Create Group</span>
                      <span className="xs:hidden">Create</span>
                    </Button>

                    <Button 
                      onClick={() => setIsManageModalOpen(true)}
                      className="flex-1 sm:flex-none flex items-center justify-center bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                    >
                      <Settings className="mr-1 sm:mr-2" size={16} /> 
                      <span className="hidden xs:inline">Manage</span>
                      <span className="xs:hidden">Manage</span>
                    </Button>
                  </>
                )}
                {isRegularUser && (
                  <Button 
                    onClick={() => setIsRequestModalOpen(true)}
                    className="flex-1 sm:flex-none flex items-center justify-center bg-gradient-to-r from-slate-500 to-slate-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                  >
                    <UserPlus className="mr-1 sm:mr-2" size={16} /> 
                    <span className="hidden xs:inline">Request</span>
                    <span className="xs:hidden">Request</span>
                  </Button>
                )}

                <Button             
                  onClick={() => setShowReportedPosts(true)}
                  className="flex-1 sm:flex-none bg-amber-500 hover:bg-amber-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">Reported Posts</span>
                  <span className="sm:hidden">Reports</span>
                </Button>
              </div>
            </div>
            
        
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="relative w-full md:w-[500px]">
                  <input
                    type="text"
                    placeholder="Search groups... 🔍"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:border-transparent bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                  />
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>
            </div>
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
              <section className="mb-6 sm:mb-8 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50 px-4 sm:px-6 md:px-9 py-4 sm:py-5 rounded-2xl sm:rounded-3xl">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 bg-slate-600 bg-clip-text text-transparent flex items-center">
                  <Heart className="mr-2 sm:mr-3 text-slate-500" size={20} />
                  Your Groups 💖
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {joinedGroups.map((group) => (
                    <div 
                      key={group.id} 
                      className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:rotate-1"
                    >
                      <div className="flex items-center mb-4">
                        <div className="mr-3 sm:mr-4 relative">
                          {group.image ? (
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                              <Image
                                src={group.image}
                                alt={group.name}
                                width={64}
                                height={64}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
                              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                          )}
                          <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 truncate">{group.name}</h3>
                          <div className="flex items-center space-x-2">
                            {group.memberCount && (
                              <span className="text-xs sm:text-sm text-gray-500 flex items-center">
                                <Users className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                                {group.memberCount}
                              </span>
                            )}
                            <span className="px-2 py-0.5 sm:py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                              Joined ✨
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-0">
                        <Button 
                          onClick={() => handleViewGroup(group.id)}
                          className="text-white hover:text-purple-700 flex items-center justify-center bg-amber-500 px-4 sm:px-8 py-2 sm:py-4 rounded-xl hover:bg-purple-100 transition-all duration-200 text-sm sm:text-base font-light"
                        >
                          View <ArrowRight className="ml-1 w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        
                        <div className="flex gap-2 justify-center sm:justify-end">
                          {isGroupCreator(group) ? (
                            <>
                              <button className="text-blue-600 hover:text-blue-700 p-1.5 sm:p-2 bg-blue-50 rounded-full hover:bg-blue-100 transition-all duration-200">
                                <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <button className="text-amber-500 hover:text-amber-600 p-1.5 sm:p-2 bg-red-50 rounded-full hover:bg-red-100 transition-all duration-200">
                                <DeleteIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </>
                          ) : (
                            <Button 
                              onClick={() => handleExitGroup(group.id)}
                              className="text-white text-xs sm:text-sm font-extrabold bg-gradient-to-r from-slate-500 to-slate-600  px-4 sm:px-8 py-2 sm:py-4 rounded-xl transition-all duration-200"
                            >
                              Leave
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 bg-slate-600 bg-clip-text text-transparent flex items-center">
                <Eye className="mr-2 sm:mr-3 text-slate-500" size={20} />
                Discover Groups 🌟
              </h2>
              
              {discoverGroups.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {discoverGroups.map((group) => (
                    <div 
                      key={group.id} 
                      className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:rotate-1"
                    >
                      <div className="h-32 sm:h-48 w-full relative overflow-hidden">
                        {group.image ? (
                          <Image 
                            src={group.image} 
                            alt={group.name} 
                            fill 
                            className="object-cover transition-transform duration-300 hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
                            <Users className="w-10 h-10 sm:w-16 sm:h-16 text-white opacity-80" />
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        
                        {group.memberCount && (
                          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-gray-700 shadow-lg">
                            <Users className="w-2 h-2 sm:w-3 sm:h-3 inline mr-1" />
                            {group.memberCount}
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{group.name}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2 text-sm sm:text-base">
                          {group.description || 'Join this exciting community and connect with like-minded individuals! 🚀'}
                        </p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex -space-x-1 sm:-space-x-2">
                              {[...Array(3)].map((_, i) => (
                                <div 
                                  key={i} 
                                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                                >
                                  {String.fromCharCode(65 + i)}
                                </div>
                              ))}
                            </div>
                            <span className="text-xs sm:text-sm text-gray-500">+{group.memberCount || 0} members</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                            <span className="text-xs sm:text-sm font-medium text-gray-600">4.8</span>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => handleJoinGroup(group.id)}
                          className="w-full bg-slate-600 text-white py-2 sm:py-3 rounded-xl sm:rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium transform hover:scale-105 flex items-center justify-center space-x-2 text-sm sm:text-base"
                        >
                          <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>
                            {isPending ? (
                              <span className="flex items-center">
                                <Loader2 className="h-4 w-4 sm:h-8 sm:w-8 animate-spin text-purple-600 mr-1" />
                                <span className="hidden sm:inline">Joining Group</span>
                                <span className="sm:hidden">Joining</span>
                              </span>
                            ): (
                              <>
                                <span className="hidden sm:inline">Join Group</span>
                                <span className="sm:hidden">Join</span>
                              </>
                            )}
                          </span>
                          <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 sm:py-16 bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20">
                  <div className="max-w-md mx-auto px-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                      <Users className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-3">No Groups Found</h3>
                    <p className="text-sm sm:text-base text-gray-500 mb-6">
                      {searchTerm 
                        ? 'No groups match your search. Try different keywords! 🔍' 
                        : 'No groups available right now. Check back soon for new communities! ✨'
                      }
                    </p>
                    {canManageGroups && (
                      <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                      >
                        <PlusCircle className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                        <span className="hidden sm:inline">Create First Group</span>
                        <span className="sm:hidden">Create Group</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </section>
          </>
        )}

        {/* Enhanced Floating Action Elements */}
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 flex flex-col space-y-2 sm:space-y-3 z-50">
          {/* Quick Stats Bubble */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-white/20 p-3 sm:p-4 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                {groups?.length || 0} Groups Active
              </span>
            </div>
          </div>

          {discoverGroups.length > 0 && (
            <button className="bg-slate-600 text-white p-3 sm:p-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 group flex justify-center items-center font-bold text-sm sm:text-base">
              <Heart className="w-4 h-4 sm:w-6 sm:h-6 group-hover:scale-125 transition-transform duration-300 mr-1" />
              {discoverGroups.length}
            </button>
          )}
        </div>

        {/* Modals */}
        {isCreateModalOpen && canManageGroups && (
          <CreateGroupModal 
            onClose={() => setIsCreateModalOpen(false)}
            onGroupCreated={() => {
              refetch();
              setIsCreateModalOpen(false);
            }}
          />
        )}

        {isRequestModalOpen && isRegularUser && (
          <RequestModal 
            onClose={() => setIsRequestModalOpen(false)}
            onRequestSent={() => {
              setIsRequestModalOpen(false);
              showToast('Request sent successfully! You will be notified once reviewed. ✨', 'success');
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