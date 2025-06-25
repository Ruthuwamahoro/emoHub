"use client"
import React, { useState } from 'react';
import { Users, Crown, Shield, User, Search, MoreVertical, Mail, Calendar, UserX, UserCheck } from 'lucide-react';
import Image from 'next/image';
import { useAllMembersGroup } from '@/hooks/users/groups/members/useGetAllmembers';
import { Badge } from '@/components/ui/badge';

// TypeScript interfaces
interface GroupMember {
  id: string;
  name: string;
  username?: string;
  avatar?: string | null;
  role: {
    name: string;
  };
  joinedAt: string;
  isOnline?: boolean;
  status?: 'active' | 'inactive';
}

interface GroupMembersDisplayProps {
  groupId: string;
  groupName?: string;
  canManageMembers?: boolean;
}

// Member skeleton component
const MemberSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
      <div className="flex-1">
        <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      </div>
      <div className="flex flex-col space-y-2">
        <div className="w-20 h-6 bg-gray-300 rounded-full"></div>
        <div className="w-8 h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

// Members grid skeleton
const MembersGridSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between mb-6">
      <div className="h-8 bg-gray-300 rounded w-48 animate-pulse"></div>
      <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
    </div>
    <div className="grid grid-cols-1 gap-4">
      {[...Array(6)].map((_, index) => (
        <MemberSkeleton key={index} />
      ))}
    </div>
  </div>
);

const RoleBadge: React.FC<{ roleName: string }> = ({ roleName }) => {
  const normalizedRole = roleName?.toLowerCase().trim() || '';
  
  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'admin':
      case 'administrator':
        return {
          icon: Crown,
          bgColor: 'bg-gradient-to-r from-yellow-50 to-amber-50',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-300',
          iconColor: 'text-yellow-600',
          label: 'Admin',
          shadowColor: 'shadow-yellow-100'
        };
      case 'moderator':
      case 'mod':
        return {
          icon: Shield,
          bgColor: 'bg-gradient-to-r from-blue-50 to-indigo-50',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-300',
          iconColor: 'text-blue-600',
          label: 'Moderator',
          shadowColor: 'shadow-blue-100'
        };
      case 'member':
      case 'user':
      default:
        return {
          icon: User,
          bgColor: 'bg-gradient-to-r from-gray-50 to-slate-50',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-300',
          iconColor: 'text-gray-500',
          label: roleName || 'Member',
          shadowColor: 'shadow-gray-100'
        };
    }
  };

  const config = getRoleConfig(normalizedRole);
  const IconComponent = config.icon;

  return (
    <Badge className={`
      ${config.bgColor} 
      ${config.textColor} 
      ${config.borderColor}
      ${config.shadowColor}
      border-2 
      shadow-md 
      hover:shadow-lg 
      transition-all 
      duration-200 
      font-semibold 
      text-xs 
      px-3 
      py-1.5
      flex 
      items-center 
      gap-1.5
      hover:scale-105
    `}>
      <IconComponent className={`w-3.5 h-3.5 ${config.iconColor}`} />
      {config.label}
    </Badge>
  );
};

