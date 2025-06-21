'use client';

import React from 'react';
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
  CheckCircle
} from 'lucide-react';
import { EmotionAnalysisResult } from '@/services/emotions/emotionSummaryService';


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
      <div className="space-y-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="h-48 bg-gray-100 rounded-xl"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-20 bg-gray-100 rounded"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const todaySummary = summaries?.data?.[0];
  const previousSummary = summaries?.data?.[1];
  const weekData = summaries?.data?.slice(0, 7) || [];

  // Calculate trend
  const trend = todaySummary && previousSummary 
    ? todaySummary.emotionalScore - previousSummary.emotionalScore 
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 60) return 'text-green-600';
    if (score >= 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 60) return 'bg-green-50 border-green-200';
    if (score >= 20) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-6 mb-8">
      {todaySummary && (
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Today's Emotional Journey</h2>
                  <p className="text-purple-100 text-sm">Real-time emotional intelligence tracking</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  {trend > 0 ? (
                    <ArrowUp className="w-4 h-4 text-green-300" />
                  ) : trend < 0 ? (
                    <ArrowDown className="w-4 h-4 text-red-300" />
                  ) : null}
                  <span className="text-sm">
                    {trend > 0 ? `+${trend}` : trend < 0 ? trend : 'No change'} from yesterday
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">{todaySummary.totalEntries} check-ins today</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Speedometer Section */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <ReactSpeedometer
                    maxValue={100}
                    minValue={-100}
                    value={todaySummary.emotionalScore}
                    needleColor="#8B5CF6"
                    startColor="#EF4444"
                    segments={5}
                    endColor="#10B981"
                    textColor="#374151"
                    valueTextFontSize="18px"
                    labelFontSize="12px"
                    width={280}
                    height={200}
                    ringWidth={47}
                    currentValueText={`${todaySummary.emotionalScore}`}
                  />
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${
                      todaySummary.colorCode === 'green' ? 'bg-green-50 text-green-700 border-green-200' :
                      todaySummary.colorCode === 'yellow' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {todaySummary.emotionalState}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-violet-600" />
                    AI Analysis
                  </h3>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">
                    {todaySummary.aiAnalysis}
                  </p>
                </div>

                {todaySummary.aiMotivationalMessage && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-800">Motivation Boost</h4>
                    </div>
                    <p className="text-blue-700">{todaySummary.aiMotivationalMessage}</p>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {todaySummary.aiRecommendations?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-violet-600" />
                      Growth Actions
                    </h3>
                    <div className="space-y-3">
                      {todaySummary.aiRecommendations.map((rec: number, index: number) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-100">
                          <div className="w-6 h-6 bg-violet-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Today's Impact</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-violet-600">{todaySummary.totalEntries}</div>
                      <div className="text-xs text-gray-500">Check-ins</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(todaySummary.emotionalScore)}`}>
                        {todaySummary.emotionalScore > 0 ? '+' : ''}{todaySummary.emotionalScore}
                      </div>
                      <div className="text-xs text-gray-500">Score</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-violet-600" />
            Recent Emotional Patterns
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            Last 7 days
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {weekData.slice(0, 7).map((day: EmotionAnalysisResult, index: number) => (
            <div key={day.id || index} className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${getScoreBg(day.emotionalScore)}`}>
              <div className="text-center">
                <div className="text-xs font-medium text-gray-600 mb-2">
                  {new Date(day.summaryDate).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={`text-lg font-bold ${getScoreColor(day.emotionalScore)}`}>
                  {day.emotionalScore > 0 ? '+' : ''}{day.emotionalScore}
                </div>
                <div className="text-xs text-gray-500 mt-1">{day.emotionalState}</div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div 
                    className={`h-1.5 rounded-full ${day.colorCode === 'green' ? 'bg-green-500' : day.colorCode === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.max(10, Math.abs(day.emotionalScore))}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EnhancedEmotionGauge;