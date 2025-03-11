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
  group_id: string;
  user_id: string;
  title: string;
  description: string;
  image: string;
  total_points: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  elements: ChallengeElement[];
  participation: Participation | null;
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

// Challenge Dialog Component
interface ChallengeDialogProps {
  challenge: Challenge;
  onClose: () => void;
  onElementComplete: (challengeId: string, elementId: string, completed: boolean) => void;
}

const ChallengeDialog: React.FC<ChallengeDialogProps> = ({ challenge, onClose, onElementComplete }) => {
  const [completedElements, setCompletedElements] = useState<Record<string, boolean>>(
    challenge.elements.reduce((acc, element) => ({
      ...acc,
      [element.id]: element.completed || false
    }), {})
  );

  const handleElementToggle = (elementId: string) => {
    const newStatus = !completedElements[elementId];
    setCompletedElements({
      ...completedElements,
      [elementId]: newStatus
    });
    onElementComplete(challenge.id, elementId, newStatus);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Calculate progress
  const totalElements = challenge.elements.length;
  const completedCount = Object.values(completedElements).filter(Boolean).length;
  const progressPercentage = totalElements ? Math.round((completedCount / totalElements) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 bg-purple-50 border-b relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-purple-800">{challenge.title}</h2>
          <p className="text-gray-600 mt-2">{challenge.description}</p>
          
          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(challenge.start_date)} - {formatDate(challenge.end_date)}
            </div>
            <div className="flex items-center text-purple-600 font-medium">
              <Award className="w-4 h-4 mr-1" />
              {challenge.total_points} Points
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>{completedCount} of {totalElements} completed</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-purple-600 h-2.5 rounded-full" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto flex-grow">
          <h3 className="text-xl font-semibold mb-4">Challenge Tasks</h3>
          
          {challenge.elements.length === 0 ? (
            <p className="text-gray-500 text-center py-6">This challenge doesn't have any tasks yet.</p>
          ) : (
            <div className="space-y-4">
              {challenge.elements
                .sort((a, b) => a.order - b.order)
                .map((element) => (
                <div 
                  key={element.id} 
                  className={`p-4 rounded-lg border ${
                    completedElements[element.id] ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleElementToggle(element.id)}
                      className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border ${
                        completedElements[element.id] 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-gray-300 hover:border-purple-400'
                      }`}
                    >
                      {completedElements[element.id] && <Check className="w-4 h-4" />}
                    </button>
                    
                    <div className="flex-grow">
                      <h4 className="font-medium">{element.title}</h4>
                      <p className="text-gray-600 mt-1">{element.question}</p>
                      
                      {element.notes && (
                        <div className="mt-2 text-sm text-gray-500">
                          <strong>Notes:</strong> {element.notes}
                        </div>
                      )}
                      
                      <div className="mt-2 text-sm text-purple-600 font-medium">
                        {element.points} points
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 mr-2"
          >
            Close
          </button>
          <button 
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Save Progress
          </button>
        </div>
      </div>
    </div>
  );
};

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

  // Get active challenge from data
  const getActiveChallenge = (): Challenge | null => {
    if (!data?.data?.challenges || !activeChallengeId) return null;
    
    const challenge = data.data.challenges.find((c: Challenge) => c.id === activeChallengeId);
    if (!challenge) return null;
    
    // Add local completion state to elements
    const enhancedChallenge = {
      ...challenge,
      elements: challenge.elements.map((element) => ({
        ...element,
        completed: challengeProgress[challenge.id]?.[element.id] || false
      }))
    };
    
    return enhancedChallenge;
  };

  const renderChallengesTab = () => {
    if (isPending) {
      return <div className="text-center py-10">Loading challenges...</div>;
    }

    if (!data || !data.data) {
      return <div className="text-center py-10">No data available</div>;
    }

    const { group, challenges } = data.data;

    return (
      <div className="space-y-4">
        <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
          <h3 className="text-xl font-bold text-purple-800 flex items-center">
            <Target className="mr-2 text-purple-600" /> 
            Group: {group.name}
          </h3>
          <p className="text-gray-600 mt-2">{group.description}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map((challenge: Challenge) => {
            const isActive = challenge.participation?.is_active || false;
            const totalElements = challenge.elements.length;
            const hasElements = totalElements > 0;
            
            // Calculate completion progress based on state
            const completedElements = challenge.elements.filter(
              element => challengeProgress[challenge.id]?.[element.id]
            ).length;
            const progressPercentage = totalElements ? Math.round((completedElements / totalElements) * 100) : 0;
            
            return (
              <div 
                key={challenge.id} 
                className={`p-4 rounded-lg border cursor-pointer transition hover:shadow-md ${
                  isActive ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                }`}
                onClick={() => setActiveChallengeId(challenge.id)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">{challenge.title}</h4>
                  {isActive ? (
                    <CheckCircle2 className="text-green-600" />
                  ) : (
                    <PlusCircle className="text-gray-400" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                <div className="text-xs text-gray-500 mb-2">
                  {formatDate(challenge.start_date)} - {formatDate(challenge.end_date)}
                </div>
                
                {hasElements && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{completedElements} of {totalElements} completed</span>
                      <span>{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-purple-600 h-1.5 rounded-full" 
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-purple-600 font-medium">
                    {challenge.total_points} Points
                  </span>
                  <button 
                    className={`px-3 py-1 rounded-full text-sm ${
                      isActive ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveChallengeId(challenge.id);
                    }}
                  >
                    {completedElements > 0 ? 'Continue' : hasElements ? 'Start Challenge' : 'No Elements'}
                  </button>
                </div>
                {hasElements && (
                  <div className="mt-2 text-xs text-gray-500">
                    {totalElements} task{totalElements !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            );
          })}
        </div>
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

  const activeChallenge = getActiveChallenge();

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

      {/* Challenge Dialog */}
      {activeChallenge && (
        <ChallengeDialog
          challenge={activeChallenge}
          onClose={() => setActiveChallengeId(null)}
          onElementComplete={handleElementComplete}
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