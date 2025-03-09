// import React from "react";
// import { Meteors } from "../ui/meteors";
// import { FaHeart, FaComment, FaShare, FaBookmark } from "react-icons/fa";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { BsThreeDots } from "react-icons/bs";
// import { RiMentalHealthFill } from "react-icons/ri";
// import { formatDistanceToNow } from 'date-fns';

// export function MeteorsDemo() {
//   const postDate = new Date('2024-03-18T10:30:00');
//   const timeAgo = formatDistanceToNow(postDate, { addSuffix: true });

//   return (
//     <div className="w-full flex items-center pl-5 pr-10 py-5">
//       <div className="w-full relative">
//         <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-purple-100 to-blue-100 transform scale-[0.80] rounded-full blur-3xl" />
//         <div className="relative shadow-xl bg-gray-900 border border-gray-800 px-8 py-6 h-full overflow-hidden rounded-2xl flex flex-col">
//           {/* Header Section */}
//           <div className="flex justify-between items-center mb-4 relative z-50">
//             <div className="flex items-center gap-3">
//               <Avatar className="h-10 w-10">
//                 <AvatarImage src="https://github.com/shadcn.png" />
//                 <AvatarFallback>CN</AvatarFallback>
//               </Avatar>
//               <div>
//                 <h3 className="text-white font-semibold">Sarah Johnson</h3>
//                 <div className="flex items-center gap-2">
//                   <span className="text-gray-400 text-sm">@mindfuljourney</span>
//                   <span className="text-gray-500 text-sm">•</span>
//                   <span className="text-gray-400 text-sm">{timeAgo}</span>
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <RiMentalHealthFill className="text-purple-400 h-5 w-5" />
//               <BsThreeDots className="text-gray-400 h-5 w-5 cursor-pointer" />
//             </div>
//           </div>

//           {/* Content Section */}
//           <div className="mb-6 relative z-50">
//             <h1 className="font-bold text-xl text-white mb-4">
//               Finding Peace in the Chaos: My Mental Health Journey
//             </h1>
//             <p className="font-normal text-base text-gray-300 leading-relaxed">
//               Today marks a significant milestone in my mental health journey. I've learned that it's okay not to be okay, and seeking help is a sign of strength, not weakness. Through therapy, mindfulness, and self-care practices, I'm discovering new ways to cope with anxiety and stress. Remember, your mental health matters, and you're never alone in this journey. 🌱✨
//             </p>
//           </div>

//           {/* Footer Section */}
//           <div className="flex justify-between items-center relative z-50">
//             <div className="flex gap-6">
//               <button className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors">
//                 <FaHeart className="h-5 w-5" />
//                 <span className="text-sm">2.4K</span>
//               </button>
//               <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
//                 <FaComment className="h-5 w-5" />
//                 <span className="text-sm">156</span>
//               </button>
//               <button className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors">
//                 <FaShare className="h-5 w-5" />
//                 <span className="text-sm">Share</span>
//               </button>
//             </div>
//             <button className="text-yellow-400 hover:text-yellow-300 transition-colors">
//               <FaBookmark className="h-5 w-5" />
//             </button>
//           </div>

//           <Meteors number={20} />
//         </div>
//       </div>
//     </div>
//   );
// }

// components/DashboardHomeFeed.tsx
"use client"
import React, { useState } from 'react';
import { Calendar, Clock, Users, MessageCircle, Brain, Heart, Zap, Activity, Compass } from 'lucide-react';

interface DialogueSession {
  id: string;
  title: string;
  topic: string;
  participants: number;
  maxParticipants: number;
  facilitator: string;
  time: string;
  date: string;
}

interface EmotionLog {
  date: string;
  emotion: string;
  intensity: number;
}

interface ReflectionPrompt {
  id: string;
  question: string;
  category: string;
}

