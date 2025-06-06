// "use client";
// import React, { useState } from 'react';
// import { Calendar, Clock, Users, MessageCircle, Brain, Heart, Zap, Activity, Compass } from 'lucide-react';
// import DialogueJoinModal from './DialogueJoinModal';

// interface DialogueSession {
//   id: string;
//   title: string;
//   topic: string;
//   participants: number;
//   maxParticipants: number;
//   facilitator: string;
//   time: string;
//   date: string;
// }

// interface EmotionLog {
//   date: string;
//   emotion: string;
//   intensity: number;
// }

// interface ReflectionPrompt {
//   id: string;
//   question: string;
//   category: string;
// }

// const DashboardHomeFeed: React.FC = () => {
//   const [currentEmotion, setCurrentEmotion] = useState<string>('');
//   const [emotionIntensity, setEmotionIntensity] = useState<number>(5);
//   const [emotionLogs, setEmotionLogs] = useState<EmotionLog[]>([
//     { date: '2025-03-05', emotion: 'Calm', intensity: 7 },
//     { date: '2025-03-04', emotion: 'Anxious', intensity: 6 },
//     { date: '2025-03-03', emotion: 'Joyful', intensity: 9 },
//     { date: '2025-03-02', emotion: 'Frustrated', intensity: 4 },
//     { date: '2025-03-01', emotion: 'Hopeful', intensity: 8 },
//   ]);
  
//   const [isJoinModalOpen, setIsJoinModalOpen] = useState<boolean>(false);
//   const [selectedDialogue, setSelectedDialogue] = useState<DialogueSession | null>(null);
//   const [joinedDialogues, setJoinedDialogues] = useState<string[]>([]);
//   const [joinSuccess, setJoinSuccess] = useState<boolean>(false);

//   const upcomingDialogues: DialogueSession[] = [
//     {
//       id: '1',
//       title: 'Navigating Work Uncertainty',
//       topic: 'Stress Management',
//       participants: 5,
//       maxParticipants: 8,
//       facilitator: 'Dr. Maya Chen',
//       time: '2:00 PM',
//       date: 'Today'
//     },
//     {
//       id: '2',
//       title: 'Building Deeper Connections',
//       topic: 'Relationships',
//       participants: 3,
//       maxParticipants: 6,
//       facilitator: 'Sam Johnson',
//       time: '6:30 PM',
//       date: 'Tomorrow'
//     }
//   ];

//   const dailyPrompt: ReflectionPrompt = {
//     id: 'prompt-1',
//     question: 'What moment today made you feel most connected to yourself or others?',
//     category: 'Connection'
//   };

//   const emotionOptions = [
//     'Joyful', 'Grateful', 'Calm', 'Hopeful', 'Proud',
//     'Anxious', 'Frustrated', 'Sad', 'Overwhelmed', 'Uncertain'
//   ];

//   const handleJoinDialogue = (dialogue: DialogueSession) => {
//     setSelectedDialogue(dialogue);
//     setIsJoinModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsJoinModalOpen(false);
//     setJoinSuccess(false);
    
//     setTimeout(() => {
//       setSelectedDialogue(null);
//     }, 300);
//   };

//   const handleDialogueJoin = (intention: string) => {
//     if (selectedDialogue) {
//       setJoinedDialogues(prev => [...prev, selectedDialogue.id]);
//       setJoinSuccess(true);
      
//       setTimeout(() => {
//         handleCloseModal();
//       }, 3000);
//     }
//   };

//   const logEmotion = () => {
//     if (currentEmotion) {
//       const newLog = {
//         date: new Date().toISOString().split('T')[0],
//         emotion: currentEmotion,
//         intensity: emotionIntensity
//       };
//       setEmotionLogs([newLog, ...emotionLogs]);
//       setCurrentEmotion('');
//       setEmotionIntensity(5);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800">
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-3xl font-bold mb-2">Welcome back, Alex</h1>
//         <p className="text-slate-600 mb-8">Your personal space for emotional growth and meaningful conversations</p>
        
//         {joinSuccess && (
//           <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4 animate-fadeIn">
//             <div className="flex items-center">
//               <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
//                 <Users className="w-4 h-4 text-emerald-600" />
//               </div>
//               <div>
//                 <h3 className="font-medium text-emerald-700">You've joined the dialogue!</h3>
//                 <p className="text-sm text-slate-600">
//                   You'll receive a reminder 15 minutes before "{selectedDialogue?.title}" begins.
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {/* Daily Wellness Pulse Card */}
//           <div className="col-span-1 md:col-span-2 lg:col-span-1 bg-white rounded-xl shadow-md overflow-hidden">
//             <div className="p-6">
//               <div className="flex items-center mb-4">
//                 <Heart className="text-rose-500 mr-2" />
//                 <h2 className="text-xl font-semibold">Daily Wellness Pulse</h2>
//               </div>
              
