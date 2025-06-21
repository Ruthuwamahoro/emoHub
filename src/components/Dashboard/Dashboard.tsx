"use client";
import React, { useState, useEffect, useMemo } from 'react';
import {
  MoreHorizontal,
  Shield
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Zap } from 'lucide-react';
import { Brain } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { usegetReflectionsSummary } from '@/hooks/reflection/useGetAllReflectionsOverview';
import { usegetReflection } from '@/hooks/reflection/useGetReflection';
import { useCreateResponseReflection } from '@/hooks/reflection/useCreateResponseReflection';
import { getDatesInSeconds } from './emotions/EmotionsDailyCheckins';
import EmotionGauge from './emotions/EmotionsTracker';
import { Calendar } from 'lucide-react';

const EmoHubDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState('March 2020');
  const [currentQuestionId, setCurrentQuestionId] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  
  // Mark component as mounted to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    data,
    isLoading,
    isPending,
    isFetching,
  } = usegetReflection();

  const {
    data: reflectionSummaryss,
    isPending: isPendingSummary,
  } = usegetReflectionsSummary();

  // Initialize the hook with the current question ID
  const {
    formData,
    setFormData,
    errors,
    isPending: isPendingResponse,
    handleChange,
    handleSubmit,
    resetForm,
  } = useCreateResponseReflection(currentQuestionId);

  // Static data - memoized to prevent unnecessary re-renders
  const progressData = useMemo(() => [
    { day: 1, progress: 15 },
    { day: 5, progress: 25 },
    { day: 10, progress: 20 },
    { day: 15, progress: 50 },
    { day: 20, progress: 75 },
    { day: 25, progress: 85 },
    { day: 30, progress: 70 }
  ], []);

  const participationData = useMemo(() => [
    { name: 'Posts', value: 40, color: '#10B981' },
    { name: 'Comments', value: 32, color: '#F59E0B' },
    { name: 'Likes', value: 28, color: '#8B5CF6' }
  ], []);
  
  const { data: session } = useSession();
  const fullName = useMemo(() => 
    session?.user?.fullName?.split(" ")[0] || '', 
    [session?.user?.fullName]
  );

  // Set the current question ID when data loads - fixed to prevent unnecessary re-renders
  useEffect(() => {
    if (data?.data && data.data.length > 0 && !currentQuestionId) {
      const firstQuestionId = data.data[0].id;
      if (firstQuestionId !== currentQuestionId) {
        setCurrentQuestionId(firstQuestionId);
      }
    }
  }, [data?.data, currentQuestionId]);

  // Handle reflection submission - improved to prevent unnecessary re-renders
  const handleSaveReflection = async (questionId: string) => {
    try {
      if (questionId !== currentQuestionId) {
        setCurrentQuestionId(questionId);
        // Use a more reliable approach than setTimeout
        await new Promise(resolve => {
          const checkUpdate = () => {
            if (currentQuestionId === questionId) {
              resolve(undefined);
            } else {
              requestAnimationFrame(checkUpdate);
            }
          };
          checkUpdate();
        });
      }
      
      const result = await handleSubmit();
      if (result?.success) {
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save reflection:', error);
    }
  };

  // Complete Dashboard Skeleton Component
  const DashboardSkeleton = () => (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        {/* Dashboard Content */}
        <div className="p-6">
          {/* Welcome Section Skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-72 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* EI Challenges Progress Skeleton */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="flex items-center justify-between mb-6">
                <div className="h-6 bg-gray-300 rounded w-48"></div>
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-32"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-right mb-2">
                  <div className="h-4 bg-gray-200 rounded w-32 ml-auto mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded w-16 ml-auto"></div>
                </div>
              </div>

              <div className="h-64 bg-gray-100 rounded-lg"></div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-gray-300 rounded w-32"></div>
              </div>
              
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-4 bg-gray-300 rounded w-20"></div>
                      <div className="h-4 w-4 bg-gray-300 rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                    <div className="mt-2">
                      <div className="h-6 bg-gray-300 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Group Participation Skeleton */}
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center justify-between mb-6">
              <div className="h-6 bg-gray-300 rounded w-40"></div>
              <div className="h-8 bg-gray-200 rounded w-32"></div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="w-48 h-48 bg-gray-100 rounded-full"></div>
              
              <div className="flex-1">
                <div className="grid grid-cols-3 gap-6">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                      </div>
                      <div className="h-6 bg-gray-300 rounded w-12 mx-auto"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 bg-gray-300 rounded mr-2"></div>
                <div className="h-6 bg-gray-300 rounded w-48"></div>
              </div>
              <div className="bg-violet-50 rounded-lg p-4 mb-4">
                <div className="space-y-6">
                  {[...Array(2)].map((_, index) => (
                    <div key={index}>
                      <div className="h-3 bg-violet-200 rounded w-32 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-full mb-3"></div>
                      <div className="h-24 bg-gray-200 rounded-md mb-2"></div>
                      <div className="h-8 bg-violet-200 rounded w-32"></div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-slate-100 pt-4 mt-4">
                  <div className="flex items-center mb-2">
                    <div className="w-4 h-4 bg-amber-300 rounded mr-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-lg">
                    <div className="space-y-2">
                      <div className="h-4 bg-amber-200 rounded w-full"></div>
                      <div className="h-4 bg-amber-200 rounded w-3/4"></div>
                      <div className="h-4 bg-amber-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Individual Skeleton Components
  const ReflectionSummarySkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="p-4 bg-gray-50 rounded-lg border animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <div className="h-4 bg-gray-300 rounded w-20"></div>
            <div className="h-4 w-4 bg-gray-300 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
          <div className="mt-2">
            <div className="h-6 bg-gray-300 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const ReflectionQuestionsSkeleton = () => (
    <div className="space-y-6">
      {[...Array(2)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="h-3 bg-violet-200 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-3"></div>
          <div className="h-24 bg-gray-200 rounded-md mb-2"></div>
          <div className="h-8 bg-violet-200 rounded w-32"></div>
        </div>
      ))}
    </div>
  );

  // Return null during hydration to prevent mismatch
  if (!mounted) {
    return null;
  }

  if (isLoading || isPending || isFetching) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-2">
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Welcome back, 
                </span>
                <span className="text-orange-500 ml-2">{fullName}!</span>
                <span className="ml-2">✨</span>
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl">
                Your personal space for emotional growth, meaningful reflections, and building stronger connections
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-white/50">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-violet-600" />
                  <div>
                    <div className="text-sm font-semibold text-gray-800">
                      {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
          <EmotionGauge />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* EI Challenges Progress - Main Analytics */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">EI Challenges Progress</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Previous period</span>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option>March 2020</option>
                    <option>April 2020</option>
                    <option>May 2020</option>
                  </select>
                  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="text-right mb-2">
                  <span className="text-sm text-gray-500">Challenges completed</span>
                  <div className="text-3xl font-bold text-gray-900">44</div>
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={progressData}>
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                        <stop offset="50%" stopColor="#EC4899" stopOpacity={0.4}/>
                        <stop offset="100%" stopColor="#F3E8FF" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#9CA3AF' }}
                      domain={['dataMin', 'dataMax']}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#9CA3AF' }}
                      tickFormatter={(value) => `${value}%`}
                      domain={[0, 100]}
                    />
                    <Area
                      type="monotone"
                      dataKey="progress"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      fill="url(#colorGradient)"
                      dot={{ fill: '#8B5CF6', r: 4, strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, fill: '#8B5CF6', strokeWidth: 2, stroke: '#fff' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Today's Updates - Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Updates</h2>
              </div>
              
              {isPendingSummary ? (
                <ReflectionSummarySkeleton />
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {reflectionSummaryss?.data?.map((summary: any, index: number) => (
                    <div key={summary.id || index} className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400 hover:bg-purple-100 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {summary.responseDate ? getDatesInSeconds(summary.responseDate) : 'Today'}
                        </span>
                        <Shield size={16} className="text-purple-500" />
                      </div>
                      <p className="text-sm text-gray-700 mb-1 font-medium">{summary.title}</p>
                      <p className="text-xs text-gray-600 line-clamp-2">{summary.response || 'No response yet'}</p>
                      <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                        self-awareness
                      </span>
                    </div>
                  ))}
                  
                  {(!reflectionSummaryss?.data || reflectionSummaryss.data.length === 0) && (
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <p className="text-sm text-gray-500">No reflection summaries available yet.</p>
                      <p className="text-xs text-gray-400 mt-1">Complete your daily reflections to see updates here.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Community Participation</h2>
              <select className="text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-violet-500">
                <option>March 2020</option>
              </select>
            </div>
            
            <div className="flex items-center gap-8 flex-wrap lg:flex-nowrap">
              <div className="w-48 h-48 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={participationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {participationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {participationData.map((item, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{item.value}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div> */}

          {session?.user?.role === "User" && (
            <div className="mb-8 pt-10">
              <div className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-orange-200">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Brain className="text-violet-500 mr-2" />
                    <h2 className="text-xl font-semibold">Daily Reflection & Growth</h2>
                  </div>
                  <div className="bg-violet-50 rounded-lg p-4 mb-4">
                    {isLoading ? (
                      <ReflectionQuestionsSkeleton />
                    ) : (
                      <>
                        {data?.data?.map((question: {
                          id: string;
                          question: string;
                        }) => (
                          <div key={question.id} className="mb-6">
                            <div className="text-xs font-medium text-violet-600 mb-1 uppercase tracking-wide">
                              Daily Reflection Prompt
                            </div>
                            <p className="text-sm font-medium text-slate-700 mb-3">{question.question}</p>
                            <textarea
                              name="response"
                              className="w-full p-3 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent h-24 resize-none transition-all duration-200"
                              placeholder="Take a moment to reflect and share your thoughts..."
                              value={currentQuestionId === question.id ? formData.response : ''}
                              onChange={(e) => {
                                if (currentQuestionId !== question.id) {
                                  setCurrentQuestionId(question.id);
                                }
                                handleChange(e);
                              }}
                            />
                            {errors.response && (
                              <p className="text-red-500 text-xs mt-1">{errors.response}</p>
                            )}
                            <button 
                              type="button"
                              onClick={() => handleSaveReflection(question.id)}
                              disabled={isPendingResponse || (currentQuestionId === question.id && !formData.response.trim())}
                              className="mt-3 bg-violet-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                              {isPendingResponse && currentQuestionId === question.id ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                'Save Reflection'
                              )}
                            </button>
                          </div>
                        ))}
                        
                        {(!data?.data || data.data.length === 0) && (
                          <div className="text-center py-8">
                            <p className="text-sm text-gray-500">No reflection prompts available today.</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmoHubDashboard;