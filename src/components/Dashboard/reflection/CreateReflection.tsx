"use client";
import { useCreateDailyReflection } from "@/hooks/reflection/useCreateReflection";
import { usegetReflectionsSummary } from "@/hooks/reflection/useGetAllReflectionsOverview";
import { Loader2, Plus, MessageSquare, Users, Calendar, Eye, User } from "lucide-react";
import { getDatesInSeconds } from "../emotions/EmotionsDailyCheckins";

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

      console.log("Reflection Summary Data:", reflectionSummaryss);

     return(
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="mx-auto max-w-7xl px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Daily Reflections</h1>
                            <p className="text-slate-600 mt-1">Manage daily reflection questions and view user responses</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>{reflectionSummaryss?.data?.length || 0} Responses</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-6 py-8">
                <div className="grid grid-cols-12 gap-8">
                    {/* Post New Reflection - Sidebar */}
                    <div className="col-span-12 lg:col-span-4">
                        <div className="sticky top-8">
                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm h-[340px]">
                                <div className="border-b border-slate-200 px-6 py-4">
                                    <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                        <Plus className="h-5 w-5" />
                                        Post Daily Reflection
                                    </h2>
                                </div>
                                
                                <form onSubmit={handleSubmit} className="p-6">
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
                                                onChange={handleChange}
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
                                        className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg bg-[#fb923c] px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                                    >
                                        {isPending ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Publishing...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="h-4 w-4" />
                                                Publish Reflection
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Responses Feed - Main Content */}
                    <div className="col-span-12 lg:col-span-8">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
                            <div className="bg-slate-700 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5" />
                                        User Responses
                                    </h2>
                                    {!isPendingSummary && reflectionSummaryss?.data && (
                                        <span className="text-orange-100 text-sm font-medium">
                                            {reflectionSummaryss.data.length} responses
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="divide-y divide-slate-200">
                                {isPendingSummary ? (
                                    // Skeleton Loading
                                    <>
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="p-6">
                                                <div className="animate-pulse">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-full bg-slate-200"></div>
                                                            <div>
                                                                <div className="h-4 bg-slate-200 rounded w-24 mb-1"></div>
                                                                <div className="h-3 bg-slate-200 rounded w-20"></div>
                                                            </div>
                                                        </div>
                                                        <div className="h-3 bg-slate-200 rounded w-16"></div>
                                                    </div>
                                                    <div className="mb-3">
                                                        <div className="h-4 bg-slate-200 rounded w-48 mb-2"></div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="h-3 bg-slate-200 rounded w-full"></div>
                                                        <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                                                        <div className="h-3 bg-slate-200 rounded w-4/6"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : reflectionSummaryss?.data && reflectionSummaryss.data.length > 0 ? (
                                    reflectionSummaryss.data.map((reflection) => (
                                        <div key={reflection.id} className="p-6 hover:bg-orange-50 transition-all duration-200 border-l-4 border-l-transparent hover:border-l-slate-200">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#fb923c] to-orange-500 flex items-center justify-center shadow-md">
                                                        <User className="h-5 w-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{reflection.responder.userName}</p>
                                                        <p className="text-xs text-slate-500 flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            Posted: {" "}
                                                            {getDatesInSeconds(reflection.responseDate)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="px-2 py-1 text-xs text-[#fb923c] bg-orange-100 rounded-full font-medium">
                                                    #{reflection.id}
                                                </span>
                                            </div>
                                            
                                            <div className="mb-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-2 h-2 rounded-full bg-[#fb923c]"></div>
                                                    <p className="text-sm font-medium text-slate-700">Reflection Question:</p>
                                                </div>
                                                <p className="text-sm text-slate-600 italic bg-slate-50 p-3 rounded-lg border-l-2 border-[#fb923c]">
                                                    "{reflection.title}"
                                                </p>
                                            </div>
                                            
                                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <MessageSquare className="h-4 w-4 text-[#fb923c]" />
                                                    <p className="text-sm font-medium text-slate-700">Response:</p>
                                                </div>
                                                <p className="text-sm text-slate-800 leading-relaxed">
                                                    {reflection.response}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center">
                                        <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center mb-4">
                                            <Eye className="h-8 w-8 text-[#fb923c]" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No responses yet</h3>
                                        <p className="text-sm text-slate-500">User responses will appear here once they start reflecting on your questions.</p>
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
     )
}