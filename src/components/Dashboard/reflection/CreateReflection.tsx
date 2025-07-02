"use client";
import { useCreateDailyReflection } from "@/hooks/reflection/useCreateReflection";
import { usegetReflectionsSummary } from "@/hooks/reflection/useGetAllReflectionsOverview";
import { Loader2, Plus, MessageSquare, Users, Calendar, Eye, User } from "lucide-react";
import { getDatesInSeconds } from "../emotions/EmotionsDailyCheckins";
import { usegetAllCreatedReflection } from "@/hooks/reflection/useGetAllCreatedReflection";

export function GetsReflectionForm(){
    const {
        formData,
        isPending,
        handleChange,
        handleSubmit 
     } = useCreateDailyReflection();

     const {
        data: reflectionSummaryss,
        isPending: isPendingSummary,
      } = usegetReflectionsSummary();

      const {
        data: reflectionData,
        isPending: isPendingReflection,
      } = usegetAllCreatedReflection();

      console.log("Reflection Summary Data:", reflectionData);

     const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const syntheticEvent = {
            ...e,
            target: {
                ...e.target,
                id: e.target.id,
                value: e.target.value
            }
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        
        handleChange(syntheticEvent);
     };

     return(
        <div className="min-h-screen bg-slate-50">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-200">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Daily Reflections</h1>
                            <p className="text-slate-600 mt-1 text-sm sm:text-base">Manage daily reflection questions and view user responses</p>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-500">
                            <div className="flex items-center gap-1 sm:gap-2">
                                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span>{reflectionSummaryss?.data?.length || 0} Responses</span>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2">
                                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline">{new Date().toLocaleDateString()}</span>
                                <span className="sm:hidden">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Created Reflections Grid - Responsive */}
            {reflectionData?.data && reflectionData.data.length > 0 && (
                <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-6">
                    <div className="mb-4 sm:mb-6">
                        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">Created Reflections</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                            {reflectionData.data.map((reflection: {
                                id: string;
                                question: string;
                            }) => (
                                <div 
                                    key={reflection.id} 
                                    className="bg-white rounded-lg border border-slate-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                                >
                                    <div className="flex items-start gap-2 mb-2">
                                        <MessageSquare className="h-4 w-4 text-[#fb923c] mt-0.5 flex-shrink-0" />
                                        <span className="text-xs text-slate-500 font-medium">Question #{reflection.id ? String(reflection.id).slice(-6) : 'N/A'}</span>
                                    </div>
                                    <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">
                                        {reflection.question}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                    <div className="lg:col-span-4 order-2 lg:order-1">
                        <div className="lg:sticky lg:top-8">
                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
                                <div className="border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4">
                                    <h2 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center gap-2">
                                        <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                                        Post Daily Reflection
                                    </h2>
                                </div>
                                
                                <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label 
                                                htmlFor="reflectionQuestion" 
                                                className="block text-sm font-medium text-slate-700 mb-2"
                                            >
                                                Reflection Question
                                            </label>
                                            <textarea
                                                id="reflectionQuestion"
                                                value={formData.reflectionQuestion}
                                                onChange={handleTextareaChange}
                                                required
                                                rows={4}
                                                placeholder="What question would you like users to reflect on today?"
                                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 resize-none"
                                            />
                                        </div>
                                    </div>
                                    
                                    <button 
                                        type="submit" 
                                        disabled={isPending}
                                        className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg bg-[#fb923c] px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform active:scale-95 sm:hover:scale-[1.02]"
                                    >
                                        {isPending ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span className="hidden sm:inline">Publishing...</span>
                                                <span className="sm:hidden">Publishing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="h-4 w-4" />
                                                <span className="hidden sm:inline">Publish Reflection</span>
                                                <span className="sm:hidden">Publish</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Responses Section - Scrollable */}
                    <div className="lg:col-span-8 order-1 lg:order-2">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
                            <div className="bg-[#fb923c] px-4 sm:px-6 py-3 sm:py-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                                        <span className="hidden sm:inline">User Responses</span>
                                        <span className="sm:hidden">Responses</span>
                                    </h2>
                                    {!isPendingSummary && reflectionSummaryss?.data && (
                                        <span className="text-orange-100 text-xs sm:text-sm font-medium">
                                            {reflectionSummaryss.data.length} responses
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            {/* Scrollable Content Area */}
                            <div className="max-h-[600px] sm:max-h-[700px] lg:max-h-[400px] overflow-y-auto">
                                <div className="divide-y divide-slate-200">
                                    {isPendingSummary ? (
                                        <>
                                            {[...Array(4)].map((_, i) => (
                                                <div key={i} className="p-4 sm:p-6">
                                                    <div className="animate-pulse">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-slate-200"></div>
                                                                <div>
                                                                    <div className="h-3 sm:h-4 bg-slate-200 rounded w-20 sm:w-24 mb-1"></div>
                                                                    <div className="h-2 sm:h-3 bg-slate-200 rounded w-16 sm:w-20"></div>
                                                                </div>
                                                            </div>
                                                            <div className="h-2 sm:h-3 bg-slate-200 rounded w-12 sm:w-16"></div>
                                                        </div>
                                                        <div className="mb-3">
                                                            <div className="h-3 sm:h-4 bg-slate-200 rounded w-32 sm:w-48 mb-2"></div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="h-2 sm:h-3 bg-slate-200 rounded w-full"></div>
                                                            <div className="h-2 sm:h-3 bg-slate-200 rounded w-5/6"></div>
                                                            <div className="h-2 sm:h-3 bg-slate-200 rounded w-4/6"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    ) : reflectionSummaryss?.data && reflectionSummaryss.data.length > 0 ? (
                                        reflectionSummaryss.data.map((reflection: {
                                            id: string;
                                            title: string;
                                            response: string;
                                            responseDate: string;
                                            responder: {
                                                userName: string;
                                            };
                                        }) => (
                                            <div key={reflection.id} className="p-4 sm:p-6 hover:bg-orange-50 transition-all duration-200 border-l-4 border-l-transparent hover:border-l-slate-200">
                                                <div className="flex items-start justify-between mb-3 sm:mb-4">
                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-[#fb923c] to-orange-500 flex items-center justify-center shadow-md">
                                                            <User className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-900 text-sm sm:text-base">{reflection.responder.userName}</p>
                                                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                <span className="hidden sm:inline">Posted: </span>
                                                                {getDatesInSeconds(reflection.responseDate)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="px-2 py-1 text-xs text-[#fb923c] bg-orange-100 rounded-full font-medium">
                                                        #{reflection.id ? String(reflection.id).slice(-6) : 'N/A'}
                                                    </span>
                                                </div>
                                                
                                                <div className="mb-3 sm:mb-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-2 h-2 rounded-full bg-[#fb923c]"></div>
                                                        <p className="text-xs sm:text-sm font-medium text-slate-700">Reflection Question:</p>
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-slate-600 italic bg-slate-50 p-2 sm:p-3 rounded-lg border-l-2 border-[#fb923c]">
                                                        "{reflection.title}"
                                                    </p>
                                                </div>
                                                
                                                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-3 sm:p-4 border border-orange-100">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-[#fb923c]" />
                                                        <p className="text-xs sm:text-sm font-medium text-slate-700">Response:</p>
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                                                        {reflection.response}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-6 sm:p-12 text-center">
                                            <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center mb-4">
                                                <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-[#fb923c]" />
                                            </div>
                                            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">No responses yet</h3>
                                            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">User responses will appear here once they start reflecting on your questions.</p>
                                            <div className="mt-4 inline-flex items-center gap-2 text-xs text-[#fb923c] bg-orange-50 px-3 py-1 rounded-full">
                                                <div className="w-2 h-2 rounded-full bg-[#fb923c]"></div>
                                                Waiting for responses...
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     )
}