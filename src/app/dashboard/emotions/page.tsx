"use client"
import React, { useState } from 'react';
import { BarChart, PieChart, LineChart, Mic, MessageSquare, Activity, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EmotionPatternRecognition = () => {
  const [activeTab, setActiveTab] = useState('input');
  const [selectedEmoji, setSelectedEmoji] = useState('😊');
  const [currentActivity, setCurrentActivity] = useState('');
  const [selectedTone, setSelectedTone] = useState('');
  const [notes, setNotes] = useState('');
  const [entries, setEntries] = useState([
    { 
      id: 1, 
      date: "Mar 5, 2:30 PM", 
      emoji: "😓", 
      tone: "Stressed", 
      activity: "Meeting preparation", 
      notes: "Feeling rushed to finish slides" 
    },
    { 
      id: 2, 
      date: "Mar 5, 10:15 AM", 
      emoji: "🤔", 
      tone: "Curious", 
      activity: "Research", 
      notes: "Exploring new project ideas" 
    },
    { 
      id: 3, 
      date: "Mar 4, 4:45 PM", 
      emoji: "😊", 
      tone: "Content", 
      activity: "Team collaboration", 
      notes: "Good progress on the project" 
    }
  ]);
  
  const emojis = ["😊", "😐", "😢", "😡", "😰", "🤔", "😴", "🥳", "😓", "🥰"];
  const tones = ["Happy", "Neutral", "Sad", "Angry", "Anxious", "Curious", "Tired", "Excited", "Stressed", "Loving"];
  
  const commonActivities = [
    "Working", "Meeting", "Relaxing", "Exercising", 
    "Socializing", "Learning", "Commuting", "Family time"
  ];
  
  const handleSubmit = () => {
    const newEntry = {
      id: entries.length + 1,
      date: new Date().toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric', 
        hour12: true 
      }),
      emoji: selectedEmoji,
      tone: selectedTone,
      activity: currentActivity,
      notes: notes
    };
    
    setEntries([newEntry, ...entries]);
    setNotes('');
    setActiveTab('insights');
  };
  
  const getTopEmotion = () => {
    const emojiCounts = {};
    entries.forEach(entry => {
      emojiCounts[entry.emoji] = (emojiCounts[entry.emoji] || 0) + 1;
    });
    
    let topEmoji = entries[0]?.emoji || "😊";
    let maxCount = 0;
    
    Object.keys(emojiCounts).forEach(emoji => {
      if (emojiCounts[emoji] > maxCount) {
        maxCount = emojiCounts[emoji];
        topEmoji = emoji;
      }
    });
    
    return topEmoji;
  };
  
  const getActivityPattern = () => {
    const activityMap = {};
    const toneMap = {};
    
    entries.forEach(entry => {
      if (!activityMap[entry.activity]) {
        activityMap[entry.activity] = [];
      }
      activityMap[entry.activity].push(entry.tone);
      
      if (!toneMap[entry.tone]) {
        toneMap[entry.tone] = 0;
      }
      toneMap[entry.tone]++;
    });
    
    return { activityMap, toneMap };
  };
  
  const { activityMap, toneMap } = getActivityPattern();
  
  // Convert tone map to array for visualization
  const toneData = Object.keys(toneMap).map(tone => ({
    tone,
    count: toneMap[tone],
    color: tone === "Happy" || tone === "Excited" || tone === "Content" ? "bg-green-500" : 
           tone === "Sad" || tone === "Tired" || tone === "Stressed" ? "bg-blue-400" :
           tone === "Angry" ? "bg-red-500" :
           tone === "Anxious" ? "bg-yellow-500" : "bg-purple-500"
  }));
  
  const generateInsights = () => {
    if (entries.length < 2) return "Add more entries to generate insights";
    
    const recentTones = entries.slice(0, 3).map(e => e.tone);
    const recentActivities = entries.slice(0, 3).map(e => e.activity);
    
    const insights = [];
    
    if (recentTones.includes("Stressed") && recentActivities.some(a => a.includes("Meeting"))) {
      insights.push("You seem to feel stressed before or during meetings");
    }
    
    if (recentTones.includes("Happy") && recentActivities.some(a => a.includes("Team"))) {
      insights.push("Team collaboration appears to boost your mood");
    }
    
    if (recentTones.includes("Tired") && entries[0].tone !== "Tired") {
      insights.push("Your energy levels have improved since your last entry");
    }
    
    if (recentTones.includes("Curious") && recentActivities.some(a => a.includes("Research") || a.includes("Learning"))) {
      insights.push("Learning new things sparks your curiosity");
    }
    
    if (insights.length === 0) {
      insights.push("Keep logging your emotions to receive personalized insights");
    }
    
    return insights;
  };
  
  const insights = generateInsights();
  
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold flex items-center">
            Emotion Pattern Recognition
            <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">AI Powered</span>
          </CardTitle>
          <CardDescription>
            Track, analyze and gain insights from your emotional patterns
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Tabs defaultValue="input" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="input">
            <MessageSquare className="w-4 h-4 mr-2" />
            Input
          </TabsTrigger>
          <TabsTrigger value="insights">
            <Activity className="w-4 h-4 mr-2" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="history">
            <BarChart className="w-4 h-4 mr-2" />
            History
          </TabsTrigger>
          <TabsTrigger value="overview">
            <PieChart className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
        </TabsList>
        
        {/* Input Tab */}
        <TabsContent value="input">
          <Card>
            <CardHeader>
              <CardTitle>How are you feeling right now?</CardTitle>
              <CardDescription>Share your current emotional state</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Emoji Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Choose an emoji that represents your mood</label>
                <div className="flex flex-wrap gap-2">
                  {emojis.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`text-2xl p-2 rounded-md ${selectedEmoji === emoji ? 'bg-blue-100 shadow-sm' : 'hover:bg-gray-100'}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Tone Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">What tone best describes your mood?</label>
                <div className="flex flex-wrap gap-2">
                  {tones.map(tone => (
                    <button
                      key={tone}
                      onClick={() => setSelectedTone(tone)}
                      className={`px-3 py-1 rounded-full text-sm ${selectedTone === tone ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Current Activity */}
              <div>
                <label className="block text-sm font-medium mb-2">What are you currently doing?</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {commonActivities.map(activity => (
                    <button
                      key={activity}
                      onClick={() => setCurrentActivity(activity)}
                      className={`px-3 py-1 rounded-full text-sm ${currentActivity === activity ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    >
                      {activity}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={currentActivity}
                  onChange={e => setCurrentActivity(e.target.value)}
                  placeholder="Or type your activity..."
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-2">Any additional notes? (optional)</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Share more details about how you're feeling..."
                  className="w-full p-2 border rounded-md h-24"
                />
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={!selectedEmoji || !selectedTone || !currentActivity}
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Log Emotion
              </button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Insights Tab */}
        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>Emotional Insights</CardTitle>
              <CardDescription>Analysis based on your recent entries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">{getTopEmotion()}</span>
                    <h3 className="font-medium">Your Dominant Emotion</h3>
                  </div>
                  <p className="text-sm text-gray-600 pl-9">
                    This has been your most frequent emotional state recently.
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Personalized Insights</h3>
                  <ul className="space-y-2">
                    {insights.map((insight, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span className="text-sm">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Activity-Emotion Connections</h3>
                  <div className="space-y-2">
                    {Object.keys(activityMap).slice(0, 3).map((activity, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="font-medium">{activity}:</span> Usually associated with 
                        <span className="ml-1 text-blue-600">{activityMap[activity][0] || "varied emotions"}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Suggestions</h3>
                  <p className="text-sm text-gray-600">
                    {entries[0]?.tone === "Stressed" ? 
                      "Consider taking short breaks and practicing deep breathing during your next meeting." :
                      entries[0]?.tone === "Tired" ?
                      "Your energy seems low. A short walk or power nap might help rejuvenate you." :
                      "Continue tracking your emotions to receive more personalized suggestions."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Emotion History</CardTitle>
              <CardDescription>Your recent emotional states</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {entries.map(entry => (
                  <div key={entry.id} className="p-3 border rounded-lg flex">
                    <div className="text-3xl mr-3 flex-shrink-0">{entry.emoji}</div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{entry.tone}</span>
                        <span className="text-xs text-gray-500">{entry.date}</span>
                      </div>
                      <div className="text-sm mb-1">Activity: <span className="text-gray-600">{entry.activity}</span></div>
                      {entry.notes && (
                        <div className="text-xs text-gray-500 italic">{entry.notes}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Emotional Overview</CardTitle>
              <CardDescription>Summary of your emotional patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Emotion Distribution</h3>
                  <div className="space-y-2">
                    {toneData.map(item => (
                      <div key={item.tone} className="flex items-center">
                        <span className="w-20 text-sm">{item.tone}</span>
                        <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${item.color}`} 
                            style={{ width: `${(item.count / entries.length) * 100}%` }}
                          />
                        </div>
                        <span className="w-12 text-right text-sm">{Math.round((item.count / entries.length) * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Activity Impact</h3>
                  <div className="space-y-2 text-sm">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="font-medium">Positive influences</p>
                      <ul className="mt-1 list-disc pl-5 text-gray-600">
                        {entries.some(e => e.activity.includes("Team") && (e.tone === "Happy" || e.tone === "Excited")) && (
                          <li>Team collaboration</li>
                        )}
                        {entries.some(e => e.activity.includes("Exercise") && (e.tone === "Happy" || e.tone === "Excited")) && (
                          <li>Exercise</li>
                        )}
                        {entries.some(e => e.activity.includes("Relaxing") && (e.tone === "Content" || e.tone === "Happy")) && (
                          <li>Relaxation time</li>
                        )}
                        {!entries.some(e => 
                          (e.activity.includes("Team") || e.activity.includes("Exercise") || e.activity.includes("Relaxing")) 
                          && ["Happy", "Excited", "Content"].includes(e.tone)
                        ) && (
                          <li>Log more entries to identify positive influences</li>
                        )}
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-red-50 rounded-lg">
                      <p className="font-medium">Stressors</p>
                      <ul className="mt-1 list-disc pl-5 text-gray-600">
                        {entries.some(e => e.activity.includes("Meeting") && (e.tone === "Stressed" || e.tone === "Anxious")) && (
                          <li>Meetings</li>
                        )}
                        {entries.some(e => e.activity.includes("Deadline") && (e.tone === "Stressed" || e.tone === "Anxious")) && (
                          <li>Deadlines</li>
                        )}
                        {!entries.some(e => 
                          (e.activity.includes("Meeting") || e.activity.includes("Deadline")) 
                          && ["Stressed", "Anxious", "Angry"].includes(e.tone)
                        ) && (
                          <li>Log more entries to identify stressors</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium mb-2">Pattern Summary</h3>
                <p className="text-sm text-gray-700">
                  Based on your {entries.length} entries, you tend to feel most 
                  {toneData.length > 0 ? ` ${toneData.sort((a, b) => b.count - a.count)[0]?.tone.toLowerCase()}` : " positive"} 
                  {entries.some(e => e.activity.includes("Team") && (e.tone === "Happy" || e.tone === "Excited")) ? 
                    " during team activities" : entries.some(e => e.tone === "Stressed" || e.tone === "Anxious") ? 
                    " and occasionally experience stress" : ""}.
                  {entries.length < 5 ? " Add more entries for a more detailed analysis." : ""}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmotionPatternRecognition;