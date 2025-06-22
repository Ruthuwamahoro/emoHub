"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { X, Plus, Eye, Trash2, Brain, Target, Users, Calendar, Clock } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useGetAllEmotionsInputs } from '@/hooks/emotions/useGetAllEmotionsInsights';

// Types
type MoodType = 'happy' | 'annoyed' | 'angry' | 'tired' | 'neutral' | 'loved';
type UserRole = 'User' | 'Admin' | 'Specialist' | 'SuperAdmin';

interface MoodEntry {
  id: string;
  userId: string;
  userName: string;
  mood: MoodType;
  intensity: number;
  timestamp: Date;
  notes?: string;
  tags?: string[];
}

interface User {
  id: string;
  name: string;
  username: string;
  image?: string;
}

interface EmotionEntry {
  id: string;
  feelings: string;
  emotionIntensity: number;
  notes: string;
  activities: string[];
  createdAt: string;
  updatedAt: string;
  user: User;
}

const EmotionTrackingApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { data: session } = useSession();
  const {
    data,
    isLoading,
    isPending,
    isFetching,
  } = useGetAllEmotionsInputs();

  const moodEmojis: Record<string, string> = {
    Happy: '😊',
    Sad: '😢',
    Excited: '🤗',
    Angry: '😠',
    Neutral: '😐',
    Loved: '💖',
    Annoyed: '😤'
  };

  const moodLabels: Record<string, string> = {
    Happy: 'Happy',
    Sad: 'Sad',
    Excited: 'Excited',
    Angry: 'Angry',
    Neutral: 'Neutral',
    Loved: 'Loved',
  };

  const moodColors: Record<string, string> = {
    Happy: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
    Sad: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    Excited: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
    Angry: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
    Neutral: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100',
    Loved: 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100',
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Pagination logic
  const emotionEntries = data?.data || [];
  const totalPages = Math.ceil(emotionEntries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEntries = emotionEntries.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageClick(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageClick(1)}
            isActive={currentPage === 1}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if needed
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageClick(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page if there are multiple pages
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => handlePageClick(totalPages)}
              isActive={currentPage === totalPages}
              className="cursor-pointer"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  const AdminDashboard = () => (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Users className="h-6 w-6 text-blue-600" />
            Emotion Records Dashboard
          </CardTitle>
          <CardDescription className="text-base">
            View and manage all user emotion entries ({emotionEntries.length} total records)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="font-semibold">User</TableHead>
                  <TableHead className="font-semibold">Emotion</TableHead>
                  <TableHead className="font-semibold">Intensity</TableHead>
                  <TableHead className="font-semibold">Date & Time</TableHead>
                  <TableHead className="font-semibold">Activities</TableHead>
                  <TableHead className="font-semibold">Notes</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading || isPending ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        Loading emotion records...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : currentEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No emotion records found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentEntries.map((entry: EmotionEntry) => {
                    const { date, time } = formatDateTime(entry.createdAt);
                    return (
                      <TableRow key={entry.id} className="hover:bg-gray-50/50 transition-colors">
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-gray-100">
                              {entry.user.image ? (
                                <AvatarImage 
                                  src={entry.user.image} 
                                  alt={entry.user.name}
                                  className="object-cover"
                                />
                              ) : null}
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                {getInitials(entry.user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {entry.user.name}
                              </div>
                              <div className="text-sm text-gray-500 truncate">
                                @{entry.user.username}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{moodEmojis[entry.feelings]}</span>
                            <Badge 
                              variant="outline" 
                              className={`${moodColors[entry.feelings]} font-medium px-3 py-1 transition-colors`}
                            >
                              {moodLabels[entry.feelings]}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <Progress 
                              value={entry.emotionIntensity} 
                              className="w-20 h-2"
                            />
                            <span className="text-sm font-semibold text-gray-700 min-w-[35px]">
                              {entry.emotionIntensity}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                              <Calendar className="h-3 w-3" />
                              {date}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              {time}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {entry.activities?.slice(0, 2).map((activity, index) => (
                              <Badge 
                                key={index} 
                                variant="secondary" 
                                className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                              >
                                {activity}
                              </Badge>
                            ))}
                            {entry.activities && entry.activities.length > 2 && (
                              <Badge 
                                variant="secondary" 
                                className="text-xs bg-gray-100 text-gray-600 border-gray-200"
                              >
                                +{entry.activities.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="max-w-xs">
                            <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                              {entry.notes || 'No notes provided'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50/30">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, emotionEntries.length)} of {emotionEntries.length} entries
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={handlePreviousPage}
                      className={`cursor-pointer ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
                    />
                  </PaginationItem>
                  
                  {renderPaginationItems()}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={handleNextPage}
                      className={`cursor-pointer ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{emotionEntries.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              Emotion records tracked
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {new Set(emotionEntries.map((entry: EmotionEntry) => entry.user.id)).size}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Users tracking emotions
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Most Common Mood</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl">😊</span>
              <div className="text-xl font-bold text-gray-900">Happy</div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Across all users
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="font-bold text-3xl text-gray-900">Day Plan And Emotions Inputs</h1>
              <p className='text-orange-500 text-lg font-semibold'>Start your day with energy</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <AdminDashboard />
      </main>
    </div>
  );
};

export default EmotionTrackingApp;