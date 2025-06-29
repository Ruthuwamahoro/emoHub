"use client";
import React, { useState, useMemo } from 'react';
import { Search, UserCheck, UserX, Trash2, MoreHorizontal, Mail, Calendar, Shield } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { usegetAllUsers } from '@/hooks/users/useAllUsers';

const TableSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between p-4 bg-slate-50/50 rounded-lg border">
        <div className="h-10 bg-gray-200 rounded-md w-full max-w-md animate-pulse"></div>
        <div className="flex gap-4">
          <div className="h-10 bg-gray-200 rounded-md w-[180px] animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded-md w-[180px] animate-pulse"></div>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <div className="bg-muted/50 p-4 border-b">
          <div className="grid grid-cols-7 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
        {Array.from({ length: 4 }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4 border-b">
            <div className="grid grid-cols-7 gap-4 items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="flex gap-2 justify-end">
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg border">
        <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const getInitials = (name?: string) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: {
    name: string;
    id: string;
  };
  isActive: boolean;
  profilePicUrl?: string;
  createdAt: string;
  isVerified: boolean;
  onboardingCompleted: boolean;
}

const UserManagementTable = () => {
  const {
    data,
    isPending
  } = usegetAllUsers();
  

  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [localUsers, setLocalUsers] = useState<User[]>(data?.data);


  const roles = ['All', 'Admin', 'Moderator', 'SuperAdmin', 'Specialist', 'User'];
  const statuses = ['All', 'Active', 'Disabled'];

  React.useEffect(() => {
    if (data?.data) {
      setLocalUsers(data.data);
    }
  }, [data?.data]);
  
  const filteredUsers = useMemo(() => {
    const usersToFilter = localUsers || data?.data || [];
    
    console.log('Users Data:', data?.data);
    console.log('Local Users:', localUsers);
    console.log('Users to filter:', usersToFilter);
    
    return usersToFilter.filter(user => {
      const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.username.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'All' || user.role.name === roleFilter;
      const matchesStatus = statusFilter === 'All' || 
                           (statusFilter === 'Active' && user.isActive) ||
                           (statusFilter === 'Disabled' && !user.isActive);
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [localUsers, data?.data, searchTerm, roleFilter, statusFilter]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleRoleChange = (userId: string, newRole: string) => {
    setLocalUsers(localUsers.map(user => 
      user.id === userId ? { ...user, role: { name: newRole, id: newRole } } : user
    ));
  };

  const handleStatusToggle = (userId: string) => {
    setLocalUsers(localUsers.map(user => 
      user.id === userId 
        ? { ...user, isActive: !user.isActive } 
        : user
    ));
  };

  const handleDelete = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setLocalUsers(localUsers.filter(user => user.id !== userId));
      const newFilteredUsers = localUsers.filter(user => user.id !== userId).filter(user => {
        const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             user.username.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All' || user.role.name === roleFilter;
        const matchesStatus = statusFilter === 'All' || 
                             (statusFilter === 'Active' && user.isActive) ||
                             (statusFilter === 'Disabled' && !user.isActive);
        return matchesSearch && matchesRole && matchesStatus;
      });
      const newTotalPages = Math.ceil(newFilteredUsers.length / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    }
  };

  const getRoleColor = (role: string) => {
    const colors = {
      Admin: 'bg-red-100 text-red-800 border-red-200',
      SuperAdmin: 'bg-purple-100 text-purple-800 border-purple-200',
      Moderator: 'bg-blue-100 text-blue-800 border-blue-200',
      User: 'bg-gray-100 text-gray-800 border-gray-200',
      Specialist: 'bg-green-100 text-green-800 border-green-200',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (isPending) {
    return (
      <div className="container mx-auto p-4 max-w-7xl">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white">
            <CardTitle className="text-2xl font-bold">User Management</CardTitle>
            <CardDescription className="text-slate-200">
              Manage users, roles, and permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <TableSkeleton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white">
          <CardTitle className="text-2xl font-bold">User Management</CardTitle>
          <CardDescription className="text-slate-200">
            Manage users, roles, and permissions
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6 p-4 bg-slate-50 rounded-lg border">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[140px] h-10">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] h-10">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-full">
              <div className="hidden lg:block">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="text-left p-4 font-semibold text-sm text-gray-700">User</th>
                      <th className="text-left p-4 font-semibold text-sm text-gray-700">Email</th>
                      <th className="text-left p-4 font-semibold text-sm text-gray-700">Role</th>
                      <th className="text-left p-4 font-semibold text-sm text-gray-700">Status</th>
                      <th className="text-left p-4 font-semibold text-sm text-gray-700">Verified</th>
                      <th className="text-left p-4 font-semibold text-sm text-gray-700">Joined</th>
                      <th className="text-right p-4 font-semibold text-sm text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              {user.profilePicUrl ? (
                                <img
                                  src={user.profilePicUrl}
                                  alt={user.fullName}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-600">
                                  {getInitials(user.fullName)}
                                </div>
                              )}
                              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                                user.isActive ? 'bg-green-500' : 'bg-gray-400'
                              }`} />
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-sm truncate">{user.fullName}</div>
                              <div className="text-xs text-gray-500 truncate">@{user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm truncate max-w-[200px]" title={user.email}>
                            {user.email}
                          </div>
                        </td>
                        <td className="p-4">
                          <Select
                            value={user.role.name}
                            onValueChange={(value) => handleRoleChange(user.id, value)}
                          >
                            <SelectTrigger className="w-[120px] h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.slice(1).map(role => (
                                <SelectItem key={role} value={role}>{role}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                            user.isActive 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : 'bg-gray-100 text-gray-800 border-gray-200'
                          }`}>
                            {user.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                            user.isVerified 
                              ? 'bg-blue-100 text-blue-800 border-blue-200' 
                              : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          }`}>
                            {user.isVerified ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: '2-digit'
                          })}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusToggle(user.id)}
                              className={`h-8 w-8 p-0 ${user.isActive ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}
                              title={user.isActive ? 'Disable User' : 'Enable User'}
                            >
                              {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(user.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {paginatedUsers.map((user) => (
                  <Card key={user.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="relative">
                          {user.profilePicUrl ? (
                            <img
                              src={user.profilePicUrl}
                              alt={user.fullName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-600">
                              {getInitials(user.fullName)}
                            </div>
                          )}
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                            user.isActive ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold truncate">{user.fullName}</div>
                          <div className="text-sm text-gray-500 truncate">@{user.username}</div>
                          <div className="text-sm text-gray-600 truncate">{user.email}</div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusToggle(user.id)}
                          className={`h-8 w-8 p-0 ${user.isActive ? 'text-orange-600' : 'text-green-600'}`}
                        >
                          {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          className="h-8 w-8 p-0 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role.name)}`}>
                        <Shield className="w-3 h-3 mr-1" />
                        {user.role.name}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-gray-100 text-gray-800 border-gray-200'
                      }`}>
                        {user.isActive ? 'Active' : 'Disabled'}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                        user.isVerified 
                          ? 'bg-blue-100 text-blue-800 border-blue-200' 
                          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }`}>
                        {user.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(user.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-start gap-4 mt-6 p-4 bg-slate-50 rounded-lg border">
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
            </div>
            
            {totalPages > 1 && (
              <Pagination className=''>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-accent'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-accent'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementTable;