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
  PlusCircle,
  X,
  Check
} from 'lucide-react';
import Image from 'next/image';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from 'next/navigation';
import { useGetChallenges } from '@/hooks/users/groups/challenges/useGetChallenges';
import { useGetAllChallengesElements } from '@/hooks/users/groups/challenges/elements/useGetAllChallengesElements';

// API hook to fetch single group data
export const useGetSingleGroup = (groupId: string) => {
  const { data, isPending } = useQuery({
    queryKey: ["group", groupId],
    queryFn: async () => {
      const response = await axios.get(`/api/groups/${groupId}`);
      return response.data;
    },
  });
  return { data, isPending };
};

// Challenge Interfaces
interface ChallengeElement {
  id: string;
  challenge_id: string;
  title: string;
  question: string;
  points: number;
  order: number;
  notes: string;
  created_at: string;
  updated_at: string;
  completed?: boolean; // For tracking completion status in UI
}

interface Participation {
  id: string;
  user_id: string;
  challenge_id: string;
  join_date: string;
  total_points_earned: number;
  streak_days: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  image: string | null;
  total_points: number;
  start_date: string;
  end_date: string;
  questions: {
    question: string;
    description: string;
    points: number;
  }[];
}

interface Group {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
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

function ChallengeView({ challenge, groupId }: { challenge: Challenge; groupId: string }) {
  const { data: elementsData, isPending: isLoadingElements } = useGetAllChallengesElements(groupId, challenge.id);
  const elements = elementsData?.data || [];
  
  // Get start and end dates
  const startDate = new Date(challenge.start_date);
  const endDate = new Date(challenge.end_date);
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Group elements by day
  const elementsByDay = Array.from({ length: totalDays }, (_, dayIndex) => {
    const dayDate = new Date(startDate);
    dayDate.setDate(startDate.getDate() + dayIndex);
    
    const dayElements = elements.filter(el => el.day_number === dayIndex);
    return {
      date: dayDate,
      elements: dayElements.sort((a, b) => a.order - b.order)
    };
  });

  if (isLoadingElements) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg">Loading challenge details...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 bg-purple-50 border-b">
          <h2 className="text-2xl font-bold text-purple-800">{challenge.title}</h2>
          <p className="text-gray-600 mt-2">{challenge.description}</p>
        </div>

        <div className="p-6 overflow-y-auto">
          {elementsByDay.map((day, index) => (
            <div key={index} className="mb-8 last:mb-0">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-purple-700">
                Day {index + 1} - {day.date.toLocaleDateString()}
              </h3>
              
              {day.elements.length > 0 ? (
                <div className="space-y-4">
                  {day.elements.map((element) => (
                    <div key={element.id} className="bg-gray-50 p-4 rounded-lg border">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{element.questions}</h4>
                          <p className="text-sm text-gray-600 mt-1">{element.description}</p>
                        </div>
                        <span className="text-purple-600 font-medium">
                          {element.points} points
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No tasks for this day</p>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={() => setActiveChallengeId(null)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function GroupDetailPage() {
  const { id }: { id: string } = useParams();
  const { data, isPending } = useGetSingleGroup(id);
  const [activeTab, setActiveTab] = useState<'challenges' | 'discussions' | 'members'>('challenges');
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  
  // State to track element completion
  const [challengeProgress, setChallengeProgress] = useState<Record<string, Record<string, boolean>>>({});

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleElementComplete = (challengeId: string, elementId: string, completed: boolean) => {
    // Update local state
    setChallengeProgress(prev => ({
      ...prev,
      [challengeId]: {
        ...(prev[challengeId] || {}),
        [elementId]: completed
      }
    }));
    
    // In a real app, you would make an API call here to update the completion status
    console.log(`Element ${elementId} in challenge ${challengeId} marked as ${completed ? 'completed' : 'incomplete'}`);
  };

  // Placeholder data for discussions - this would be replaced with API data in a real app
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

  const { data: allChallenges, isPending: challengeIsPending } = useGetChallenges(id)
  const challenges = allChallenges?.data || [];

  const renderChallengesTab = () => {
    if (challengeIsPending) {
      return (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      );
    }

    if (!challenges || challenges.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-600">No challenges available for this group.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
          <h3 className="text-xl font-bold text-purple-800 flex items-center">
            <Target className="mr-2 text-purple-600" /> 
            Available Challenges
          </h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map((challenge: Challenge) => (
            <div 
              key={challenge.id} 
              className="bg-white p-4 rounded-lg border cursor-pointer transition hover:shadow-md"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">{challenge.title}</h4>
                <span className="text-purple-600 font-medium">
                  {challenge.total_points} Points
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
              
              <div className="text-xs text-gray-500 mb-2">
                {new Date(challenge.start_date).toLocaleDateString()} - {new Date(challenge.end_date).toLocaleDateString()}
              </div>
              
              {challenge.questions && (
                <div className="mt-2 text-xs text-gray-500">
                  {challenge.questions.length} task{challenge.questions.length !== 1 ? 's' : ''}
                </div>
              )}

              <button 
                className="mt-3 w-full px-3 py-2 rounded-lg text-sm bg-purple-100 text-purple-800 hover:bg-purple-200"
                onClick={() => setActiveChallengeId(challenge.id)}
              >
                View Challenge
              </button>
            </div>
          ))}
        </div>

        {activeChallengeId && (
          <ChallengeView 
            challenge={challenges.find((c: Challenge) => c.id === activeChallengeId)!}
            groupId={id}
          />
        )}
      </div>
    );
  };

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

  const renderMembersTab = () => {
    if (isPending) {
      return <div className="text-center py-10">Loading members...</div>;
    }

    if (!data || !data.data || !data.data.group) {
      return <div className="text-center py-10">No data available</div>;
    }

    // In a real app, you would have a members API endpoint
    // This is just placeholder functionality
    const memberCount = 10; // This would come from API

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center">
          <Users className="mr-2 text-purple-600" /> 
          Group Members ({memberCount})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(memberCount)].map((_, index) => (
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
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Group Header */}
      <div className="relative mb-8">
        <div className="h-64 overflow-hidden rounded-xl relative">
          <Image 
            src="/api/placeholder/1200/300" 
            alt={data?.data?.group?.name || "Group Cover"} 
            width={1200}
            height={300}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-6">
            <h1 className="text-3xl font-bold text-white">
              {data?.data?.group?.name || "Loading group..."}
            </h1>
            <p className="text-gray-200 mt-2">
              {data?.data?.group?.description || ""}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b mb-6">
        {[
          { key: 'challenges', label: 'Challenges', icon: Award },
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

      {/* Tab Content */}
      {activeTab === 'challenges' && renderChallengesTab()}
      {activeTab === 'discussions' && renderDiscussionsTab()}
      {activeTab === 'members' && renderMembersTab()}
    </div>
  );
}

export default GroupDetailPage;