const DashboardHomeFeed: React.FC = () => {
  const [currentEmotion, setCurrentEmotion] = useState<string>('');
  const [emotionIntensity, setEmotionIntensity] = useState<number>(5);
  const [emotionLogs, setEmotionLogs] = useState<EmotionLog[]>([
    { date: '2025-03-05', emotion: 'Calm', intensity: 7 },
    { date: '2025-03-04', emotion: 'Anxious', intensity: 6 },
    { date: '2025-03-03', emotion: 'Joyful', intensity: 9 },
    { date: '2025-03-02', emotion: 'Frustrated', intensity: 4 },
    { date: '2025-03-01', emotion: 'Hopeful', intensity: 8 },
  ]);

  const upcomingDialogues: DialogueSession[] = [
    {
      id: '1',
      title: 'Navigating Work Uncertainty',
      topic: 'Stress Management',
      participants: 5,
      maxParticipants: 8,
      facilitator: 'Dr. Maya Chen',
      time: '2:00 PM',
      date: 'Today'
    },
    {
      id: '2',
      title: 'Building Deeper Connections',
      topic: 'Relationships',
      participants: 3,
      maxParticipants: 6,
      facilitator: 'Sam Johnson',
      time: '6:30 PM',
      date: 'Tomorrow'
    }
  ];

  const dailyPrompt: ReflectionPrompt = {
    id: 'prompt-1',
    question: 'What moment today made you feel most connected to yourself or others?',
    category: 'Connection'
  };

  const emotionOptions = [
    'Joyful', 'Grateful', 'Calm', 'Hopeful', 'Proud',
    'Anxious', 'Frustrated', 'Sad', 'Overwhelmed', 'Uncertain'
  ];

  const logEmotion = () => {
    if (currentEmotion) {
      const newLog = {
        date: new Date().toISOString().split('T')[0],
        emotion: currentEmotion,
        intensity: emotionIntensity
      };
      setEmotionLogs([newLog, ...emotionLogs]);
      setCurrentEmotion('');
      setEmotionIntensity(5);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Alex</h1>
        <p className="text-slate-600 mb-8">Your personal space for emotional growth and meaningful conversations</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Daily Wellness Pulse Card */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Heart className="text-rose-500 mr-2" />
                <h2 className="text-xl font-semibold">Daily Wellness Pulse</h2>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">How are you feeling right now?</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-4">
                  {emotionOptions.map(emotion => (
                    <button 
                      key={emotion}
                      onClick={() => setCurrentEmotion(emotion)}
                      className={`py-2 px-3 rounded-md text-sm transition-colors ${
                        currentEmotion === emotion 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      {emotion}
                    </button>
                  ))}
                </div>
                
                {currentEmotion && (
                  <>
                    <label className="block text-sm font-medium mb-2">
                      Intensity: {emotionIntensity}
                    </label>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={emotionIntensity}
                      onChange={(e) => setEmotionIntensity(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <button 
                      onClick={logEmotion}
                      className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Log Emotion
                    </button>
                  </>
                )}
              </div>

              <div>
                <h3 className="font-medium text-sm mb-2 text-slate-600">Recent Emotions</h3>
                <div className="space-y-3">
                  {emotionLogs.slice(0, 3).map((log, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-slate-100">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          log.intensity > 7 ? 'bg-emerald-500' : 
                          log.intensity > 4 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}></div>
                        <span>{log.emotion}</span>
                      </div>
                      <span className="text-sm text-slate-500">{log.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Dialogue Spaces Card */}
          <div className="col-span-1 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <MessageCircle className="text-indigo-500 mr-2" />
                <h2 className="text-xl font-semibold">Dialogue Spaces</h2>
              </div>
              
              <div className="space-y-4">
                {upcomingDialogues.map(dialogue => (
                  <div key={dialogue.id} className="bg-slate-50 rounded-lg p-4">
                    <h3 className="font-medium text-indigo-700">{dialogue.title}</h3>
                    <div className="text-sm text-slate-600 mt-1">{dialogue.topic}</div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center text-xs text-slate-500">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{dialogue.participants}/{dialogue.maxParticipants}</span>
                      </div>
                      <div className="flex items-center text-xs text-slate-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{dialogue.time}, {dialogue.date}</span>
                      </div>
                    </div>
                    <button className="w-full mt-3 bg-indigo-100 text-indigo-700 py-1.5 px-3 rounded-md text-sm hover:bg-indigo-200 transition-colors">
                      Join Conversation
                    </button>
                  </div>
                ))}
                <button className="w-full mt-2 border border-dashed border-indigo-300 text-indigo-600 py-2 px-4 rounded-md text-sm hover:bg-indigo-50 transition-colors flex items-center justify-center">
                  <span className="mr-1">+</span> Browse More Dialogues
                </button>
              </div>
            </div>
          </div>

          {/* Reflection & Growth Card */}
          <div className="col-span-1 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Brain className="text-violet-500 mr-2" />
                <h2 className="text-xl font-semibold">Reflection & Growth</h2>
              </div>
              
              <div className="bg-violet-50 rounded-lg p-4 mb-4">
                <div className="text-xs font-medium text-violet-600 mb-1">DAILY REFLECTION PROMPT</div>
                <p className="text-sm font-medium text-slate-700">{dailyPrompt.question}</p>
                <textarea 
                  className="w-full mt-3 p-3 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 h-24 resize-none"
                  placeholder="Write your thoughts here..."
                ></textarea>
                <button className="mt-2 bg-violet-600 text-white py-1.5 px-4 rounded-md text-sm hover:bg-violet-700 transition-colors">
                  Save Reflection
                </button>
              </div>
              
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center mb-2">
                  <Zap className="text-amber-500 w-4 h-4 mr-2" />
                  <h3 className="font-medium text-sm">Growth Insight</h3>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg">
                  <p className="text-sm text-slate-700">
                    When feeling overwhelmed, practice the "5-4-3-2-1" grounding technique: Name 5 things you see, 4 things you feel, 3 things you hear, 2 things you smell, and 1 thing you taste.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mindfulness Minute Card */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Compass className="text-emerald-500 mr-2" />
                <h2 className="text-xl font-semibold">Mindfulness & Connection</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center mb-3">
                    <Activity className="text-emerald-500 w-4 h-4 mr-2" />
                    <h3 className="font-medium text-sm">Mindfulness Minute</h3>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-4 h-48 flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,#34d399_0%,transparent_70%)]"></div>
                    <p className="text-emerald-700 font-medium mb-3">Box Breathing Exercise</p>
                    <p className="text-sm text-slate-600 mb-4">A simple 4-second pattern to calm your nervous system</p>
                    <button className="bg-emerald-600 text-white py-2 px-6 rounded-full text-sm hover:bg-emerald-700 transition-colors flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Start 60-Second Practice
                    </button>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center mb-3">
                    <Users className="text-blue-500 w-4 h-4 mr-2" />
                    <h3 className="font-medium text-sm">Connection Capsule</h3>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 h-48">
                    <p className="text-blue-700 font-medium mb-2">Your Support Network</p>
                    <p className="text-sm text-slate-600 mb-3">Based on your recent emotions, consider reaching out to:</p>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center bg-white p-2 rounded-md">
                        <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 mr-3">JM</div>
                        <div>
                          <div className="text-sm font-medium">Jamie Miller</div>
                          <div className="text-xs text-slate-500">For practical advice</div>
                        </div>
                      </div>
                      <div className="flex items-center bg-white p-2 rounded-md">
                        <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-600 mr-3">SK</div>
                        <div>
                          <div className="text-sm font-medium">Sam Kumar</div>
                          <div className="text-xs text-slate-500">For emotional support</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Explore Insights Card */}
          <div className="col-span-1 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <MessageCircle className="text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold">Dialogue Insights</h2>
              </div>
              
              <div>
                <h3 className="font-medium text-sm mb-3 text-slate-600">Recently Shared Wisdom</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-xs text-blue-600 mb-1">FROM "NAVIGATING UNCERTAINTY"</div>
                    <p className="text-sm">
                      "Uncertainty becomes less frightening when we acknowledge it together rather than fighting it alone."
                    </p>
                  </div>
                  <div className="bg-violet-50 p-3 rounded-lg">
                    <div className="text-xs text-violet-600 mb-1">FROM "BOUNDARIES & SELF-CARE"</div>
                    <p className="text-sm">
                      "Setting boundaries isn't about limiting connection, but creating the space where authentic connection can happen."
                    </p>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-lg">
                    <div className="text-xs text-amber-600 mb-1">FROM "EMOTIONAL AWARENESS"</div>
                    <p className="text-sm">
                      "Naming an emotion is the first step to understanding its message and purpose in your life."
                    </p>
                  </div>
                </div>
                <button className="w-full mt-4 border border-blue-300 text-blue-600 py-2 px-4 rounded-md text-sm hover:bg-blue-50 transition-colors">
                  View All Insights
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHomeFeed;