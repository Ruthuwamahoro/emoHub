"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, CheckCircle2, Award, ArrowLeft, ArrowRight, Star, Target, BookOpen, Lightbulb, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Types
interface ChallengeDay {
  day: number;
  isCompleted: boolean;
  reflection: string;
  pointsEarned: number;
  timestamp?: string;
  suggestion?: string;
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  days?: ChallengeDay[];
  startDate?: string;
  endDate?: string;
}

interface ChallengeTrackerProps {
  challenge: Challenge;
  onClose: () => void;
  onComplete: (challengeId: number) => void;
}

export const DailyChallengeTracker: React.FC<ChallengeTrackerProps> = ({
  challenge,
  onClose,
  onComplete
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [activeDay, setActiveDay] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>("today");
  const [days, setDays] = useState<ChallengeDay[]>([]);
  const [reflection, setReflection] = useState<string>("");
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [showCompletionFeedback, setShowCompletionFeedback] = useState<boolean>(false);
  const [latestCompletedDay, setLatestCompletedDay] = useState<ChallengeDay | null>(null);
  const [animatePoints, setAnimatePoints] = useState<boolean>(false);
  
  // For scrolling to feedback
  const feedbackRef = useRef<HTMLDivElement>(null);

  // Generate personalized suggestions based on reflection content
  const generateSuggestion = (reflectionText: string): string => {
    // Simple keyword-based suggestion generation
    const reflectionLower = reflectionText.toLowerCase();
    
    if (reflectionLower.includes("stress") || reflectionLower.includes("anxious") || reflectionLower.includes("overwhelm")) {
      return "Try incorporating a 5-minute breathing exercise tomorrow. Focus on slow, deep breaths to activate your parasympathetic nervous system.";
    } else if (reflectionLower.includes("grateful") || reflectionLower.includes("thankful") || reflectionLower.includes("appreciation")) {
      return "Your gratitude practice is powerful! Consider expanding it by writing a thank you note to someone who's positively impacted your life.";
    } else if (reflectionLower.includes("sleep") || reflectionLower.includes("tired") || reflectionLower.includes("rest")) {
      return "For better sleep quality tomorrow, try avoiding screens 30 minutes before bed and setting a consistent sleep schedule.";
    } else if (reflectionLower.includes("meditat") || reflectionLower.includes("mindful")) {
      return "Great mindfulness practice! Try extending your meditation time by just 2 minutes tomorrow to deepen the benefits.";
    } else if (reflectionLower.includes("journal") || reflectionLower.includes("writing") || reflectionLower.includes("wrote")) {
      return "Your journaling is valuable! Tomorrow, try exploring a specific emotion or experience in greater depth.";
    }
    
    // Default suggestions for different challenge types
    if (challenge.title.includes("Gratitude")) {
      return "Tomorrow, try focusing your gratitude on something small and easily overlooked in your daily life.";
    } else if (challenge.title.includes("Meditation")) {
      return "For tomorrow's practice, try focusing on the sensations in your body as you meditate.";
    } else if (challenge.title.includes("Emotional")) {
      return "Tomorrow, consider how your emotions connect to your physical sensations and thoughts.";
    }
    
    // Generic fallback suggestion
    return "For tomorrow, try noticing one small moment of joy or peace in your day and savoring it fully.";
  };
  
  // Initialize challenge days (7 days total)
  useEffect(() => {
    if (!challenge.days) {
      const initialDays: ChallengeDay[] = Array.from({ length: 7 }, (_, i) => ({
        day: i + 1,
        isCompleted: false,
        reflection: "",
        pointsEarned: 0
      }));
      
      setDays(initialDays);
    } else {
      setDays(challenge.days);
      
      // Calculate total points
      const earned = challenge.days.reduce((sum, day) => sum + day.pointsEarned, 0);
      setTotalPoints(earned);
      
      // Set active day to first incomplete day or last day
      const firstIncompleteDay = challenge.days.findIndex(day => !day.isCompleted);
      if (firstIncompleteDay !== -1) {
        setActiveDay(firstIncompleteDay + 1);
      } else {
        setActiveDay(challenge.days.length);
      }
    }
  }, [challenge]);

  // Scroll to feedback when it appears
  useEffect(() => {
    if (showCompletionFeedback && feedbackRef.current) {
      feedbackRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showCompletionFeedback]);

  const handleCloseDialog = () => {
    setIsOpen(false);
    onClose();
  };

  const handleSaveReflection = () => {
    const updatedDays = [...days];
    const dayIndex = activeDay - 1;
    
    // Calculate daily points (base points divided by 7 days, rounded)
    const dailyPoints = Math.round(challenge.points / 7);
    
    // Generate personalized suggestion based on reflection
    const suggestion = generateSuggestion(reflection);
    
    const completedDay = {
      ...updatedDays[dayIndex],
      isCompleted: true,
      reflection: reflection,
      pointsEarned: dailyPoints,
      timestamp: new Date().toISOString(),
      suggestion: suggestion
    };
    
    updatedDays[dayIndex] = completedDay;
    
    setDays(updatedDays);
    setLatestCompletedDay(completedDay);
    
    // Trigger points animation
    setAnimatePoints(true);
    setTimeout(() => setAnimatePoints(false), 1500);
    
    setTotalPoints(prev => prev + dailyPoints);
    setShowCompletionFeedback(true);
    
    // If all days are completed, mark the challenge as complete
    const allCompleted = updatedDays.every(day => day.isCompleted);
    if (allCompleted) {
      onComplete(challenge.id);
    }
  };
  
  const handleDaySelect = (day: number) => {
    setActiveDay(day);
    const dayData = days[day - 1];
    if (dayData.reflection) {
      setReflection(dayData.reflection);
    } else {
      setReflection("");
    }
    setShowCompletionFeedback(false); // Hide feedback when changing days
  };

  const handleContinue = () => {
    // Move to next day if not the last day
    if (activeDay < 7) {
      setActiveDay(activeDay + 1);
      setReflection("");
      setShowCompletionFeedback(false);
    } else {
      // If it's the last day, just hide the feedback
      setShowCompletionFeedback(false);
    }
  };

  const calculateProgress = (): number => {
    const completedDays = days.filter(day => day.isCompleted).length;
    return Math.round((completedDays / 7) * 100);
  };
  
  // Determine if user can complete today's challenge
  const canCompleteToday = activeDay > 1 
    ? days[activeDay - 2]?.isCompleted 
    : true;

  // Get today's formatted date
  const getTodayDateFormatted = (): string => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl font-bold text-purple-800">
            <Target className="mr-2 text-purple-600" /> 
            {challenge.title}
          </DialogTitle>
          <DialogDescription>
            {challenge.description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Challenge Progress</p>
              <div className="flex items-center">
                <Progress value={calculateProgress()} className="w-40 mr-2" />
                <span className="text-sm font-medium">{calculateProgress()}%</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Points Earned</p>
              <div className="flex items-center justify-end">
                <Award className="w-4 h-4 mr-1 text-yellow-500" />
                <span className={`text-lg font-bold ${animatePoints ? 'text-yellow-500 scale-110 transition-all' : ''}`}>
                  {totalPoints}
                </span>
                <span className="text-sm text-gray-500 ml-1">/{challenge.points}</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="today" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-4">
              <TabsTrigger value="today" className="flex-1">Today's Task</TabsTrigger>
              <TabsTrigger value="progress" className="flex-1">Weekly Progress</TabsTrigger>
            </TabsList>
            
            <TabsContent value="today" className="space-y-4">
              {showCompletionFeedback ? (
                <div ref={feedbackRef} className="space-y-4">
                  <div className="bg-green-50 border border-green-100 rounded-lg p-6 text-center transition-all animate-in slide-in-from-bottom">
                    <div className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-green-800 mb-2">Day {activeDay} Completed!</h3>
                    <p className="text-green-700 mb-4">Great job on completing today's challenge.</p>
                    
                    <div className="flex justify-center items-center space-x-2 mb-6">
                      <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full flex items-center">
                        <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
                        <span className="font-bold">+{latestCompletedDay?.pointsEarned} points</span>
                      </div>
                    </div>
                    
                    <div className="mb-6 bg-purple-50 p-4 rounded-lg text-left">
                      <div className="flex items-start">
                        <Lightbulb className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-purple-800 mb-1">For tomorrow:</h4>
                          <p className="text-purple-700">{latestCompletedDay?.suggestion}</p>
                        </div>
                      </div>
                    </div>
                    
                    {activeDay < 7 ? (
                      <div className="text-center">
                        <p className="text-gray-600 mb-4">Remember to come back tomorrow to continue your challenge.</p>
                        <Button onClick={handleContinue} className="px-6">
                          See You Tomorrow
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-gray-600 mb-4">You've completed the final day of this challenge!</p>
                        <Button onClick={handleContinue} className="px-6">
                          View Summary
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg">Day {activeDay}</CardTitle>
                        <p className="text-xs text-gray-500 mt-1">{getTodayDateFormatted()}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDaySelect(Math.max(1, activeDay - 1))}
                          disabled={activeDay === 1}
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDaySelect(Math.min(7, activeDay + 1))}
                          disabled={activeDay === 7}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription className="mt-2">
                      {days[activeDay - 1]?.isCompleted 
                        ? "Completed! Review your reflection below."
                        : "Complete today's task and share your reflection"}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    {!canCompleteToday && !days[activeDay - 1]?.isCompleted && (
                      <Alert className="mb-4 bg-amber-50 text-amber-800 border-amber-200">
                        <AlertTitle className="font-medium">Complete previous days first</AlertTitle>
                        <AlertDescription>
                          Please complete the previous day's challenge before proceeding to this one.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        Your Reflection
                      </label>
                      <Textarea 
                        placeholder="How did this challenge impact you today? What did you learn? How did it make you feel?"
                        className="w-full"
                        rows={4}
                        value={reflection}
                        onChange={(e) => setReflection(e.target.value)}
                        disabled={days[activeDay - 1]?.isCompleted || !canCompleteToday}
                      />
                    </div>
                    
                    {days[activeDay - 1]?.suggestion && (
                      <div className="mt-4 bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-start">
                          <Lightbulb className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-purple-800 mb-1">Your personal insight:</h4>
                            <p className="text-purple-700">{days[activeDay - 1].suggestion}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="flex justify-between">
                    {!days[activeDay - 1]?.isCompleted ? (
                      <>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Award className="w-4 h-4 mr-1 text-yellow-500" />
                          Earn {Math.round(challenge.points / 7)} points
                        </div>
                        <Button 
                          onClick={handleSaveReflection}
                          disabled={reflection.trim().length < 10 || !canCompleteToday}
                          className="relative overflow-hidden group"
                        >
                          <span className="relative z-10">Complete Day {activeDay}</span>
                          <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        </Button>
                      </>
                    ) : (
                      <div className="w-full flex justify-between items-center">
                        <div className="flex items-center text-green-600">
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          <span className="text-sm">Completed on {new Date(days[activeDay - 1]?.timestamp || "").toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Award className="w-4 h-4 mr-1 text-yellow-500" />
                          <span className="text-sm font-medium">{days[activeDay - 1]?.pointsEarned} points earned</span>
                        </div>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="progress">
              <Card>
                <CardHeader>
                  <CardTitle>7-Day Challenge Progress</CardTitle>
                  <CardDescription>Track your journey through this challenge</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {days.map((day) => (
                      <div 
                        key={day.day} 
                        className={`
                          flex flex-col items-center justify-center p-2 rounded-md cursor-pointer transition-all
                          ${activeDay === day.day ? 'ring-2 ring-purple-500' : ''}
                          ${day.isCompleted 
                            ? 'bg-green-50 border border-green-200 hover:bg-green-100' 
                            : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'}
                        `}
                        onClick={() => handleDaySelect(day.day)}
                      >
                        <span className="text-sm font-medium">Day {day.day}</span>
                        {day.isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-1" />
                        ) : (
                          <Calendar className="w-4 h-4 text-gray-400 mt-1" />
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      Challenge Insights
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                        <div className="text-xs text-gray-500">Completion Rate</div>
                        <div className="text-xl font-bold">{calculateProgress()}%</div>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                        <div className="text-xs text-gray-500">Points Earned</div>
                        <div className="text-xl font-bold flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500" />
                          {totalPoints}/{challenge.points}
                        </div>
                      </div>
                    </div>

                    {days.some(day => day.reflection) && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Your Reflections</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                          {days.filter(day => day.reflection).map(day => (
                            <div 
                              key={day.day} 
                              className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                              onClick={() => handleDaySelect(day.day)}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium">Day {day.day}</span>
                                <span className="text-xs text-gray-500">
                                  {day.timestamp ? new Date(day.timestamp).toLocaleDateString() : ""}
                                </span>
                              </div>
                              <p className="text-sm line-clamp-2">{day.reflection}</p>
                              {day.reflection.length > 120 && (
                                <Button variant="link" className="text-xs p-0 h-auto mt-1">
                                  Read more
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex justify-between items-center">
          <Button variant="outline" onClick={handleCloseDialog}>
            Save & Close
          </Button>
          {calculateProgress() === 100 && (
            <div className="flex items-center text-green-600">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Challenge Completed!
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DailyChallengeTracker;