'use client';

import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ReactSpeedometer from 'react-d3-speedometer';
import { 
  Heart, 
  TrendingUp, 
  Calendar, 
  Target, 
  Sparkles,
  ArrowUp,
  ArrowDown,
  Activity,
  CheckCircle,
  MessageSquare,
  BarChart3,
  Zap,
  Info
} from 'lucide-react';

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
 
  const { data: summaries, isLoading } = useQuery({
    queryKey: ['emotion-summaries'],
    queryFn: async () => {
      const response = await fetch('/api/emotions/summary');
      if (!response.ok) throw new Error('Failed to fetch summaries');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
          </div>

          {/* Main Dashboard Skeleton */}
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

  const trend = todaySummary && previousSummary 
    ? todaySummary.emotionalScore - previousSummary.emotionalScore 
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 60) return 'text-emerald-600';
    if (score >= 20) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 60) return 'bg-emerald-50 border-emerald-200';
    if (score >= 20) return 'bg-amber-50 border-amber-200';
    return 'bg-rose-50 border-rose-200';
  };

  const getGradientColor = (colorCode: string) => {
    if (colorCode === 'green') return 'from-emerald-500 to-teal-600';
    if (colorCode === 'yellow') return 'from-amber-500 to-orange-600';
    return 'from-rose-500 to-pink-600';
  };

  const getColorMeaning = (colorCode: string) => {
    if (colorCode === 'green') return 'Positive emotions, joy, contentment';
    if (colorCode === 'yellow') return 'Neutral emotions, balanced state';
    return 'Challenging emotions, stress, sadness';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Header */}
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

        {/* Main Dashboard Grid - Updated with equal heights */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 grid grid-rows-2 gap-4 max-h-[800px]">
            {/* Today's Emotional Score */}
            {todaySummary && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="p-6 flex-1 overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-gradient-to-r ${getGradientColor(todaySummary.colorCode)}`}>
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="font-bold text-slate-900" style={{ fontSize: '18px' }}>Today's Score</h2>
                        <p className="text-slate-600" style={{ fontSize: '14px' }}>Your current emotional state</p>
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
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className={`inline-flex px-4 py-2 rounded-full font-semibold ${
                        todaySummary.colorCode === 'green' ? 'bg-emerald-100 text-emerald-800' :
                        todaySummary.colorCode === 'yellow' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`} style={{ fontSize: '16px' }}>
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
                          <div className={`w-3 h-3 rounded-full ${
                            todaySummary.colorCode === 'green' ? 'bg-emerald-500' :
                            todaySummary.colorCode === 'yellow' ? 'bg-amber-500' :
                            'bg-rose-500'
                          }`}></div>
                          <span className="text-slate-700 font-medium" style={{ fontSize: '13px' }}>
                            {getColorMeaning(todaySummary.colorCode)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Patterns */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-100 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900" style={{ fontSize: '18px' }}>Weekly Overview</h3>
                      <p className="text-slate-600" style={{ fontSize: '14px' }}>Your emotional patterns</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 bg-slate-50 px-2 py-1 rounded-full">
                    <Calendar className="w-3 h-3" />
                    <span className="font-medium" style={{ fontSize: '12px' }}>Last 7 days</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                  {weekData.slice(0, 7).map((day: EmotionAnalysisResult, index: number) => (
                    <div key={day.id || index} className={`p-3 rounded-xl border-2 transition-all hover:shadow-md hover:-translate-y-0.5 ${getScoreBg(day.emotionalScore)}`}>
                      <div className="text-center">
                        <div className="text-slate-600 mb-1 uppercase tracking-wider font-semibold" style={{ fontSize: '10px' }}>
                          {new Date(day.summaryDate).toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className={`font-bold ${getScoreColor(day.emotionalScore)} mb-1`} style={{ fontSize: '18px' }}>
                          {day.emotionalScore > 0 ? '+' : ''}{day.emotionalScore}
                        </div>
                        <div className="text-slate-500 mb-2 font-medium" style={{ fontSize: '10px' }}>{day.emotionalState}</div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full transition-all ${
                              day.colorCode === 'green' ? 'bg-emerald-500' : 
                              day.colorCode === 'yellow' ? 'bg-amber-500' : 
                              'bg-rose-500'
                            }`}
                            style={{ width: `${Math.max(20, Math.abs(day.emotionalScore))}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar with matching height */}
          <div className="grid grid-rows-3 gap-4 max-h-[800px]">
            {/* Motivational Message */}
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

            {/* Growth Actions */}
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

            {/* Quick Stats */}
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