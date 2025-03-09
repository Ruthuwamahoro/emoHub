"use client"

import React, { useState } from 'react';
import { 
  MessageCircle, 
  Users, 
  Award, 
  Calendar, 
  Target, 
  Heart, 
  BookOpen, 
  CheckCircle2, 
  PlusCircle 
} from 'lucide-react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import DailyChallengeTracker from '@/components/Dashboard/WeeklyChallengeBoard';

// Weekly Challenge Interface
interface WeeklyChallenge {
  id: number;
  title: string;
  description: string;
  points: number;
  completed: boolean;
}

// Discussion Post Interface
interface DiscussionPost {
  id: number;
  author: {
    name: string;
    image: string;
  };
  content: string;
  timestamp: string;
  likes: number;
}

export function GroupDetailPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'challenges' | 'discussions' | 'members'>('challenges');
  const [activeChallengeId, setActiveChallengeId] = useState<number | null>(null);
  const [weeklyChallenges, setWeeklyChallenges] = useState<WeeklyChallenge[]>([
    {
      id: 1,
      title: "Gratitude Journaling",
      description: "Write down 3 things you're grateful for each day this week.",
      points: 50,
      completed: false
    },
    {
      id: 2,
      title: "Mindful Meditation",
      description: "Practice 10 minutes of meditation daily.",
      points: 75,
      completed: true
    },
    {
      id: 3,
      title: "Emotional Check-in",
      description: "Reflect on your emotions and identify their root causes.",
      points: 100,
      completed: false
    }
  ]);

  const handleChallengeCompletion = (challengeId: number) => {
    setWeeklyChallenges(challenges => 
      challenges.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, completed: true } 
          : challenge
      )
    );
  };
  // Placeholder data - replace with actual data fetching
  const groupData = {
    name: "Emotional Wellness Warriors",
    description: "A supportive community dedicated to mental health, emotional intelligence, and personal growth.",
    memberCount: 142,
    coverImage: "/api/placeholder/1200/300",
    weeklyChallenge: {
      theme: "Mindful Connections",
      description: "This week, focus on building deeper, more meaningful connections with yourself and others."
    }
  };

  const discussionPosts: DiscussionPost[] = [
    {
      id: 1,
      author: {
        name: "Alex Johnson",
        image: "/api/placeholder/40/40"
      },
      content: "How do you all manage stress during challenging times? I'd love to hear your strategies.",
      timestamp: "2 hours ago",
      likes: 12
    },
    {
      id: 2,
      author: {
        name: "Emily Rodriguez",
        image: "/api/placeholder/40/40"
      },
      content: "I've been practicing mindfulness, and it's been transformative. Anyone want to share their experience?",
      timestamp: "5 hours ago",
      likes: 8
    }
  ];

  const renderChallengesTab = () => (
    <div className="space-y-4">
      <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
        <h3 className="text-xl font-bold text-purple-800 flex items-center">
          <Target className="mr-2 text-purple-600" /> 
          Weekly Theme: {groupData.weeklyChallenge.theme}
        </h3>
        <p className="text-gray-600 mt-2">{groupData.weeklyChallenge.description}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {weeklyChallenges.map(challenge => (
          <div 
            key={challenge.id} 
            className={`p-4 rounded-lg border ${
              challenge.completed 
                ? 'bg-green-50 border-green-200' 
                : 'bg-white border-gray-200'
            }`}
            onClick={() => setActiveChallengeId(challenge.id)}
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">{challenge.title}</h4>
              {challenge.completed ? (
                <CheckCircle2 className="text-green-600" />
              ) : (
                <PlusCircle className="text-gray-400" />
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-purple-600 font-medium">
                {challenge.points} Points
              </span>
              <button 
                className={`px-3 py-1 rounded-full text-sm ${
                  challenge.completed 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-purple-100 text-purple-800'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveChallengeId(challenge.id);
                }}
              >
                {challenge.completed ? 'View Progress' : 'Start Challenge'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDiscussionsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold flex items-center">
          <MessageCircle className="mr-2 text-purple-600" /> 
          Community Discussions
        </h3>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
          Start New Discussion
        </button>
      </div>

      {discussionPosts.map(post => (
        <div 
          key={post.id} 
          className="bg-white p-4 rounded-lg border hover:shadow-sm transition"
        >
          <div className="flex items-center mb-2">
            <Image 
              src={post.author.image} 
              alt={post.author.name} 
              width={40} 
              height={40} 
              className="rounded-full mr-3"
            />
            <div>
              <h4 className="font-semibold">{post.author.name}</h4>
              <p className="text-xs text-gray-500">{post.timestamp}</p>
            </div>
          </div>
          <p className="text-gray-700">{post.content}</p>
          <div className="flex justify-between items-center mt-3">
            <button className="flex items-center text-gray-600 hover:text-purple-600">
              <Heart className="mr-2 w-4 h-4" /> {post.likes} Likes
            </button>
            <button className="text-purple-600 hover:underline">
              Reply
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMembersTab = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold flex items-center">
        <Users className="mr-2 text-purple-600" /> 
        Group Members ({groupData.memberCount})
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(groupData.memberCount)].map((_, index) => (
          <div 
            key={index} 
            className="bg-white p-3 rounded-lg border flex items-center"
          >
            <Image 
              src={`/api/placeholder/40/40?seed=${index}`} 
              alt={`Member ${index + 1}`} 
              width={40} 
              height={40} 
              className="rounded-full mr-3"
            />
            <div>
              <h4 className="font-medium">Member {index + 1}</h4>
              <p className="text-xs text-gray-500">Joined 2 months ago</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Group Header */}
      <div className="relative mb-8">
        <div className="h-64 overflow-hidden rounded-xl">
          <Image 
            src={groupData.coverImage} 
            alt={groupData.name} 
            layout="fill" 
            objectFit="cover" 
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-6">
            <h1 className="text-3xl font-bold text-white">{groupData.name}</h1>
            <p className="text-gray-200 mt-2">{groupData.description}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b mb-6">
        {[
          { key: 'challenges', label: 'Weekly Challenges', icon: Award },
          { key: 'discussions', label: 'Discussions', icon: BookOpen },
          { key: 'members', label: 'Members', icon: Users }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`
              flex items-center px-4 py-3 
              ${activeTab === tab.key 
                ? 'border-b-2 border-purple-600 text-purple-600' 
                : 'text-gray-600 hover:text-gray-800'}
            `}
          >
            <tab.icon className="mr-2" /> {tab.label}
          </button>
        ))}
      </div>
      {activeChallengeId && (
      <DailyChallengeTracker
        challenge={weeklyChallenges.find(c => c.id === activeChallengeId)!}
        onClose={() => setActiveChallengeId(null)}
        onComplete={handleChallengeCompletion}
      />
    )}

      {/* Tab Content */}
      {activeTab === 'challenges' && renderChallengesTab()}
      {activeTab === 'discussions' && renderDiscussionsTab()}
      {activeTab === 'members' && renderMembersTab()}
    </div>
  );
}

export default GroupDetailPage;