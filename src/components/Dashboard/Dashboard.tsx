"use client";
import React, { useState, useEffect, useMemo } from 'react';
import {
  MoreHorizontal,
  TrendingUp,
  Target,
  Award,
  Activity
} from 'lucide-react';
import { XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useSession } from 'next-auth/react';
import { usegetReflection } from '@/hooks/reflection/useGetReflection';
import EmotionGauge from './emotions/EmotionsTracker';
import SimpleReflectionPopup from './DailyReflectionPopUp';

const EmoHubDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState('March 2020');
  const [currentQuestionId, setCurrentQuestionId] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const [emoji, setEmoji] = useState('');
  
  useEffect(() => {
   const timer = setInterval(() => {
     setCurrentTime(new Date());
   }, 1000);

   return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const getTimeBasedGreeting = () => {
      const currentHour = new Date().getHours();
      
      if (currentHour >= 5 && currentHour < 12) {
        setGreeting('Good morning');
        setEmoji('🌅');
      } else if (currentHour >= 12 && currentHour < 17) {
        setGreeting('Good afternoon');
        setEmoji('☀️');
      } else if (currentHour >= 17 && currentHour < 21) {
        setGreeting('Good evening');
        setEmoji('🌆');
      } else {
        setGreeting('Good night');
        setEmoji('🌙');
      }
    };

    getTimeBasedGreeting();
    
    const interval = setInterval(getTimeBasedGreeting, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const {
    data,
    isLoading,
    isPending,
    isFetching,
  } = usegetReflection();

  const progressData = useMemo(() => [
    { day: 1, progress: 15 },
    { day: 5, progress: 25 },
    { day: 10, progress: 20 },
    { day: 15, progress: 50 },
    { day: 20, progress: 75 },
    { day: 25, progress: 85 },
    { day: 30, progress: 70 }
  ], []);

  const { data: session } = useSession();
  const fullName = useMemo(() => 
    session?.user?.fullName?.split(" ")[0] || '', 
    [session?.user?.fullName]
  );

  useEffect(() => {
    if (data?.data && data.data.length > 0 && !currentQuestionId) {
      const firstQuestionId = data.data[0].id;
      if (firstQuestionId !== currentQuestionId) {
        setCurrentQuestionId(firstQuestionId);
      }
    }
  }, [data?.data, currentQuestionId]);

  const DashboardSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-8 sm:mb-10 lg:mb-12 animate-pulse">
          <div className="h-8 sm:h-10 lg:h-12 bg-gray-200 rounded-2xl w-full max-w-sm sm:max-w-md lg:max-w-96 mb-3 sm:mb-4"></div>
          <div className="h-4 sm:h-5 lg:h-6 bg-gray-100 rounded-xl w-full max-w-xs sm:max-w-sm lg:max-w-md"></div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-7 lg:mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-5 lg:p-6 animate-pulse">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gray-200 rounded-xl lg:rounded-2xl mb-3 lg:mb-4"></div>
              <div className="h-6 sm:h-7 lg:h-8 bg-gray-200 rounded w-12 sm:w-14 lg:w-16 mb-1 sm:mb-2"></div>
              <div className="h-3 sm:h-3.5 lg:h-4 bg-gray-100 rounded w-16 sm:w-20 lg:w-24"></div>
            </div>
          ))}
        </div>

        <div className="space-y-6 sm:space-y-7 lg:space-y-8">
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-7 lg:p-8 animate-pulse">
            <div className="h-48 sm:h-56 lg:h-64 bg-gray-100 rounded-xl lg:rounded-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!mounted) {
    return null;
  }

  if (isLoading || isPending || isFetching) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <div className="flex items-center justify-start mb-4 lg:hidden">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-white/50">
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-3 py-2 shadow-sm border border-gray-100">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-slate-700 font-medium text-xs">
                  {currentTime.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-orange-500 font-bold tabular-nums text-sm">
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour12: false,
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-4 sm:space-y-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:space-y-0">
            <div className="space-y-2 lg:space-y-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-6xl font-bold tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
                  {greeting},
                </span>
                <br />
                <span className="text-slate-800">{fullName || 'Friend'}!</span>
              </h1>
              <p className="text-slate-600 text-sm sm:text-base lg:text-lg max-w-full sm:max-w-xl lg:max-w-2xl leading-relaxed">
                Your personal sanctuary for emotional growth, meaningful reflections, and building deeper self-awareness
              </p>
            </div>
            
            <div className="hidden lg:flex items-center justify-end">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl px-8 py-4 shadow-lg border border-white/50">
                <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-slate-700 font-medium" style={{ fontSize: '14px' }}>
                    {currentTime.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-orange-500 font-bold tabular-nums" style={{ fontSize: '16px' }}>
                    {currentTime.toLocaleTimeString('en-US', { 
                      hour12: false,
                      hour: '2-digit', 
                      minute: '2-digit', 
                      second: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-12 sm:mb-16 lg:mb-20">
          <div className="bg-white border-l-4 rounded-xl lg:rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-600 text-xs sm:text-sm font-medium truncate">Today's Check-ins</p>
                <p className="text-xl sm:text-2xl lg:text-3xl text-gray-900 mt-1 font-bold">12</p>
              </div>
              <div className="p-2 sm:p-2.5 lg:p-3 bg-blue-50 rounded-lg lg:rounded-xl flex-shrink-0">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border-l-4 rounded-xl lg:rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-600 text-xs sm:text-sm font-medium truncate">Reflection Streak</p>
                <p className="text-xl sm:text-2xl lg:text-3xl text-gray-900 mt-1 font-bold">7</p>
              </div>
              <div className="p-2 sm:p-2.5 lg:p-3 bg-emerald-50 rounded-lg lg:rounded-xl flex-shrink-0">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border-l-4 rounded-xl lg:rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-600 text-xs sm:text-sm font-medium truncate">Growth Score</p>
                <p className="text-xl sm:text-2xl lg:text-3xl text-gray-900 mt-1 font-bold">85%</p>
              </div>
              <div className="p-2 sm:p-2.5 lg:p-3 bg-violet-50 rounded-lg lg:rounded-xl flex-shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-violet-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border-l-4 rounded-xl lg:rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-600 text-xs sm:text-sm font-medium truncate">Achievements</p>
                <p className="text-xl sm:text-2xl lg:text-3xl text-gray-900 mt-1 font-bold">23</p>
              </div>
              <div className="p-2 sm:p-2.5 lg:p-3 bg-amber-50 rounded-lg lg:rounded-xl flex-shrink-0">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16 sm:mb-20 lg:mb-28">
          <SimpleReflectionPopup/>
        </div>

        <div className="mb-8 sm:mb-9 lg:mb-10">
          <EmotionGauge />
        </div>

        <div className="mb-8 sm:mb-9 lg:mb-10">
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-7 lg:mb-8">
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-medium text-slate-800 mb-1 sm:mb-2">EI Challenges Progress</h2>
                <p className="text-slate-500 text-sm sm:text-base">Track your emotional intelligence growth</p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="text-xs sm:text-sm border border-gray-200 rounded-lg lg:rounded-xl px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium min-w-0"
                >
                  <option>March 2020</option>
                  <option>April 2020</option>
                  <option>May 2020</option>
                </select>
                <button className="p-2 hover:bg-gray-100 rounded-lg lg:rounded-xl transition-colors">
                  <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
            
            <div className="mb-6 sm:mb-7 lg:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                <span className="text-sm text-slate-500 font-medium order-2 sm:order-1">Challenges completed</span>
                <div className="text-left sm:text-right order-1 sm:order-2">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-medium text-emerald-800 mb-1">44</div>
                  <div className="flex items-center gap-2 justify-start sm:justify-end">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                    <span className="text-xs sm:text-sm text-orange-500 font-medium">+12% from last month</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-56 sm:h-64 lg:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressData}>
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                      <stop offset="50%" stopColor="#EC4899" stopOpacity={0.2}/>
                      <stop offset="100%" stopColor="#F3E8FF" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }}
                    className="sm:text-xs"
                    domain={['dataMin', 'dataMax']}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }}
                    className="sm:text-xs"
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 100]}
                  />
                  <Area
                    type="monotone"
                    dataKey="progress"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    fill="url(#colorGradient)"
                    dot={{ fill: '#8B5CF6', r: 3, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 5, fill: '#8B5CF6', strokeWidth: 2, stroke: '#fff' }}
                    className="sm:stroke-[3]"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmoHubDashboard;