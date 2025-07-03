"use client"
import { useCreateEmotionCheckins } from '@/hooks/emotions/useCreateEmotions';
import { usegetEmotions } from '@/hooks/emotions/useGetEmotions';
import { useState } from 'react';

interface EmotionEntry {
    id: string;
    feelings: string;
    emotionIntensity: number;
    notes: string;
    activities: string[];
    createdAt: string;
    aiAnalysis?: string;
    aiInsights?: string[];
    aiRecommendations?: string[];
    aiDailyTips?: string[];
    aiMotivationalMessage?: string;
    aiWarningFlags?: string[];
    aiPositiveAspects?: string[];
}

export const getDatesInSeconds = (date: string): string => {
    const givenDate = new Date(date);
    const now = new Date();
  
    const seconds = Math.floor((now.getTime() - givenDate.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(seconds / 86400);
  
    if (seconds < 5) return "just now";
    if (seconds < 60) return `${seconds} seconds ago`;
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (days === 1) return "yesterday";
    if (days < 7) return `${days} days ago`;
  
    return givenDate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
};

export function EmotionsCheckIns() {
    const [newTag, setNewTag] = useState('');
    const [showAllEntries, setShowAllEntries] = useState(false);
    
    const { 
        formData,
        updateFormData,
        isPendingEmotions: isPending,
        handleChange,
        handleSubmit,
        errors
    } = useCreateEmotionCheckins();

    const FeelingEmotions = [
        {
            label: "Happy",
            emoji: "😊"
        },
        {
            label: "Annoyed",
            emoji: "😤"
        },
        {
            label: "Angry",
            emoji: "😡"
        },
        {
            label: "Tired",
            emoji: "😴"
        },
        {
            label: "Neutral",
            emoji: "😐"
        },
        {
            label: "Loved",
            emoji: "💖"
        }
    ];

    const addTag = () => {
        const currentActivities = formData.activities as string[];
        if (newTag.trim() && !currentActivities.includes(newTag.trim())) {
            updateFormData('activities', [...currentActivities, newTag.trim()]);
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        updateFormData('activities', formData.activities.filter((tag: string) => tag !== tagToRemove));
    };

    const handleEmotionSelect = (emotionLabel: string) => {
        updateFormData('feelings', emotionLabel);
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await handleSubmit(e);
    };

    const {
        data,
        isLoading,
        isPending: isPendingEmotionsData,
        isFetching,
    } = usegetEmotions();
    
    const dataEmotions: EmotionEntry[] = data?.data || [];

    const isToday = (dateString: string): boolean => {
        const today = new Date();
        const checkDate = new Date(dateString);
        
        return today.getFullYear() === checkDate.getFullYear() &&
               today.getMonth() === checkDate.getMonth() &&
               today.getDate() === checkDate.getDate();
    };

    const todayEmotions = dataEmotions.filter(emotion => isToday(emotion.createdAt));

    const handleEmojis = (feeling: string): string => {
        const emojiMap: { [key: string]: string } = {
            "Happy": "😊",
            "Annoyed": "😤",
            "Angry": "😡",
            "Tired": "😴",
            "Neutral": "😐",
            "Loved": "💖"
        };
        return emojiMap[feeling] || "😊";
    };

    const EntrySkeleton = () => (
        <div className="border-b border-gray-100 pb-4 mb-4 animate-pulse">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="flex items-center gap-2 mb-2">
                <div className="h-5 bg-gray-200 rounded-full w-20"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="flex gap-2">
                <div className="h-5 bg-gray-200 rounded-full w-12"></div>
                <div className="h-5 bg-gray-200 rounded-full w-16"></div>
            </div>
        </div>
    );

    const displayedEntries = showAllEntries ? dataEmotions : dataEmotions.slice(0, 2);
    const hasMoreEntries = dataEmotions.length > 2;

    return (
        <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2 order-1 lg:order-1">
                    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
                        <form onSubmit={onSubmit} className="space-y-6 sm:space-y-8 lg:space-y-9">
                            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
                                <h2 className="text-lg sm:text-xl lg:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
                                    How are you feeling today?
                                </h2>
                                {errors.feelings && (
                                    <p className="text-amber-500 text-sm mb-2">{errors.feelings}</p>
                                )}
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-3 sm:gap-4 lg:gap-16">
                                    {FeelingEmotions.map((emotion) => (
                                        <button
                                            key={emotion.label}
                                            type="button"
                                            onClick={() => handleEmotionSelect(emotion.label)}
                                            className={`flex flex-col items-center p-3 sm:p-4 lg:p-3 rounded-lg border-2 transition-all ${
                                                formData.feelings === emotion.label
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <span className="text-xl sm:text-2xl mb-1">{emotion.emoji}</span>
                                            <span className="text-xs sm:text-sm font-medium text-gray-700">{emotion.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
                                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                            <span className="text-xs sm:text-sm">🧠</span>
                                        </div>
                                        <span className="font-medium text-gray-900 text-sm sm:text-base">Emotional intensity:</span>
                                        <span className="text-orange-500 font-semibold text-sm sm:text-base">{formData.emotionIntensity}%</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">How strongly do you feel this emotion?</p>
                                    <div className="space-y-2">
                                        <input
                                            type="range"
                                            name="emotionIntensity"
                                            min="0"
                                            max="100"
                                            value={formData.emotionIntensity}
                                            onChange={handleChange}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                            style={{
                                                background: `linear-gradient(to right, #f97316 0%, #f97316 ${formData.emotionIntensity}%, #e5e7eb ${formData.emotionIntensity}%, #e5e7eb 100%)`
                                            }}
                                        />
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span className="hidden sm:inline">Very Low</span>
                                            <span className="sm:hidden">Low</span>
                                            <span className="hidden sm:inline">Low</span>
                                            <span className="hidden sm:inline">Moderate</span>
                                            <span className="sm:hidden">Med</span>
                                            <span className="hidden sm:inline">High</span>
                                            <span className="sm:hidden">High</span>
                                            <span className="hidden sm:inline">Very High</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
                                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                            <span className="text-xs sm:text-sm">📝</span>
                                        </div>
                                        <span className="font-medium text-gray-900 text-sm sm:text-base">Context & Activities</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Add tags to describe what influenced your mood</p>
                                    <div className="flex flex-col sm:flex-row gap-2 mb-3">
                                        <input
                                            type="text"
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            placeholder="e.g., School, work, family"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                        />
                                        <button
                                            type="button"
                                            onClick={addTag}
                                            className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors w-full sm:w-auto"
                                        >
                                            Add tags
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.activities.map((tag: string, index: number) => (
                                            <span
                                                key={index}
                                                onClick={() => removeTag(tag)}
                                                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium cursor-pointer hover:bg-green-200 transition-colors"
                                            >
                                                {tag} ×
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
                                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                        <span className="text-xs sm:text-sm">📋</span>
                                    </div>
                                    <span className="font-medium text-gray-900 text-sm sm:text-base">Additional notes</span>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Describe what happened or why do you feel this way?</p>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={4}
                                    placeholder="Have wonderful day exploring new concepts at work, felt energized and focused. Feeling grateful for supportive colleagues"
                                />
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className={`mt-4 w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                                        isPending
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-gray-900 hover:bg-gray-800 text-white'
                                    }`}
                                >
                                    <span>
                                        <svg
                                            className={`w-5 h-5 ${isPending ? 'animate-spin' : ''}`}
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2.93 6.243A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3.93-1.695zM20.485 17.657A7.962 7.962 0 0120 12h-4c0 .934-.184 1.823-.515 2.657l4.999 2zM22 12a8 8 0 01-8 8v4c6.627 0 12-5.373 12-12h-4zm-2.93-6.243A7.962 7.962 0 0120 12h4c0-3.042-1.135-5.824-3-7.938l-3.93 1.695z"
                                            ></path>
                                        </svg>
                                    </span>
                                    <span>{isPending ? 'Saving...' : 'Save Report Entries'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="space-y-4 sm:space-y-6 order-2 lg:order-2">
                    <div className="rounded-lg p-4 sm:p-6 shadow-sm border bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-100 rounded flex items-center justify-center">
                                    <span className="text-xs">📊</span>
                                </div>
                                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Recent Entries</h3>
                            </div>
                            {hasMoreEntries && (
                                <button 
                                    onClick={() => setShowAllEntries(!showAllEntries)}
                                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    {showAllEntries ? 'Show Less' : 'View All'}
                                </button>
                            )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">A quick look at your emotional journey</p>
                        
                        <div className={`space-y-3 sm:space-y-4 ${showAllEntries ? 'max-h-64 sm:max-h-96 overflow-y-auto pr-2' : ''}`}>
                            {isPendingEmotionsData ? (
                                <>
                                    <EntrySkeleton />
                                    <EntrySkeleton />
                                    <EntrySkeleton />
                                </>
                            ) : dataEmotions.length === 0 ? (
                                <div className="text-center py-6 sm:py-8">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <span className="text-xl sm:text-2xl">📝</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-500">No entries found</p>
                                    <p className="text-xs text-gray-400 mt-1">Start by adding your first emotion check-in</p>
                                </div>
                            ) : (
                                displayedEntries.map((entry) => (
                                    <div key={entry.id} className="border border-gray-300 p-4 sm:p-6 lg:p-8 rounded-xl bg-white">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-base sm:text-lg">{handleEmojis(entry.feelings)}</span>
                                                <span className="text-xs sm:text-sm font-medium text-gray-900">{entry.feelings}</span>
                                            </div>
                                            <span className="text-xs text-gray-500">{getDatesInSeconds(entry.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                                                Intensity: {entry.emotionIntensity}%
                                            </span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-700 mb-2 line-clamp-2 sm:line-clamp-none">{entry.notes}</p>
                                        <div className="flex gap-2 flex-wrap">
                                            {entry.activities.slice(0, 3).map((tag, index) => (
                                                <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                                    {tag}
                                                </span>
                                            ))}
                                            {entry.activities.length > 3 && (
                                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                                    +{entry.activities.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {!isPendingEmotionsData && !showAllEntries && hasMoreEntries && (
                            <div className="flex items-center justify-center gap-1 mt-4 text-xs sm:text-sm text-gray-500">
                                <span>Scroll for more</span>
                                <span>●●●</span>
                            </div>
                        )}
                    </div>

                    {todayEmotions.length > 0 && (() => {
                        const latestEmotion = todayEmotions.sort((a, b) => 
                            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                        )[0];

                        return (
                            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
                                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-100 rounded flex items-center justify-center">
                                        <span className="text-xs">🤔</span>
                                    </div>
                                    <span className="font-semibold text-gray-900 text-sm sm:text-base">Reflection on Your emotions</span>
                                </div>
                                <div className="space-y-3 sm:space-y-4 overflow-y-auto max-h-40 sm:max-h-48">
                                    {latestEmotion.aiAnalysis && (
                                        <div className="mb-3">
                                            <h4 className="text-xs sm:text-sm font-medium text-gray-800 mb-1">AI Analysis:</h4>
                                            <p className="text-xs sm:text-sm text-gray-700">{latestEmotion.aiAnalysis}</p>
                                        </div>
                                    )}
                                    
                                    {latestEmotion.aiMotivationalMessage && (
                                        <div className="mb-3">
                                            <h4 className="text-xs sm:text-sm font-medium text-gray-800 mb-1">Motivational Message:</h4>
                                            <p className="text-xs sm:text-sm text-gray-700 italic">"{latestEmotion.aiMotivationalMessage}"</p>
                                        </div>
                                    )}

                                    {latestEmotion.aiRecommendations && latestEmotion.aiRecommendations.length > 0 && (
                                        <div className="mb-3">
                                            <h4 className="text-xs sm:text-sm font-medium text-gray-800 mb-1">Recommendations:</h4>
                                            <ul className="text-xs sm:text-sm text-gray-700 space-y-1">
                                                {latestEmotion.aiRecommendations.slice(0, 2).map((rec, index) => (
                                                    <li key={index} className="flex items-start gap-1">
                                                        <span className="text-blue-500 mt-1">•</span>
                                                        <span>{rec}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {latestEmotion.aiDailyTips && latestEmotion.aiDailyTips.length > 0 && (
                                        <div className="mb-3">
                                            <h4 className="text-xs sm:text-sm font-medium text-gray-800 mb-1">Daily Tips:</h4>
                                            <p className="text-xs sm:text-sm text-gray-700">{latestEmotion.aiDailyTips[0]}</p>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="mt-4 pt-3 border-t border-gray-100">
                                    <p className="text-xs sm:text-sm text-gray-600 mb-2">Take a moment to reflect on this:</p>
                                    <p className="text-xs sm:text-sm text-gray-700 italic">
                                        "Emotions are data, not directives. They provide valuable information about our experiences and needs, helping us navigate life with greater awareness and intention."
                                    </p>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
}