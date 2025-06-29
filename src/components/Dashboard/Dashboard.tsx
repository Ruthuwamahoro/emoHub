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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12 animate-pulse">
          <div className="h-12 bg-gray-200 rounded-2xl w-96 mb-4"></div>
          <div className="h-6 bg-gray-100 rounded-xl w-1/2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-2xl mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-100 rounded w-24"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 animate-pulse">
              <div className="h-64 bg-gray-100 rounded-2xl"></div>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 animate-pulse">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-100 rounded-2xl"></div>
              ))}
            </div>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
                {greeting},
                </span>
                <br />
                <span className="text-slate-800">{fullName || 'Friend'}!</span>
                </h1>
              <p className="text-slate-600 text-lg  max-w-2xl leading-relaxed">
                Your personal sanctuary for emotional growth, meaningful reflections, and building deeper self-awareness
              </p>
            </div>
            
            <div className="flex items-center gap-4">
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



        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
        <div className="bg-white border-l-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Today's Check-ins</p>
              <p className="text-3xl  text-gray-900 mt-1">12</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border-l-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Reflection Streak</p>
              <p className="text-3xl text-gray-900 mt-1">7</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <Target className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border-l-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Growth Score</p>
              <p className="text-3xl  text-gray-900 mt-1">85%</p>
            </div>
            <div className="p-3 bg-violet-50 rounded-xl">
              <TrendingUp className="w-6 h-6 text-violet-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border-l-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Achievements</p>
              <p className="text-3xl text-gray-900 mt-1">23</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl">
              <Award className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </div>
      </div>
      <div className="xl:col-span-1 mb-28">
          <SimpleReflectionPopup/>
      </div>
        <div className="mb-10">
          <EmotionGauge />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-1 gap-8 mb-10">
          <div className="xl:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-medium text-slate-800 mb-2">EI Challenges Progress</h2>
                <p className="text-slate-500">Track your emotional intelligence growth</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="text-sm border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium"
                >
                  <option>March 2020</option>
                  <option>April 2020</option>
                  <option>May 2020</option>
                </select>
                <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="flex items-end gap-2 justify-end mb-4">
                <span className="text-sm text-slate-500 font-medium">Challenges completed</span>
              </div>
              <div className="text-right">
                <div className="text-4xl font-medium text-emerald-800 mb-1">44</div>
                <div className="flex items-center justify-end gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-orange-500 font-medium">+12% from last month</span>
                </div>
              </div>
            </div>

            <div className="h-72">
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
                    tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }}
                    domain={['dataMin', 'dataMax']}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }}
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 100]}
                  />
                  <Area
                    type="monotone"
                    dataKey="progress"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    fill="url(#colorGradient)"
                    dot={{ fill: '#8B5CF6', r: 5, strokeWidth: 3, stroke: '#fff' }}
                    activeDot={{ r: 7, fill: '#8B5CF6', strokeWidth: 3, stroke: '#fff' }}
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