//               <div className="mb-6">
//                 <label className="block text-sm font-medium mb-2">How are you feeling right now?</label>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-4">
//                   {emotionOptions.map(emotion => (
//                     <button 
//                       key={emotion}
//                       onClick={() => setCurrentEmotion(emotion)}
//                       className={`py-2 px-3 rounded-md text-sm transition-colors ${
//                         currentEmotion === emotion 
//                           ? 'bg-indigo-600 text-white' 
//                           : 'bg-slate-100 hover:bg-slate-200'
//                       }`}
//                     >
//                       {emotion}
//                     </button>
//                   ))}
//                 </div>
                
//                 {currentEmotion && (
//                   <>
//                     <label className="block text-sm font-medium mb-2">
//                       Intensity: {emotionIntensity}
//                     </label>
//                     <input 
//                       type="range" 
//                       min="1" 
//                       max="10" 
//                       value={emotionIntensity}
//                       onChange={(e) => setEmotionIntensity(parseInt(e.target.value))}
//                       className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
//                     />
//                     <button 
//                       onClick={logEmotion}
//                       className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
//                     >
//                       Log Emotion
//                     </button>
//                   </>
//                 )}
//               </div>

//               <div>
//                 <h3 className="font-medium text-sm mb-2 text-slate-600">Recent Emotions</h3>
//                 <div className="space-y-3">
//                   {emotionLogs.slice(0, 3).map((log, index) => (
//                     <div key={index} className="flex items-center justify-between py-2 border-b border-slate-100">
//                       <div className="flex items-center">
//                         <div className={`w-3 h-3 rounded-full mr-3 ${
//                           log.intensity > 7 ? 'bg-emerald-500' : 
//                           log.intensity > 4 ? 'bg-amber-500' : 'bg-rose-500'
//                         }`}></div>
//                         <span>{log.emotion}</span>
//                       </div>
//                       <span className="text-sm text-slate-500">{log.date}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Dialogue Spaces Card */}
//           <div className="col-span-1 bg-white rounded-xl shadow-md overflow-hidden">
//             <div className="p-6">
//               <div className="flex items-center mb-4">
//                 <MessageCircle className="text-indigo-500 mr-2" />
//                 <h2 className="text-xl font-semibold">Dialogue Spaces</h2>
//               </div>
              
//               <div className="space-y-4">
//                 {upcomingDialogues.map(dialogue => {
//                   const isJoined = joinedDialogues.includes(dialogue.id);
                  
//                   return (
//                     <div key={dialogue.id} className="bg-slate-50 rounded-lg p-4">
//                       <h3 className="font-medium text-indigo-700">{dialogue.title}</h3>
//                       <div className="text-sm text-slate-600 mt-1">{dialogue.topic}</div>
//                       <div className="flex justify-between items-center mt-3">
//                         <div className="flex items-center text-xs text-slate-500">
//                           <Users className="w-4 h-4 mr-1" />
//                           <span>{dialogue.participants}/{dialogue.maxParticipants}</span>
//                         </div>
//                         <div className="flex items-center text-xs text-slate-500">
//                           <Clock className="w-4 h-4 mr-1" />
//                           <span>{dialogue.time}, {dialogue.date}</span>
//                         </div>
//                       </div>
//                       {isJoined ? (
//                         <div className="flex items-center mt-3 text-emerald-600 text-sm">
//                           <div className="w-4 h-4 bg-emerald-100 rounded-full flex items-center justify-center mr-2">
//                             <Users className="w-3 h-3 text-emerald-600" />
//                           </div>
//                           <span>You're joining this dialogue</span>
//                         </div>
//                       ) : (
//                         <button 
//                           onClick={() => handleJoinDialogue(dialogue)}
//                           className="w-full mt-3 bg-indigo-100 text-indigo-700 py-1.5 px-3 rounded-md text-sm hover:bg-indigo-200 transition-colors"
//                         >
//                           Join Conversation
//                         </button>
//                       )}
//                     </div>
//                   );
//                 })}
//                 <button className="w-full mt-2 border border-dashed border-indigo-300 text-indigo-600 py-2 px-4 rounded-md text-sm hover:bg-indigo-50 transition-colors flex items-center justify-center">
//                   <span className="mr-1">+</span> Browse More Dialogues
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Reflection & Growth Card */}
//           <div className="col-span-1 bg-white rounded-xl shadow-md overflow-hidden">
//             <div className="p-6">
//               <div className="flex items-center mb-4">
//                 <Brain className="text-violet-500 mr-2" />
//                 <h2 className="text-xl font-semibold">Reflection & Growth</h2>
//               </div>
              
