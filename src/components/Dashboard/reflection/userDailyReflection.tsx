"use client"
import { useCreateResponseReflection } from "@/hooks/reflection/useCreateResponseReflection";
import { usegetReflectionsSummary } from "@/hooks/reflection/useGetAllReflectionsOverview";
import { usegetReflection } from "@/hooks/reflection/useGetReflection";
import { Shield } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { Sparkles } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Brain } from "lucide-react";
import { Calendar } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { getDatesInSeconds } from "../emotions/EmotionsDailyCheckins";

const ReflectionQuestionsSkeleton = () => (
  <div className="space-y-6">
    {[...Array(2)].map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="h-3 bg-orange-200 rounded-full w-32 mb-3"></div>
        <div className="h-4 bg-emerald-200 rounded-lg w-full mb-4"></div>
        <div className="h-28 bg-orange-50 rounded-xl mb-4"></div>
        <div className="h-9 bg-emerald-200 rounded-lg w-32"></div>
      </div>
    ))}
  </div>
);

const ReflectionSummarySkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, index) => (
      <div key={index} className="p-5 bg-emerald-50 rounded-xl border border-emerald-100 animate-pulse">
        <div className="flex items-center justify-between mb-3">
          <div className="h-3 bg-emerald-200 rounded-full w-16"></div>
          <div className="h-3 w-3 bg-emerald-200 rounded-full"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-emerald-200 rounded-lg w-3/4"></div>
          <div className="h-3 bg-emerald-150 rounded-lg w-1/2"></div>
        </div>
        <div className="mt-3">
          <div className="h-5 bg-orange-200 rounded-full w-24"></div>
        </div>
      </div>
    ))}
  </div>
);

export function DailyReflection() {
    const [currentTime, setCurrentTime] = useState(new Date());

  const {
    data,
    isLoading,
    isPending,
    isFetching,
  } = usegetReflection();

  const { data: session } = useSession();
  const [currentQuestionId, setCurrentQuestionId] = useState<string>('');
  
  const {
    data: reflectionSummaryss,
    isPending: isPendingSummary,
  } = usegetReflectionsSummary();


  const {
    formData,
    errors,
    isPending: isPendingResponse,
    handleChange,
    handleSubmit,
    resetForm,
  } = useCreateResponseReflection(currentQuestionId);

  const handleSaveReflection = async (questionId: string) => {
    try {
      if (questionId !== currentQuestionId) {
        setCurrentQuestionId(questionId);
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
      return error;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white border-b border-slate-100 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Daily Reflection
              </h1>
              <p className="text-gray-600 text-sm">
                Take a moment to reflect on your day and track your personal growth
              </p>
            </div>
            <div className="flex items-center space-x-4">
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            {session?.user?.role === "User" && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="bg-white px-6 py-5 border-b border-slate-100">
                  <div className="flex items-center">
                    <div className="p-2 bg-emerald-200 rounded-xl mr-3">
                      <Brain className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Today's Reflection</h2>
                      <p className="text-sm text-gray-600">Share your thoughts and insights</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  {isLoading ? (
                    <ReflectionQuestionsSkeleton />
                  ) : (
                    <div className="space-y-6">
                      {data?.data?.map((question: {
                        id: string;
                        question: string;
                      }) => (
                        <div key={question.id} className="bg-gray-100 rounded-xl p-5 border border-slate-100">
                          <div className="flex items-center mb-3">
                            <MessageCircle className="w-4 h-4 text-emerald-600 mr-2" />
                            <span className="text-xs font-medium text-orange-600 uppercase tracking-wide">
                              Reflection Prompt
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-800 mb-4 leading-relaxed">
                            {question.question}
                          </p>
                          <div className="relative">
                            <textarea
                              name="response"
                              className="w-full p-4 border  rounded-xl text-sm focus:outline-none focus:ring-2 h-28 resize-none transition-all duration-200 bg-white placeholder-gray-400"
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
                              <p className="text-red-500 text-xs mt-2">{errors.response}</p>
                            )}
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleSaveReflection(question.id)}
                            disabled={isPendingResponse || (currentQuestionId === question.id && !formData.response.trim())}
                            className="mt-4 bg-gradient-to-r from-orange-500 to-emerald-500 text-white py-2.5 px-6 rounded-xl text-sm font-medium hover:from-orange-600 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg"
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
                        <div className="text-center py-12">
                          <Brain className="w-12 h-12 text-orange-300 mx-auto mb-4" />
                          <p className="text-sm font-medium text-gray-500 mb-1">No reflection prompts available</p>
                          <p className="text-xs text-gray-400">Check back later for new prompts</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden sticky top-8">
              <div className="bg-white px-5 py-4 border-b border-emerald-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-1.5 bg-emerald-200 rounded-lg mr-2">
                      <TrendingUp className="w-4 h-4 text-orange-700" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">Recent Insights</h3>
                      <p className="text-xs text-gray-600">Your reflection journey</p>
                    </div>
                  </div>
                  <Sparkles className="w-4 h-4 text-orange-400" />
                </div>
              </div>
              
              <div className="p-5">
                {isPendingSummary ? (
                  <ReflectionSummarySkeleton />
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {reflectionSummaryss?.data?.map((summary: any, index: number) => (
                      <div key={summary.id || index} className="group p-4 bg-gray-100 rounded-xl border border-slate-100 hover:from-emerald-100 hover:to-orange-100 transition-all duration-200 cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-emerald-700 bg-slate-200 px-2 py-1 rounded-full">
                            {summary.responseDate ? getDatesInSeconds(summary.responseDate) : 'Today'}
                          </span>
                          <div className="flex items-center gap-1">
                            <Shield size={12} className="text-orange-400" />
                            <ChevronRight size={12} className="text-orange-400 group-hover:text-orange-600 transition-colors" />
                          </div>
                        </div>
                        <h4 className="text-sm font-medium text-gray-800 mb-2 line-clamp-1">
                          {summary.title}
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3">
                          {summary.response || 'No response yet'}
                        </p>
                        <span className="inline-block px-2 py-1 bg-emerald-200 text-emerald-800 text-xs rounded-full font-medium">
                          self-awareness
                        </span>
                      </div>
                    ))}
                    
                    {(!reflectionSummaryss?.data || reflectionSummaryss.data.length === 0) && (
                      <div className="p-6 bg-gradient-to-r from-orange-50 to-emerald-50 rounded-xl text-center border border-orange-100">
                        <Brain className="w-10 h-10 text-orange-300 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-500 mb-1">No reflections yet</p>
                        <p className="text-xs text-gray-400">Complete your first reflection to see insights</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}