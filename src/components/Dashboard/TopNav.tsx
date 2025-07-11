"use client";
import React, { useState, useEffect } from "react";

import { CircleUser, Menu, Settings, LogOut, Bell, X } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { signOut, useSession } from "next-auth/react";

export const getInitials = (name?: string) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const getTimeAgo = (timestamp?: number) => {
  if (!timestamp) return 'Unknown';
  
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};

export default function HeaderDashboard() {
  const isLoading = false;
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(20);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const { data: session, status } = useSession();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000); 

    return () => clearInterval(interval);
  }, []);

  const router = useRouter();
  const handleSignOut = async () => {
    try {
      console.log('Attempting to sign out...');
      await signOut({ 
        callbackUrl: '/login',
        redirect: true 
      });
    } catch (error) {
      router.push('/login');
    }
  };

  const toggleMobileSidebar = () => {
    if (typeof window !== 'undefined' && (window as any).toggleMobileSidebar) {
      (window as any).toggleMobileSidebar();
    }
  };

  const notifications = [
    {
      id: 1,
      title: "System Update",
      message: "New features have been added to your dashboard",
      time: "2 hours ago",
      unread: true
    },
    {
      id: 2,
      title: "Maintenance Notice",
      message: "Scheduled maintenance on Sunday at 2 AM",
      time: "1 day ago",
      unread: true
    },
    {
      id: 3,
      title: "New Policy Update",
      message: "Please review the updated privacy policy",
      time: "3 days ago",
      unread: false
    },
    {
      id: 4,
      title: "Welcome Message",
      message: "Welcome to your new dashboard experience",
      time: "1 week ago",
      unread: false
    },
    {
      id: 5,
      title: "New Posted resources",
      message: "checkout new resources",
      time: "2 weeks ago",
      unread: true
    }
  ];

  const handleNotificationClick = () => {
    setIsNotificationPanelOpen(!isNotificationPanelOpen);
  };

  const handleCloseNotificationPanel = () => {
    setIsNotificationPanelOpen(false);
  };

  const markAllAsRead = () => {
    setNotificationCount(0);
  };

  const getLastLoginText = () => {
    return getTimeAgo(session?.loginTime);
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <header className="flex mt-2 rounded-[4px] items-center gap-4 px-4 lg:h-[60px] lg:px-6 w-full">
          <div className="w-full items-center justify-between flex">
            <div className="gap-3 flex items-center">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="w-16 h-4 rounded-md" />
            </div>

            <div className="gap-3 flex items-center">
              <Skeleton className="w-10 h-10 rounded-md" />
              <Skeleton className="w-10 h-10 rounded-full" />
            </div>
          </div>
        </header>
      </div>
    );
  }

  return (
    <>
      <header className="relative w-full max-w-full top-0 bg-white border-b border-gray-200 z-40">
        <div className="w-full">
          <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 h-[60px]">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="p-2 md:hidden" 
                onClick={toggleMobileSidebar}
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </Button>
              <Button variant="ghost" size="icon" className="p-2 hidden md:block">
                <Menu className="h-5 w-5 text-gray-600" />
              </Button>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 rounded-full hover:ring-2 hover:ring-blue-200 transition-all duration-200">
                    {session ? (
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8 cursor-pointer border-2 border-transparent hover:border-blue-300 transition-all duration-200">
                        <AvatarImage 
                          src={session.user.profilePicUrl || ""} 
                          alt={session.user.fullName || "User"}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs sm:text-sm font-medium">
                          {/* <AvatarImages
                            gender={session?.user?.gender || 'other'} 
                            name={session?.user?.username || 'Anonymous'} 
                            size={32}
                          /> */}
                          {getInitials(session?.user?.fullName)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                        <AvatarFallback>
                          <CircleUser className="h-5 w-5 sm:h-6 sm:w-6" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[280px] sm:w-[320px] p-0 border-0 shadow-xl rounded-xl bg-white">
                  <div className="bg-slate-400 p-4 sm:p-6 rounded-t-xl">
                    <div className="flex flex-col items-center text-center text-white">
                      <Avatar className="bg-gradient-to-br from-blue-500 to-purple-600 h-12 w-12 sm:h-16 sm:w-16 border-4 border-white shadow-lg mb-3">
                        <AvatarImage src={session?.user?.profilePicUrl || ""} />
                        <AvatarFallback className="text-white text-lg sm:text-xl font-bold bg-gradient-to-br from-blue-500 to-purple-600">
                          {getInitials(session?.user?.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-base sm:text-lg font-bold truncate max-w-full">{session?.user?.fullName}</h3>
                      <p className="text-blue-100 text-xs sm:text-sm truncate max-w-full">{session?.user?.email}</p>
                      <div className="mt-2 px-3 py-1 bg-white bg-opacity-20 rounded-full">
                        <span className="text-xs font-medium">{session?.user?.role}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <DropdownMenuItem asChild className="rounded-lg p-3 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                      <Link href="/dashboard/profile" className="w-full flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <CircleUser className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-gray-900">My Profile</span>
                          <p className="text-xs text-gray-500 mt-0.5">View and edit your profile</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-2 bg-gray-100" />

                    <DropdownMenuItem className="rounded-lg p-3 hover:bg-red-50 transition-colors duration-200 cursor-pointer group" onClick={handleSignOut}>
                      <div className="w-full flex items-center gap-3">
                        <div className="p-2 bg-red-50 group-hover:bg-red-100 rounded-lg transition-colors duration-200">
                          <LogOut className="h-4 w-4 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-gray-900 group-hover:text-red-600 transition-colors duration-200">Sign Out</span>
                          <p className="text-xs text-gray-500 mt-0.5">Sign out of your account</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </div>

                  <div className="px-4 py-3 bg-gray-50 rounded-b-xl border-t">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="truncate">Last login: {getLastLoginText()}</span>
                      <span className="flex items-center gap-1 flex-shrink-0 ml-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Online
                      </span>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="icon" className="p-2 hidden sm:flex">
                <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                className="p-2 relative"
                onClick={handleNotificationClick}
              >
                <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                {notificationCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-xs font-medium min-w-[16px] sm:min-w-[20px]">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </div>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="px-1 sm:px-2 py-1 text-xs sm:text-sm text-gray-600 hover:bg-gray-100">
                    <span className="hidden xs:inline">ENG</span>
                    <span className="xs:hidden">EN</span>
                    <span className="ml-1">▼</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[100px] sm:w-[120px]">
                  <DropdownMenuItem className="text-xs sm:text-sm">ENG</DropdownMenuItem>
                  <DropdownMenuItem className="text-xs sm:text-sm">KINY</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="opacity-0 pointer-events-none absolute">
                    <CircleUser />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[240px] lg:w-[290px]">
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {isNotificationPanelOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
          onClick={handleCloseNotificationPanel}
        />
      )}

      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 lg:w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isNotificationPanelOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">Notifications</h2>
            {notificationCount > 0 && (
              <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs font-medium">
                {notificationCount}
              </span>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleCloseNotificationPanel}
            className="h-8 w-8 rounded-full hover:bg-gray-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-3 sm:p-4 border-b border-gray-100">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={markAllAsRead}
            className="w-full text-sm"
          >
            Mark all as read
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Bell className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500 text-center">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-3 sm:p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                    notification.unread ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      notification.unread ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`text-sm font-medium text-gray-900 break-words ${
                          notification.unread ? 'font-semibold' : ''
                        }`}>
                          {notification.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2 break-words">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50">
          <Button 
            variant="ghost" 
            className="w-full text-blue-600 hover:bg-blue-50 text-sm"
          >
            View All Notifications
          </Button>
        </div>
      </div>
    </>
  );
}