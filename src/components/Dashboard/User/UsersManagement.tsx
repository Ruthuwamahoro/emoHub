"use client";
import React, { useState, useMemo } from 'react';
import { Search, UserCheck, UserX, Trash2 } from 'lucide-react';
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

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'Admin' | 'SuperAdmin' | 'User' | 'Moderator' | 'Specialist';
  status: 'Active' | 'Disabled';
  avatar: string;
  joinDate: string;
}

const UserManagementTable = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      username: 'alice.j',
      email: 'alice@company.com',
      role: 'Admin',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      joinDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Bob Smith',
      username: 'bob.smith',
      email: 'bob@company.com',
      role: 'SuperAdmin',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      joinDate: '2024-02-20'
    },
    {
      id: '3',
      name: 'Carol Davis',
      username: 'carol.d',
      email: 'carol@company.com',
      role: 'Moderator',
      status: 'Disabled',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      joinDate: '2024-03-10'
    },
    {
      id: '4',
      name: 'David Wilson',
      username: 'david.w',
      email: 'david@company.com',
      role: 'User',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      joinDate: '2024-01-25'
    },
    {
      id: '5',
      name: 'Emma Brown',
      username: 'emma.b',
      email: 'emma@company.com',
      role: 'Admin',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      joinDate: '2024-04-05'
    },
    {
      id: '6',
      name: 'Frank Miller',
      username: 'frank.m',
      email: 'frank@company.com',
      role: 'User',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      joinDate: '2024-02-15'
    },
    {
      id: '7',
      name: 'Grace Lee',
      username: 'grace.l',
      email: 'grace@company.com',
      role: 'Specialist',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face',
      joinDate: '2024-03-20'
    },
    {
      id: '8',
      name: 'Henry Clark',
      username: 'henry.c',
      email: 'henry@company.com',
      role: 'User',
      status: 'Disabled',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      joinDate: '2024-04-10'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);

  const roles = ['All', 'Admin', 'Moderator', 'SuperAdmin', 'Specialist', 'User'];
  const statuses = ['All', 'Active', 'Disabled'];

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.username.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'All' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleRoleChange = (userId: string, newRole: User['role']) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleStatusToggle = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Active' ? 'Disabled' : 'Active' } 
        : user
    ));
  };

  const handleDelete = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
      // Reset to first page if current page becomes empty
      const newFilteredUsers = users.filter(user => user.id !== userId).filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             user.username.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
      });
      const newTotalPages = Math.ceil(newFilteredUsers.length / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    }
  };

  const getRoleVariant = (role: string) => {
    const variants = {
      Admin: 'destructive',
      SuperAdmin: 'default',
      Moderator: 'secondary',
      User: 'outline',
      Specialist: 'default',
    };
    return variants[role as keyof typeof variants] || 'outline';
  };

  const getStatusVariant = (status: string) => {
    return status === 'Active' ? 'default' : 'secondary';
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl min-h-screen">
      <Card className="shadow-xl">
        <CardHeader className="bg-slate-500 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold">User Management</CardTitle>
          <CardDescription className="text-slate-200">
            Manage users, roles, and permissions
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6 p-4 bg-slate-50/50 rounded-lg border">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter By Role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter By Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="text-left px-6 py-4 font-semibold">User</th>
                  <th className="text-left px-6 py-4 font-semibold">Contact</th>
                  <th className="text-left px-6 py-4 font-semibold">Role</th>
                  <th className="text-left px-6 py-4 font-semibold">Status</th>
                  <th className="text-left px-6 py-4 font-semibold">Joined</th>
                  <th className="text-right px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user, index) => (
                  <tr 
                    key={user.id} 
                    className="border-b hover:bg-muted/50 transition-colors duration-150"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-background shadow-sm"
                          />
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
                            user.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                        </div>
                        <div>
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-sm text-muted-foreground">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <Select
                        value={user.role}
                        onValueChange={(value) => handleRoleChange(user.id, value as User['role'])}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.slice(1).map(role => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusVariant(user.status)}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusToggle(user.id)}
                          className={user.status === 'Active' ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50' : 'text-green-600 hover:text-green-700 hover:bg-green-50'}
                          title={user.status === 'Active' ? 'Disable User' : 'Enable User'}
                        >
                          {user.status === 'Active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
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

          {/* Footer with Results Info and Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 bg-slate-50/50 rounded-lg border">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
            </div>
            
            {totalPages > 1 && (
              <Pagination className='pl-[800px]'>
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