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