//               <div className="bg-violet-50 rounded-lg p-4 mb-4">
//                 <div className="text-xs font-medium text-violet-600 mb-1">DAILY REFLECTION PROMPT</div>
//                 <p className="text-sm font-medium text-slate-700">{dailyPrompt.question}</p>
//                 <textarea 
//                   className="w-full mt-3 p-3 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 h-24 resize-none"
//                   placeholder="Write your thoughts here..."
//                 ></textarea>
//                 <button className="mt-2 bg-violet-600 text-white py-1.5 px-4 rounded-md text-sm hover:bg-violet-700 transition-colors">
//                   Save Reflection
//                 </button>
//               </div>
              
//               <div className="border-t border-slate-100 pt-4">
//                 <div className="flex items-center mb-2">
//                   <Zap className="text-amber-500 w-4 h-4 mr-2" />
//                   <h3 className="font-medium text-sm">Growth Insight</h3>
//                 </div>
//                 <div className="bg-amber-50 p-3 rounded-lg">
//                   <p className="text-sm text-slate-700">
//                     When feeling overwhelmed, practice the "5-4-3-2-1" grounding technique: Name 5 things you see, 4 things you feel, 3 things you hear, 2 things you smell, and 1 thing you taste.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Rest of dashboard components */}
//           <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
//             <div className="p-6">
//               <div className="flex items-center mb-4">
//                 <Compass className="text-emerald-500 mr-2" />
//                 <h2 className="text-xl font-semibold">Mindfulness & Connection</h2>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <div className="flex items-center mb-3">
//                     <Activity className="text-emerald-500 w-4 h-4 mr-2" />
//                     <h3 className="font-medium text-sm">Mindfulness Minute</h3>
//                   </div>
//                   <div className="bg-emerald-50 rounded-lg p-4 h-48 flex flex-col items-center justify-center text-center relative overflow-hidden">
//                     <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,#34d399_0%,transparent_70%)]"></div>
//                     <p className="text-emerald-700 font-medium mb-3">Box Breathing Exercise</p>
//                     <p className="text-sm text-slate-600 mb-4">A simple 4-second pattern to calm your nervous system</p>
//                     <button className="bg-emerald-600 text-white py-2 px-6 rounded-full text-sm hover:bg-emerald-700 transition-colors flex items-center">
//                       <Clock className="w-4 h-4 mr-2" />
//                       Start 60-Second Practice
//                     </button>
//                   </div>
//                 </div>
                
//                 <div>
//                   <div className="flex items-center mb-3">
//                     <Users className="text-blue-500 w-4 h-4 mr-2" />
//                     <h3 className="font-medium text-sm">Connection Capsule</h3>
//                   </div>
//                   <div className="bg-blue-50 rounded-lg p-4 h-48">
//                     <p className="text-blue-700 font-medium mb-2">Your Support Network</p>
//                     <p className="text-sm text-slate-600 mb-3">Based on your recent emotions, consider reaching out to:</p>
                    
//                     <div className="space-y-2 mb-3">
//                       <div className="flex items-center bg-white p-2 rounded-md">
//                         <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 mr-3">JM</div>
//                         <div>
//                           <div className="text-sm font-medium">Jamie Miller</div>
//                           <div className="text-xs text-slate-500">For practical advice</div>
//                         </div>
//                       </div>
//                       <div className="flex items-center bg-white p-2 rounded-md">
//                         <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-600 mr-3">SK</div>
//                         <div>
//                           <div className="text-sm font-medium">Sam Kumar</div>
//                           <div className="text-xs text-slate-500">For emotional support</div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="col-span-1 bg-white rounded-xl shadow-md overflow-hidden">
//             <div className="p-6">
//               <div className="flex items-center mb-4">
//                 <MessageCircle className="text-blue-500 mr-2" />
//                 <h2 className="text-xl font-semibold">Dialogue Insights</h2>
//               </div>
              
