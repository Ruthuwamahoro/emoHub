'use client';

import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ReactSpeedometer from 'react-d3-speedometer';
import { 
  Heart, 
  TrendingUp, 
  Target, 
  Sparkles,
  ArrowUp,
  ArrowDown,
  Activity,
  CheckCircle,
  BarChart3,
  Zap,
  Info,
  PlusCircle,
  BookOpen
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


interface EmotionAnalysisResult {
  id?: string;
  emotionalScore: number;
  emotionalState: string;
  colorCode: string;
  aiAnalysis: string;
  aiMotivationalMessage?: string;
  aiRecommendations?: string[];
  totalEntries: number;
  summaryDate: string;
}

function EnhancedEmotionGauge() {
  const [filterType, setFilterType] = useState<'week' | 'month' | 'year'>('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredData, setFilteredData] = useState<EmotionAnalysisResult[]>([]);

  const getSpeedometerColorCode = (score: number) => {
    if (score >= 60) return 'green';
    if (score >= 20) return 'lightgreen';
    if (score >= -20) return 'yellow';
    if (score >= -60) return 'orange';
    return 'red';
  };

  const getSpeedometerColorName = (score: number) => {
    if (score >= 60) return 'Green';
    if (score >= 20) return 'Light Green';
    if (score >= -20) return 'Yellow';
    if (score >= -60) return 'Orange';
    return 'Red';
  };

  const getSpeedometerDisplayColor = (score: number) => {
    if (score >= 60) return '#10b981'; 
    if (score >= 20) return '#84cc16'; 
    if (score >= -20) return '#D4DA26'; 
    if (score >= -60) return '#f97316';
    return '#ef4444';
  };



  const getScoreColor = (score: number) => {
    if (score >= 60) return 'text-emerald-600';
    if (score >= 20) return 'text-lime-600';
    if (score >= -20) return 'text-amber-600';
    if (score >= -60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 60) return 'bg-emerald-50 border-emerald-200';
    if (score >= 20) return 'bg-lime-50 border-lime-200';
    if (score >= -20) return 'bg-amber-50 border-amber-200';
    if (score >= -60) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  const getGradientColor = (score: number) => {
    if (score >= 60) return 'from-emerald-500 to-teal-600';
    if (score >= 20) return 'from-lime-500 to-green-600';
    if (score >= -20) return 'from-amber-500 to-orange-600';
    if (score >= -60) return 'from-orange-500 to-red-600';
    return 'from-rose-500 to-pink-600';
  };

  const getColorMeaning = (score: number) => {
    if (score >= 60) {
      return 'You\'re feeling uplifted and energized — emotions like happiness, gratitude, or excitement may be present.';
    }
    if (score >= 20) {
      return 'You\'re experiencing a positive mood — feeling optimistic, content, or motivated.';
    }
    if (score >= -20) {
      return 'You\'re in a neutral state — feeling balanced, calm, or steady.';
    }
    if (score >= -60) {
      return 'You may be feeling mixed emotions — perhaps uncertain, reflective, or experiencing some challenges.';
    }
    return 'You might be going through a tough time — emotions like sadness, anxiety, or frustration could be present.';
  };
  



  const getFilteredData = (data: EmotionAnalysisResult[], type: 'week' | 'month' | 'year', date: Date) => {
    if (!data || data.length === 0) return [];
    
    const currentDate = new Date(date);
    
    switch (type) {
      case 'week':
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        
        return data.filter(item => {
          const itemDate = new Date(item.summaryDate);
          return itemDate >= startOfWeek && itemDate <= endOfWeek;
        }).slice(0, 7);
        
      case 'month':
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        return data.filter(item => {
          const itemDate = new Date(item.summaryDate);
          return itemDate >= startOfMonth && itemDate <= endOfMonth;
        });
        
      case 'year':
        const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
        const endOfYear = new Date(currentDate.getFullYear(), 11, 31);
        
        return data.filter(item => {
          const itemDate = new Date(item.summaryDate);
          return itemDate >= startOfYear && itemDate <= endOfYear;
        });
        
      default:
        return data.slice(0, 7);
    }
  };

  
 
  const { data: summaries, isLoading } = useQuery({
    queryKey: ['emotion-summaries'],
    queryFn: async () => {
      const response = await fetch('/api/emotions/summary');
      if (!response.ok) throw new Error('Failed to fetch summaries');
      return response.json();
    },
  });


  useEffect(() => {
    if (summaries?.data) {
      const filtered = getFilteredData(summaries.data, filterType, selectedDate);
      setFilteredData(filtered);
    }
  }, [summaries?.data, filterType, selectedDate]);


  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    
    switch (filterType) {
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'year':
        newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setSelectedDate(newDate);
  };

  const getDateRangeDisplay = () => {
    switch (filterType) {
      case 'week':
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        
      case 'month':
        return selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
      case 'year':
        return selectedDate.getFullYear().toString();
        
      default:
        return '';
    }
  };

  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded-lg w-1/4 mb-4"></div>
                <div className="h-48 bg-gray-100 rounded-xl"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                <div className="space-y-2">
                  <div className="h-12 bg-gray-100 rounded-lg"></div>
                  <div className="h-12 bg-gray-100 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const todaySummary = summaries?.data?.[0];
  const previousSummary = summaries?.data?.[1];
  const weekData = summaries?.data?.slice(0, 7) || [];



  const hasNoData = !summaries?.data || summaries.data.length === 0;

  const trend = todaySummary && previousSummary 
    ? todaySummary.emotionalScore - previousSummary.emotionalScore 
    : 0;


  if (hasNoData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-8 text-center">
            <h1 className="text-2xl text-left font-medium bg-slate-700 bg-clip-text text-transparent mb-2">
              Your Emotional Journey
            </h1>
            <p className="text-base text-left text-slate-600 max-w-xl">
              Track, understand, and nurture your emotional well-being with AI-powered insights
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-indigo-600" />
              <h3 className="font-semibold text-slate-900" style={{ fontSize: '18px' }}>Emotional Score Color Guide</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-200">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <div className="text-center">
                  <div className="text-slate-700 font-bold text-xs">-100 to -60</div>
                  <div className="text-slate-600 text-xs">Very Low</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-xl border border-orange-200">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <div className="text-center">
                  <div className="text-slate-700 font-bold text-xs">-60 to -20</div>
                  <div className="text-slate-600 text-xs">Low</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200">
                <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                <div className="text-center">
                  <div className="text-slate-700 font-bold text-xs">-20 to +20</div>
                  <div className="text-slate-600 text-xs">Neutral</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-lime-50 rounded-xl border border-lime-200">
                <div className="w-4 h-4 bg-lime-500 rounded-full"></div>
                <div className="text-center">
                  <div className="text-slate-700 font-bold text-xs">+20 to +60</div>
                  <div className="text-slate-600 text-xs">Good</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                <div className="text-center">
                  <div className="text-slate-700 font-bold text-xs">+60 to +100</div>
                  <div className="text-slate-600 text-xs">Excellent</div>
                </div>
              </div>
            </div>
            <div className="mt-3 text-center">
              <p className="text-slate-600 text-sm">Your emotional score ranges from -100 (most challenging) to +100 (most positive)</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Your Emotional Journey</h2>
                <p className="text-slate-600 text-lg">Start tracking your emotions to unlock personalized insights and AI-powered recommendations</p>
              </div>
              
              <div className="space-y-4">
                <Button className="w-full bg-gradient-to-r from-slate-600 to-slate-400 text-white  py-4 px-6 rounded-lg hover:from-slate-700 hover:to-slate-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3" onClick={() => router.push("/dashboard/emotioncheckins")}>
                  <PlusCircle className="w-5 h-5" />
                  Record Your First Emotion
                </Button>
                
                <div className="flex items-center justify-center gap-2 text-slate-500">
                  <div className="h-px bg-slate-200 flex-1"></div>
                  <span className="text-sm">And</span>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>
                
                <Button className="w-full bg-slate-50 text-slate-700 font-medium py-3 px-6 rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2" onClick={() => router.push("/dashboard/learning-resources")}>
                  <BookOpen className="w-4 h-4" />
                  Explore resource
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Your Emotional Dashboard</h3>
                <p className="text-slate-600">See how your emotions will be visualized</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="mb-6">
                  <ReactSpeedometer
                    maxValue={100}
                    minValue={-100}
                    value={0}
                    needleColor="#6366f1"
                    startColor="#ef4444"
                    segments={5}
                    endColor="#10b981"
                    textColor="#1e293b"
                    valueTextFontSize="16px"
                    labelFontSize="10px"
                    width={220}
                    height={140}
                    ringWidth={25}
                    currentValueText="Ready to Start"
                  />
                </div>
                
                <div className="text-center">
                  <Badge className="inline-flex px-4 py-2 rounded-full font-semibold bg-slate-100 text-slate-700 mb-3">
                    Awaiting Your First Check-in
                  </Badge>
                  <p className="text-slate-600 text-sm">Your emotional score will appear here once you start tracking</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">What You'll Get</h3>
              <p className="text-slate-600">Powerful features to support your emotional well-being</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">AI Analysis</h4>
                <p className="text-slate-600 text-sm">Get personalized insights about your emotional patterns and triggers</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Growth Actions</h4>
                <p className="text-slate-600 text-sm">Receive tailored recommendations to improve your emotional well-being</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Trend Tracking</h4>
                <p className="text-slate-600 text-sm">Monitor your emotional journey over time with detailed analytics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8 text-center">
          <h1 className="text-2xl text-left font-medium bg-slate-700 bg-clip-text text-transparent mb-2">
            Your Emotional Journey
          </h1>
          <p className="text-base text-left text-slate-600 max-w-xl">
            Track, understand, and nurture your emotional well-being with AI-powered insights
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-indigo-600" />
            <h3 className="font-semibold text-slate-900" style={{ fontSize: '18px' }}>Emotional Score Color Guide</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-200">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <div className="text-center">
                <div className="text-slate-700 font-bold text-xs">-100 to -60</div>
                <div className="text-slate-600 text-xs">Very Low</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-xl border border-orange-200">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <div className="text-center">
                <div className="text-slate-700 font-bold text-xs">-60 to -20</div>
                <div className="text-slate-600 text-xs">Low</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200">
              <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
              <div className="text-center">
                <div className="text-slate-700 font-bold text-xs">-20 to +20</div>
                <div className="text-slate-600 text-xs">Neutral</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-lime-50 rounded-xl border border-lime-200">
              <div className="w-4 h-4 bg-lime-500 rounded-full"></div>
              <div className="text-center">
                <div className="text-slate-700 font-bold text-xs">+20 to +60</div>
                <div className="text-slate-600 text-xs">Good</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
              <div className="text-center">
                <div className="text-slate-700 font-bold text-xs">+60 to +100</div>
                <div className="text-slate-600 text-xs">Excellent</div>
              </div>
            </div>
          </div>
          <div className="mt-3 text-center">
            <p className="text-slate-600 text-sm">Your emotional score ranges from -100 (most challenging) to +100 (most positive)</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 grid grid-rows-2 gap-4 max-h-[800px]">
            {todaySummary && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="p-6 flex-1 overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-gradient-to-r ${getGradientColor(todaySummary.emotionalScore)}`}>
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="font-bold text-slate-900" style={{ fontSize: '18px' }}>Today's Score</h2>
                        <p className="text-slate-600" style={{ fontSize: '14px' }}
                        >Your current emotional state</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        {trend > 0 ? (
                          <div className="flex items-center gap-1 text-emerald-600">
                            <ArrowUp className="w-3 h-3" />
                            <span className="font-medium" style={{ fontSize: '12px' }}>+{trend}</span>
                          </div>
                        ) : trend < 0 ? (
                          <div className="flex items-center gap-1 text-rose-600">
                            <ArrowDown className="w-3 h-3" />
                            <span className="font-medium" style={{ fontSize: '12px' }}>{trend}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500" style={{ fontSize: '12px' }}>No change</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <CheckCircle className="w-3 h-3" />
                        <span style={{ fontSize: '12px' }}>{todaySummary.totalEntries} check-ins</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row items-center gap-6">
                    <div className="flex-shrink-0">
                      <ReactSpeedometer
                        maxValue={100}
                        minValue={-100}
                        value={todaySummary.emotionalScore}
                        needleColor="#6366f1"
                        startColor="#ef4444"
                        segments={5}
                        endColor="#10b981"
                        textColor="#1e293b"
                        valueTextFontSize="16px"
                        labelFontSize="10px"
                        width={200}
                        height={130}
                        ringWidth={25}
                        currentValueText={`${todaySummary.emotionalScore}`}
                      />

                      <div className="mt-4 flex items-center justify-center gap-2 p-3 bg-slate-50 rounded-xl">
                        <div 
                          className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: getSpeedometerDisplayColor(todaySummary.emotionalScore) }}
                        ></div>
                        <div className="text-center">
                          <div className="text-slate-700 font-bold text-sm">
                            {getSpeedometerColorName(todaySummary.emotionalScore)} Zone
                          </div>
                          <div className="text-slate-500 text-xs">
                            Pointer Color: {getSpeedometerColorCode(todaySummary.emotionalScore)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                    <div 
                        className="inline-flex px-4 py-2 rounded-full font-semibold text-white"
                        style={{ backgroundColor: getSpeedometerDisplayColor(todaySummary.emotionalScore), fontSize: '16px' }}
                      >
                        {todaySummary.emotionalState}
                      </div>
                      
                      <div className="bg-slate-50 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-4 h-4 text-indigo-600" />
                          <h3 className="font-semibold text-slate-900" style={{ fontSize: '14px' }}>AI Analysis</h3>
                        </div>
                        <p className="text-slate-700 leading-relaxed" style={{ fontSize: '13px' }}>
                          {todaySummary.aiAnalysis}
                        </p>
                      </div>
                      
                      <div className="bg-slate-50 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getSpeedometerDisplayColor(todaySummary.emotionalScore) }}
                          ></div>
                          <span className="text-slate-700 font-medium" style={{ fontSize: '13px' }}>
                          {getColorMeaning(todaySummary.emotionalScore)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-100 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900" style={{ fontSize: '18px' }}>
                        {filterType === 'week' ? 'Weekly' : filterType === 'month' ? 'Monthly' : 'Yearly'} Overview
                      </h3>
                      <p className="text-slate-600" style={{ fontSize: '14px' }}>Your emotional patterns</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Select value={filterType} onValueChange={(value: 'week' | 'month' | 'year') => setFilterType(value)}>
                      <SelectTrigger className="w-24 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">Week</SelectItem>
                        <SelectItem value="month">Month</SelectItem>
                        <SelectItem value="year">Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4 p-2 rounded-lg bg-gray-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateDate('prev')}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <div className="flex items-center gap-2 text-slate-600">
                    <CalendarDays className="w-4 h-4" />
                    <span className="font-medium text-sm">{getDateRangeDisplay()}</span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateDate('next')}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className={`grid gap-2 ${
                  filterType === 'week' ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-7' : 
                  filterType === 'month' ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6' : 
                  'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                }`}>
                  {filteredData.map((day: EmotionAnalysisResult, index: number) => (
                    <div key={day.id || index} className={`p-3 rounded-xl border-2 transition-all hover:shadow-md hover:-translate-y-0.5 ${getScoreBg(day.emotionalScore)}`}>
                      <div className="text-center">
                        <div className="text-slate-600 mb-1 uppercase tracking-wider font-semibold" style={{ fontSize: '10px' }}>
                          {filterType === 'week' 
                            ? new Date(day.summaryDate).toLocaleDateString('en-US', { weekday: 'short' })
                            : filterType === 'month' 
                            ? new Date(day.summaryDate).toLocaleDateString('en-US', { day: 'numeric' })
                            : new Date(day.summaryDate).toLocaleDateString('en-US', { month: 'short' })
                          }
                        </div>
                        <div className="text-slate-500 mb-1" style={{ fontSize: '9px' }}>
                          {new Date(day.summaryDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            ...(filterType === 'year' && { year: 'numeric' })
                          })}
                        </div>
                        <div className={`font-bold ${getScoreColor(day.emotionalScore)} mb-1`} style={{ fontSize: '18px' }}>
                          {day.emotionalScore > 0 ? '+' : ''}{day.emotionalScore}
                        </div>
                        <div className="text-slate-500 mb-2 font-medium" style={{ fontSize: '10px' }}>{day.emotionalState}</div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full transition-all ${
                              day.emotionalScore >= 60 ? 'bg-emerald-500' : 
                              day.emotionalScore >= 20 ? 'bg-lime-500' :
                              day.emotionalScore >= -20 ? 'bg-amber-500' :
                              day.emotionalScore >= -60 ? 'bg-orange-500' :
                              'bg-rose-500'
                            }`}
                            style={{ width: `${Math.max(20, Math.abs(day.emotionalScore))}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredData.length === 0 && (
                    <div className="col-span-full text-center py-8 text-slate-500">
                      <CalendarDays className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No data available for the selected {filterType}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-rows-3 gap-4 max-h-[800px]">
            {todaySummary?.aiMotivationalMessage && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                <div className="p-4 flex-1 overflow-y-auto">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-amber-100 rounded-lg">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                    </div>
                    <h3 className="font-bold text-slate-900" style={{ fontSize: '16px' }}>Daily Inspiration</h3>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-slate-700 leading-relaxed" style={{ fontSize: '14px' }}>
                      {todaySummary.aiMotivationalMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {todaySummary?.aiRecommendations?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                <div className="p-4 flex-1 overflow-y-auto">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-emerald-100 rounded-lg">
                      <Target className="w-4 h-4 text-violet-600" />
                    </div>
                    <h3 className="font-bold text-slate-900" style={{ fontSize: '16px' }}>Growth Actions</h3>
                  </div>
                  <div className="space-y-2">
                    {todaySummary.aiRecommendations.slice(0, 3).map((rec: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                        <div className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0" style={{ fontSize: '12px' }}>
                          {index + 1}
                        </div>
                        <p className="text-slate-700 leading-relaxed" style={{ fontSize: '13px' }}>{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="p-4 flex-1 overflow-y-auto">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-900" style={{ fontSize: '16px' }}>Today's Impact</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-indigo-100 rounded-lg">
                        <CheckCircle className="w-3 h-3 text-indigo-600" />
                      </div>
                      <span className="text-slate-700 font-medium" style={{ fontSize: '14px' }}>Check-ins</span>
                    </div>
                    <span className="font-bold text-indigo-600" style={{ fontSize: '18px' }}>
                      {todaySummary?.totalEntries || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-rose-100 rounded-lg">
                        <Zap className="w-3 h-3 text-purple-600" />
                      </div>
                      <span className="text-slate-700 font-medium" style={{ fontSize: '14px' }}>Score</span>
                    </div>
                    <span className={`font-bold ${getScoreColor(todaySummary?.emotionalScore || 0)}`} style={{ fontSize: '18px' }}>
                      {todaySummary?.emotionalScore > 0 ? '+' : ''}{todaySummary?.emotionalScore || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnhancedEmotionGauge;