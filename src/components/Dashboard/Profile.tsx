"use client"
import React, { useState } from 'react';
import {
  User, Shield, Eye, EyeOff, Edit2, Camera, MapPin, 
  Lock, Globe, Calendar, Target, Book, Heart,
  Activity, Sun, Moon, Settings, Plus, CheckCircle,
  AlertCircle, Clock, RefreshCw
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const THEME = {
  primary: {
    light: '#8B5CF6',
    main: '#7C3AED',
    dark: '#6D28D9',
  },
  background: {
    light: '#F3F4F6',
    main: '#FFFFFF',
    dark: '#1F2937',
  }
};

export function UserProfile() {
  // State management
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  
  // Mock user data
  const [userData, setUserData] = useState({
    name: "Alex Thompson",
    anonymousId: "Serene_Butterfly_724",
    avatar: "/api/placeholder/150/150",
    location: "New York, USA",
    joinDate: "January 2024",
    bio: "On a journey to better mental health. Passionate about mindfulness and helping others.",
    visibility: "friends",
    theme: "light",
    goals: [
      { id: 1, title: "Practice Daily Meditation", progress: 75 },
      { id: 2, title: "Reduce Anxiety Levels", progress: 60 },
      { id: 3, title: "Improve Sleep Schedule", progress: 40 }
    ],
    journey: {
      milestones: [
        { date: "2024-01", title: "Started Therapy" },
        { date: "2024-02", title: "Completed CBT Course" },
        { date: "2024-03", title: "30 Days Meditation Streak" }
      ],
      current: {
        therapy: "Cognitive Behavioral Therapy",
        frequency: "Weekly",
        specialist: "Dr. Sarah Williams"
      }
    },
    selfCare: {
      activities: [
        { type: "Meditation", frequency: "Daily", streak: 7 },
        { type: "Exercise", frequency: "3x/week", streak: 4 },
        { type: "Journaling", frequency: "Daily", streak: 12 }
      ],
      mood: [
        { date: "2024-03-15", level: 7 },
        { date: "2024-03-16", level: 8 },
        { date: "2024-03-17", level: 6 }
      ]
    }
  });

  // Profile Header Component
  const ProfileHeader = () => (
    <div className="relative mb-6">
      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-r from-purple-400 to-pink-500 rounded-t-xl" />
      
      {/* Profile Information */}
      <div className="absolute -bottom-16 left-8 flex items-end space-x-6">
        <div className="relative">
          <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
            <AvatarImage src={userData.avatar} alt={userData.name} />
            <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
            <Camera className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-black">
              {isAnonymous ? userData.anonymousId : userData.name}
            </h1>
            <Badge variant="outline" className="bg-white/20 text-black">
              <Clock className="w-3 h-3 mr-1" />
              Member since {userData.joinDate}
            </Badge>
          </div>
          
          {userData.location && (
            <div className="flex items-center text-black mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {userData.location}
            </div>
          )}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={() => setEditMode(!editMode)}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
        >
          <Edit2 className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={() => setIsAnonymous(!isAnonymous)}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
        >
          {isAnonymous ? (
            <Eye className="w-4 h-4 text-gray-600" />
          ) : (
            <EyeOff className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>
    </div>
  );

  // Privacy Settings Component
  const PrivacySettings = () => (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold">Privacy Settings</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Anonymous Mode</p>
              <p className="text-sm text-gray-500">Hide your real identity</p>
            </div>
            <Switch
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Profile Visibility</p>
              <p className="text-sm text-gray-500">Who can see your profile</p>
            </div>
            <select className="rounded-md border-gray-300">
              <option value="public">Everyone</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Mental Health Goals Component
  const MentalHealthGoals = () => (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold">Mental Health Goals</h2>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Plus className="w-4 h-4" />
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {userData.goals.map(goal => (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{goal.title}</span>
                <span className="text-sm text-gray-500">{goal.progress}%</span>
              </div>
              <Progress value={goal.progress} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Self-Care Tracker Component
  const SelfCareTracker = () => (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold">Self-Care Activities</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userData.selfCare.activities.map((activity, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 rounded-lg flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium">{activity.type}</h3>
                <p className="text-sm text-gray-500">{activity.frequency}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  {activity.streak} days
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Journey Timeline Component
  const JourneyTimeline = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Book className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold">Mental Health Journey</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Treatment */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Current Treatment</h3>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-gray-500">Therapy Type:</span>{' '}
                {userData.journey.current.therapy}
              </p>
              <p className="text-sm">
                <span className="text-gray-500">Frequency:</span>{' '}
                {userData.journey.current.frequency}
              </p>
              <p className="text-sm">
                <span className="text-gray-500">Specialist:</span>{' '}
                {userData.journey.current.specialist}
              </p>
            </div>
          </div>

          {/* Milestones */}
          <div className="space-y-4">
            <h3 className="font-medium">Milestones</h3>
            <div className="relative">
              {userData.journey.milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="flex items-start mb-4"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">{milestone.title}</p>
                    <p className="text-sm text-gray-500">{milestone.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ProfileHeader />
        
        {/* Main Content */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="space-y-6">
            <PrivacySettings />
            <MentalHealthGoals />
          </div>
          
          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="journey">Journey</TabsTrigger>
                <TabsTrigger value="self-care">Self-Care</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="prose max-w-none">
                      <h3 className="text-lg font-semibold mb-2">About Me</h3>
                      <p className="text-gray-600">{userData.bio}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="journey" className="mt-6">
                <JourneyTimeline />
              </TabsContent>
              
              <TabsContent value="self-care" className="mt-6">
                <SelfCareTracker />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