// Individual member card component
const MemberCard: React.FC<{ 
  member: GroupMember; 
  canManageMembers: boolean;
  onMemberAction?: (memberId: string, action: 'promote' | 'demote' | 'remove') => void;
}> = ({ member, canManageMembers, onMemberAction }) => {
  const [showActions, setShowActions] = useState(false);

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Safe role name extraction
  const roleName = member?.role?.name || 'member';
  const normalizedRole = roleName.toLowerCase().trim();

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center space-x-4">
        <div className="relative">
          {member.avatar ? (
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-100">
              <Image
                src={member.avatar}
                alt={member.name}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center border-2 border-purple-100">
              <User className="w-8 h-8 text-purple-600" />
            </div>
          )}
          {member.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{member.name}</h3>
          {member.username && (
            <p className="text-sm text-gray-500 truncate flex items-center mt-1">
              <Mail className="w-4 h-4 mr-1" />
              @{member.username}
            </p>
          )}
          <p className="text-xs text-gray-400 flex items-center mt-1">
            <Calendar className="w-3 h-3 mr-1" />
            Joined {formatJoinDate(member.joinedAt)}
          </p>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <RoleBadge roleName={roleName} />
          
          {canManageMembers && (
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Member actions"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              
              {showActions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    {normalizedRole !== 'admin' && normalizedRole !== 'administrator' && (
                      <button
                        onClick={() => {
                          onMemberAction?.(member.id, 'promote');
                          setShowActions(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50 flex items-center"
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Promote to {normalizedRole === 'member' ? 'Moderator' : 'Admin'}
                      </button>
                    )}
                    {normalizedRole !== 'member' && normalizedRole !== 'user' && (
                      <button
                        onClick={() => {
                          onMemberAction?.(member.id, 'demote');
                          setShowActions(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-orange-700 hover:bg-orange-50 flex items-center"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Demote to {normalizedRole === 'admin' || normalizedRole === 'administrator' ? 'Moderator' : 'Member'}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        onMemberAction?.(member.id, 'remove');
                        setShowActions(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 flex items-center"
                    >
                      <UserX className="w-4 h-4 mr-2" />
                      Remove Member
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main GroupMembersDisplay component
export const GroupMembersDisplay: React.FC<GroupMembersDisplayProps> = ({ 
  groupId, 
  groupName,
  canManageMembers = false
}) => {
  const { data, isPending, error } = useAllMembersGroup(groupId);
  const [searchTerm, setSearchTerm] = useState('');

  // Handle member actions
  const handleMemberAction = (memberId: string, action: 'promote' | 'demote' | 'remove') => {
    // Implement your member management logic here
    console.log(`Action: ${action} for member: ${memberId}`);
    // You can add API calls here to handle the actions
  };

  // Handle error state
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-red-200 p-8 text-center">
        <div className="w-20 h-20 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-4">
          <Users className="w-10 h-10 text-red-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Members</h3>
        <p className="text-gray-600 mb-4">We couldn't fetch the group members. Please try again.</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  const members: GroupMember[] = data?.data || [];
  
  // Filter members based on search term with proper null checking
  const filteredMembers = members.filter(member => {
    // Skip members with invalid data
    if (!member || !member.id) return false;
    
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = member.name?.toLowerCase().includes(searchLower);
    const usernameMatch = member.username && typeof member.username === 'string' && member.username.toLowerCase().includes(searchLower);
    const roleMatch = member.role?.name && typeof member.role.name === 'string' && member.role.name.toLowerCase().includes(searchLower);
    return nameMatch || usernameMatch || roleMatch;
  });

  const totalMembers = members.length;
  
  // Count members by role with proper null checking
  const getRoleCounts = () => {
    const counts = {
      admins: 0,
      moderators: 0,
      members: 0,
      others: 0
    };

    members.forEach(member => {
      if (!member?.role?.name) {
        counts.others++;
        return;
      }

      const roleName = member.role.name.toLowerCase().trim();
      switch (roleName) {
        case 'admin':
        case 'administrator':
          counts.admins++;
          break;
        case 'moderator':
        case 'mod':
          counts.moderators++;
          break;
        case 'member':
        case 'user':
          counts.members++;
          break;
        default:
          counts.others++;
          break;
      }
    });

    return counts;
  };

  const roleCounts = getRoleCounts();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <Users className="mr-3 text-purple-600" size={32} />
              {groupName ? `${groupName} Members` : 'Group Members'}
            </h2>
            {!isPending && (
              <p className="text-gray-600 mt-2 text-lg">
                {totalMembers} {totalMembers === 1 ? 'member' : 'members'} in this group
              </p>
            )}
          </div>
        </div>

        {/* Member Stats */}
        {!isPending && totalMembers > 0 && (
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center text-yellow-700 bg-gradient-to-r from-yellow-50 to-amber-50 px-4 py-2 rounded-full border-2 border-yellow-200 shadow-md">
              <Crown className="w-4 h-4 mr-2" />
              {roleCounts.admins} {roleCounts.admins === 1 ? 'Admin' : 'Admins'}
            </div>
            <div className="flex items-center text-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-full border-2 border-blue-200 shadow-md">
              <Shield className="w-4 h-4 mr-2" />
              {roleCounts.moderators} {roleCounts.moderators === 1 ? 'Moderator' : 'Moderators'}
            </div>
            <div className="flex items-center text-gray-700 bg-gradient-to-r from-gray-50 to-slate-50 px-4 py-2 rounded-full border-2 border-gray-200 shadow-md">
              <User className="w-4 h-4 mr-2" />
              {roleCounts.members} {roleCounts.members === 1 ? 'Member' : 'Members'}
            </div>
            {roleCounts.others > 0 && (
              <div className="flex items-center text-purple-700 bg-gradient-to-r from-purple-50 to-violet-50 px-4 py-2 rounded-full border-2 border-purple-200 shadow-md">
                <Users className="w-4 h-4 mr-2" />
                {roleCounts.others} Other{roleCounts.others === 1 ? '' : 's'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Members List Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
        {isPending ? (
          <MembersGridSkeleton />
        ) : totalMembers === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto bg-purple-50 rounded-full flex items-center justify-center mb-6">
              <Users className="w-12 h-12 text-purple-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Members Found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              This group doesn't have any members yet. Invite people to join and start building your community!
            </p>
          </div>
        ) : (
          <div>
            {/* Search Bar */}
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-semibold text-gray-900">All Members ({filteredMembers.length})</h3>
              <div className="relative w-80">
                <input
                  type="text"
                  placeholder="Search members by name, username, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-sm"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            {/* Members Grid */}
            {filteredMembers.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {filteredMembers.map((member) => (
                  <MemberCard 
                    key={member.id} 
                    member={member} 
                    canManageMembers={canManageMembers}
                    onMemberAction={handleMemberAction}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Members Found</h3>
                <p className="text-gray-600">No members match your search criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupMembersDisplay;