"use client"
import React, { useState } from 'react';
import {
  Users,
  Target,
  Calendar,
  Search,
  MessageCircle,
  TrendingUp,
  ChevronRight,
  Plus,
  Check,
  Activity,
  Shield,
  Heart,
  X, // Importing X icon for exit button
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Assuming you have an Avatar component

export function CommunityGroups(){
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All Groups', icon: Users },
    { id: 'anxiety', name: 'Anxiety Support', icon: Heart },
    { id: 'depression', name: 'Depression Support', icon: Activity },
    { id: 'mindfulness', name: 'Mindfulness', icon: Target },
  ];

  const groups = [
    {
      id: 1,
      name: "Anxiety Warriors",
      category: "anxiety",
      members: 1234,
      activeNow: 23,
      description: "Support group for managing anxiety together",
      image: "/api/placeholder/100/100",
      isJoined: true,
      activity: 98,
      nextEvent: "Meditation Session",
      eventTime: "Tomorrow, 3 PM",
      featuredPost: {
        title: "How I overcame panic attacks",
        engagement: "234 replies",
        trending: true
      }
    },
    {
      id: 2,
      name: "Mindful Living",
      category: "mindfulness",
      members: 856,
      activeNow: 15,
      description: "Daily mindfulness practices and discussions",
      image: "/api/placeholder/100/100",
      isJoined: false,
      activity: 85,
      nextEvent: "Group Meditation",
      eventTime: "Today, 8 PM",
      challenge: {
        name: "30 Days of Mindfulness",
        progress: 60
      }
    },
    {
      id: 3,
      name: "Depression Support Network",
      category: "depression",
      members: 2341,
      activeNow: 45,
      description: "A safe space for depression support",
      image: "/api/placeholder/100/100",
      isJoined: true,
      activity: 92,
      featuredPost: {
        title: "Weekly Check-in Thread",
        engagement: "89 active discussions",
        trending: true
      }
    }
  ];

  const [joinedGroups, setJoinedGroups] = useState(
    groups.filter(group => group.isJoined)
  );

  const toggleJoinGroup = (groupId) => {
    setJoinedGroups(prev => {
      const group = groups.find(g => g.id === groupId);
      const isCurrentlyJoined = prev.some(g => g.id === groupId);
      
      if (isCurrentlyJoined) {
        return prev.filter(g => g.id !== groupId);
      } else {
        return [...prev, group];
      }
    });
  };

  const filteredGroups = groups.filter(group => 
    selectedCategory === 'all' || group.category === selectedCategory
  );

  return (
    <div className="w-full flex items-start pl-5 pr-10 py-5 relative">
      {/* Background Gradient */}
      <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-purple-100 to-blue-100 transform scale-[0.80] rounded-full blur-3xl" />

      <div className="w-full relative shadow-xl bg-gray-900 border border-gray-800 px-8 py-6 overflow-hidden rounded-2xl">
        {/* Joined Groups Section */}
        <div className="mb-8">
          <h2 className="text-white text-lg font-semibold mb-4">
            Joined Groups ({joinedGroups.length})
          </h2>
          <div className="relative">
                <input
                type="text"
                placeholder="Search groups..."
                // value={searchTerm}
                // onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
           </div>
          {joinedGroups.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {joinedGroups.map(group => (
                <div key={group.id} className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={group.image} alt={group.name} />
                      <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-white font-medium">{group.name}</h3>
                      <p className="text-gray-400 text-sm">{group.members.toLocaleString()} members</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleJoinGroup(group.id)}
                    className="p-2 rounded-full  text-white bg-gradient-to-r from-purple-500 to-blue-500  transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">You have not joined any groups yet.</p>
          )}
        </div>


        {/* Categories */}
        <div className="flex items-center space-x-4 mb-8 overflow-x-auto pb-4">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                  selectedCategory === category.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="whitespace-nowrap">{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map(group => (
            <div key={group.id} className="bg-gray-300 rounded-xl shadow-lg overflow-hidden">
              {/* Group Header */}
              <div className="relative">
                <img 
                  src={group.image} 
                  alt={group.name}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => toggleJoinGroup(group.id)}
                    className={`p-2 rounded-full transition-all ${
                      joinedGroups.some(g => g.id === group.id)
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {joinedGroups.some(g => g.id === group.id) ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Group Info */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                    <p className="text-sm text-gray-500">{group.description}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    {group.members.toLocaleString()}
                  </div>
                  <div className="flex items-center text-sm text-green-500">
                    <Activity className="w-4 h-4 mr-1" />
                    {group.activeNow} active
                  </div>
                </div>

                {/* Featured Content */}
                {group.featuredPost && (
                  <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <MessageCircle className="w-4 h-4 text-purple-500 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">{group.featuredPost.title}</p>
                        <p className="text-xs text-gray-500">{group.featuredPost.engagement}</p>
                      </div>
                      {group.featuredPost.trending && (
                        <span className="flex items-center text-xs text-orange-500">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Trending
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Challenge Progress */}
                {group.challenge && (
                  <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{group.challenge.name}</span>
                      <span className="text-sm text-purple-500">{group.challenge.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 rounded-full h-2 transition-all"
                        style={{ width: `${group.challenge.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Next Event */}
                {group.nextEvent && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{group.nextEvent}</span>
                    </div>
                    <span className="text-purple-500">{group.eventTime}</span>
                  </div>
                )}
              </div>
                
              {/* Footer */}
              <div className="px-5 py-3 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">Safe Space</span>
                </div>
                <button className="text-purple-500 hover:text-purple-600 flex items-center text-sm">
                  View Group
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
