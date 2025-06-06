"use client";
import React, { useState } from "react";

import { CircleUser, Menu, Settings, LogOut, Bell, X } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipProvider,
} from "@/components/ui/tooltip";

export default function HeaderDashboard() {
  const isLoading = false;
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(20);

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
          <div className="flex items-center justify-between px-4 py-3 h-[60px]">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="p-2">
                <Menu className="h-5 w-5 text-gray-600" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 rounded-full hover:ring-2 hover:ring-blue-200 transition-all duration-200">
                    <Avatar className="h-8 w-8 cursor-pointer border-2 border-transparent hover:border-blue-300 transition-all duration-200">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
                        U
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[320px] p-0 border-0 shadow-xl rounded-xl bg-white">
                  <div className="bg-slate-400 p-6 rounded-t-xl">
                    <div className="flex flex-col items-center text-center text-white">
                      <Avatar className="h-16 w-16 border-4 border-white shadow-lg mb-3">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-white text-blue-600 text-xl font-bold">
                          KG
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-lg font-bold">Ruth Uwamahoro</h3>
                      <p className="text-blue-100 text-sm">ruthuwamahoro@gmail.com</p>
                      <div className="mt-2 px-3 py-1 bg-white bg-opacity-20 rounded-full">
                        <span className="text-xs font-medium">SuperAdmin</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <DropdownMenuItem asChild className="rounded-lg p-3 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                      <Link href="/profile" className="w-full flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <CircleUser className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">My Profile</span>
                          <p className="text-xs text-gray-500 mt-0.5">View and edit your profile</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-2 bg-gray-100" />

                    <DropdownMenuItem className="rounded-lg p-3 hover:bg-red-50 transition-colors duration-200 cursor-pointer group">
                      <div className="w-full flex items-center gap-3">
                        <div className="p-2 bg-red-50 group-hover:bg-red-100 rounded-lg transition-colors duration-200">
                          <LogOut className="h-4 w-4 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-gray-900 group-hover:text-red-600 transition-colors duration-200">Sign Out</span>
                          <p className="text-xs text-gray-500 mt-0.5">Sign out of your account</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </div>

                  <div className="px-4 py-3 bg-gray-50 rounded-b-xl border-t">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Last login: 2 hours ago</span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Online
                      </span>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="icon" className="p-2">
                <Settings className="h-5 w-5 text-gray-600" />
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                className="p-2 relative"
                onClick={handleNotificationClick}
              >
                <Bell className="h-5 w-5 text-gray-600" />
                {notificationCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium min-w-[20px]">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </div>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100">
                    ENG <span className="ml-1">▼</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[120px]">
                  <DropdownMenuItem>ENG</DropdownMenuItem>
                  <DropdownMenuItem>KINY</DropdownMenuItem>
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

      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isNotificationPanelOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
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

        <div className="p-4 border-b border-gray-100">
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
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                    notification.unread ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      notification.unread ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`text-sm font-medium text-gray-900 ${
                          notification.unread ? 'font-semibold' : ''
                        }`}>
                          {notification.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
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

        <div className="p-4 border-t border-gray-200 bg-gray-50">
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