//               <div>
//                 <h3 className="font-medium text-sm mb-3 text-slate-600">Recently Shared Wisdom</h3>
//                 <div className="space-y-4">
//                   <div className="bg-blue-50 p-3 rounded-lg">
//                     <div className="text-xs text-blue-600 mb-1">FROM "NAVIGATING UNCERTAINTY"</div>
//                     <p className="text-sm">
//                       "Uncertainty becomes less frightening when we acknowledge it together rather than fighting it alone."
//                     </p>
//                   </div>
//                   <div className="bg-violet-50 p-3 rounded-lg">
//                     <div className="text-xs text-violet-600 mb-1">FROM "BOUNDARIES & SELF-CARE"</div>
//                     <p className="text-sm">
//                       "Setting boundaries isn't about limiting connection, but creating the space where authentic connection can happen."
//                     </p>
//                   </div>
//                   <div className="bg-amber-50 p-3 rounded-lg">
//                     <div className="text-xs text-amber-600 mb-1">FROM "EMOTIONAL AWARENESS"</div>
//                     <p className="text-sm">
//                       "Naming an emotion is the first step to understanding its message and purpose in your life."
//                     </p>
//                   </div>
//                 </div>
//                 <button className="w-full mt-4 border border-blue-300 text-blue-600 py-2 px-4 rounded-md text-sm hover:bg-blue-50 transition-colors">
//                   View All Insights
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Join Dialogue Modal */}
//       {selectedDialogue && (
//         <DialogueJoinModal 
//           dialogue={selectedDialogue}
//           isOpen={isJoinModalOpen}
//           onClose={handleCloseModal}
//           onJoin={handleDialogueJoin}
//         />
//       )}
      
//       {/* Add global styles for animations */}
//       <style jsx global>{`
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(-10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-out forwards;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default DashboardHomeFeed;












"use client";
import React, { useState } from 'react';
import {
  MoreHorizontal,
  Shield
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Zap } from 'lucide-react';
import { Brain } from 'lucide-react';

const EmoHubDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState('March 2020');
  const dailyPrompt = {
    id: 'prompt-1',
    question: 'What moment today made you feel most connected to yourself or others?',
    category: 'Connection'
  };
  const progressData = [
    { day: 1, progress: 15 },
    { day: 5, progress: 25 },
    { day: 10, progress: 20 },
    { day: 15, progress: 50 },
    { day: 20, progress: 75 },
    { day: 25, progress: 85 },
    { day: 30, progress: 70 }
  ];

  const participationData = [
    { name: 'Posts', value: 40, color: '#10B981' },
    { name: 'Comments', value: 32, color: '#F59E0B' },
    { name: 'Likes', value: 28, color: '#8B5CF6' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        {/* Dashboard Content */}
        <div className="p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome <span className="text-orange-500">Alex</span>!
            </h1>
            <p className="text-gray-600">
              Your personal space for emotional growth and meaningful conversations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* EI Challenges Progress */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">EI Challenges progress</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Previous period</span>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="text-sm border border-gray-200 rounded px-2 py-1"
                  >
                    <option>March 2020</option>
                    <option>April 2020</option>
                    <option>May 2020</option>
                  </select>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-right mb-2">
                  <span className="text-sm text-gray-500">Challenges completed</span>
                  <div className="text-3xl font-bold text-gray-900">44</div>
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={progressData}>
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                        <stop offset="50%" stopColor="#EC4899" stopOpacity={0.4}/>
                        <stop offset="100%" stopColor="#F3E8FF" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#9CA3AF' }}
                      domain={['dataMin', 'dataMax']}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#9CA3AF' }}
                      tickFormatter={(value) => `${value}%`}
                      domain={[0, 100]}
                    />
                    <Area
                      type="monotone"
                      dataKey="progress"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      fill="url(#colorGradient)"
                      dot={{ fill: '#8B5CF6', r: 4, strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, fill: '#8B5CF6', strokeWidth: 2, stroke: '#fff' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">To Day's Updates</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700">Subscribe</button>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Today 11:36</span>
                    <Shield size={16} className="text-purple-500" />
                  </div>
                  <p className="text-sm text-gray-700 mb-1">Your Mood: You are feeling excited for the day</p>
                  <p className="text-xs text-gray-500">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">self-awareness</span>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Yesterday</span>
                    <Shield size={16} className="text-blue-500" />
                  </div>
                  <p className="text-sm text-gray-700 mb-1">Your Mood: You are feeling excited for the day</p>
                  <p className="text-xs text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Self-awareness</span>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Today 11:36</span>
                    <Shield size={16} className="text-blue-500" />
                  </div>
                  <p className="text-xs text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Group participation</h2>
              <select className="text-sm border border-gray-200 rounded px-2 py-1">
                <option>March 2020</option>
              </select>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={participationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {participationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex-1">
                <div className="grid grid-cols-3 gap-6">
                  {participationData.map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">{item.value}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
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
      </div>
    </div>
  );
};

export default EmoHubDashboard;