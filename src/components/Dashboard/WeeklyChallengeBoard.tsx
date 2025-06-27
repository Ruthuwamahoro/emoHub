"use client"

import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CheckCircle2, Award, Calendar, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface Element {
  id: string;
  challenge_id: string;
  title: string;
  question: string;
  points: number;
  order: number;
  notes: string;
  created_at: string;
  updated_at: string;
  completed?: boolean; 
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
  image: string | null;
  total_points: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  elements: Element[];
  participation: Participation | null;
}

interface Group {
  id: string;
  name: string;
  categoryId: string;
  userId: string | null;
  image: string | null;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface GroupData {
  group: Group;
  challenges: Challenge[];
}

interface ApiResponse {
  status: number;
  data: GroupData;
  message: string;
}

export const useGetSingleGroup = (groupId: string) => {
  const { data, isPending } = useQuery({
    queryKey: ["group", groupId],
    queryFn: async () => {
      const response = await axios.get<ApiResponse>(`/api/groups/${groupId}`);
      return response.data;
    },
  });
  
  return {
    data,
    isPending
  }
};

interface GroupChallengesProps {
  groupId: string;
}

export const GroupChallenges: React.FC<GroupChallengesProps> = ({ groupId }) => {
  const { data, isPending } = useGetSingleGroup(groupId);
  const [completedElements, setCompletedElements] = useState<Record<string, boolean>>({});
  const [expandedChallenge, setExpandedChallenge] = useState<string | null>(null);

  const toggleElementCompletion = (elementId: string) => {
    setCompletedElements(prev => ({
      ...prev,
      [elementId]: !prev[elementId]
    }));
  };

  const calculateCompletionPercentage = (elements: Element[]): number => {
    if (elements.length === 0) return 0;
    
    const completedCount = elements.filter(element => 
      completedElements[element.id]
    ).length;
    
    return Math.round((completedCount / elements.length) * 100);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isActiveChallengeDate = (startDate: string, endDate: string): boolean => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return now >= start && now <= end;
  };

  const toggleChallengeExpansion = (challengeId: string) => {
    setExpandedChallenge(prev => prev === challengeId ? null : challengeId);
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <span className="ml-2 text-lg">Loading challenges...</span>
      </div>
    );
  }

  if (!data || !data.data) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        Failed to load group challenges. Please try again later.
      </div>
    );
  }

  const { group, challenges } = data.data;

  const validChallenges = challenges.filter(challenge => 
    challenge.elements && challenge.elements.length > 0
  );

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-purple-800 mb-2">{group.name}</h1>
        <p className="text-purple-700">{group.description}</p>
      </div>

      {validChallenges.length === 0 ? (
        <Card>
          <CardContent className="py-6">
            <div className="text-center text-gray-500">
              <p>No challenges with elements found in this group yet.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {validChallenges.map((challenge) => (
            <Card key={challenge.id} className={`overflow-hidden transition-all duration-300 ${
              isActiveChallengeDate(challenge.start_date, challenge.end_date) 
                ? 'border-green-200 shadow-md' 
                : ''
            }`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                    <CardDescription className="mt-1">{challenge.description}</CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleChallengeExpansion(challenge.id)}
                    className="p-1"
                  >
                    {expandedChallenge === challenge.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className={`transition-all duration-300 ${
                expandedChallenge === challenge.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden p-0'
              }`}>
                <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(challenge.start_date)} - {formatDate(challenge.end_date)}</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-1 text-yellow-500" />
                    <span>{challenge.total_points} total points</span>
                  </div>
                </div>
                
                {isActiveChallengeDate(challenge.start_date, challenge.end_date) && (
                  <div className="bg-green-50 text-green-700 px-3 py-2 rounded-md mb-4 inline-block">
                    Active Challenge
                  </div>
                )}
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Challenge Progress</span>
                    <span className="text-sm">
                      {calculateCompletionPercentage(challenge.elements)}%
                    </span>
                  </div>
                  <Progress 
                    value={calculateCompletionPercentage(challenge.elements)} 
                    className="h-2"
                  />
                </div>
                
                <Accordion type="single" collapsible className="border rounded-md">
                  {challenge.elements.map((element, index) => (
                    <AccordionItem key={element.id} value={element.id}>
                      <AccordionTrigger className="px-4 hover:no-underline">
                        <div className="flex items-center">
                          <div 
                            className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 border cursor-pointer ${
                              completedElements[element.id] 
                                ? 'bg-green-100 border-green-500 text-green-500' 
                                : 'bg-white border-gray-300'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleElementCompletion(element.id);
                            }}
                          >
                            {completedElements[element.id] && <CheckCircle2 className="w-5 h-5" />}
                          </div>
                          <div className="flex-1 text-left">
                            <span className={`font-medium ${
                              completedElements[element.id] ? 'line-through text-gray-500' : ''
                            }`}>
                              {element.title}
                            </span>
                          </div>
                          <div className="flex items-center text-yellow-600 mr-4">
                            <Award className="w-4 h-4 mr-1" />
                            <span className="text-sm">{element.points} pts</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-3 pt-0">
                        <div className="ml-9">
                          <p className="text-gray-700 mb-2">{element.question}</p>
                          {element.notes && (
                            <p className="text-sm text-gray-500 italic">Notes: {element.notes}</p>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
              
              <CardFooter className={`flex justify-between items-center bg-gray-50 ${
                expandedChallenge !== challenge.id ? 'hidden' : ''
              }`}>
                <div className="text-sm text-gray-500">
                  {challenge.elements.length} tasks | {challenge.participation?.total_points_earned || 0} points earned
                </div>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupChallenges;