"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { Trophy, Moon, Battery, Activity, Brain, Calendar, Sun, Cloud, CloudRain, Settings, Download, Share2, Filter } from 'lucide-react';

const moodData = [
  { date: 'Mon', mood: 8, sleep: 7, energy: 6, anxiety: 3, focus: 7, socialInteraction: 6 },
  { date: 'Tue', mood: 6, sleep: 6, energy: 5, anxiety: 5, focus: 5, socialInteraction: 4 },
  { date: 'Wed', mood: 7, sleep: 8, energy: 7, anxiety: 4, focus: 6, socialInteraction: 7 },
  { date: 'Thu', mood: 9, sleep: 7, energy: 8, anxiety: 2, focus: 8, socialInteraction: 8 },
  { date: 'Fri', mood: 8, sleep: 6, energy: 7, anxiety: 3, focus: 7, socialInteraction: 7 },
  { date: 'Sat', mood: 7, sleep: 9, energy: 8, anxiety: 4, focus: 6, socialInteraction: 8 },
  { date: 'Sun', mood: 8, sleep: 8, energy: 7, anxiety: 3, focus: 7, socialInteraction: 6 },
];

const activityData = [
  { name: 'Journaling', value: 35, trend: '+5%' },
  { name: 'Meditation', value: 25, trend: '+2%' },
  { name: 'Exercise', value: 20, trend: '+8%' },
  { name: 'Group Chat', value: 20, trend: '-3%' },
];

const radarData = [
  { metric: 'Mood', value: 8 },
  { metric: 'Sleep', value: 7 },
  { metric: 'Energy', value: 7 },
  { metric: 'Focus', value: 6 },
  { metric: 'Social', value: 8 },
  { metric: 'Anxiety', value: 4 },
];

const THEME_COLORS = {
  calm: {
    primary: ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'],
    background: 'bg-blue-50',
    text: 'text-blue-900'
  },
  energetic: {
    primary: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
    background: 'bg-orange-50',
    text: 'text-orange-900'
  },
  focused: {
    primary: ['#6C5B7B', '#C06C84', '#F67280', '#F8B195'],
    background: 'bg-purple-50',
    text: 'text-purple-900'
  }
};

export const MentalHealthDashboardAnalystics = () => {
  const [timeframe, setTimeframe] = useState('daily');
  const [theme, setTheme] = useState('calm');
  const [selectedMetrics, setSelectedMetrics] = useState(['mood', 'sleep', 'energy']);
  const [showDetailedView, setShowDetailedView] = useState(false);

  const milestones = [
    { title: '10 Day Streak', icon: <Trophy className="h-4 w-4" />, description: 'Completed daily check-ins', progress: 80 },
    { title: 'Sleep Master', icon: <Moon className="h-4 w-4" />, description: '7+ hours sleep for a week', progress: 60 },
    { title: 'Energy Champion', icon: <Battery className="h-4 w-4" />, description: 'High energy for 5 days', progress: 90 },
  ];

  const recommendations = [
    { title: 'Try Meditation', description: 'Your stress levels seem elevated', icon: <Brain className="h-4 w-4" />, priority: 'high' },
    { title: 'Time for Exercise', description: 'Boost your mood with activity', icon: <Activity className="h-4 w-4" />, priority: 'medium' },
    { title: 'Journal Today', description: 'Express your thoughts', icon: <Calendar className="h-4 w-4" />, priority: 'low' },
  ];

  const getWeatherIcon = (mood) => {
    if (mood >= 8) return <Sun className="h-6 w-6 text-yellow-500" />;
    if (mood >= 6) return <Cloud className="h-6 w-6 text-blue-500" />;
    return <CloudRain className="h-6 w-6 text-gray-500" />;
  };

  return (
    <div className={`w-full max-w-6xl mx-auto p-4 space-y-4 ${THEME_COLORS[theme].background}`}>
      {/* Header Section with Enhanced Controls */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className={`text-2xl font-bold ${THEME_COLORS[theme].text}`}>Mental Health Analytics</h1>
          {getWeatherIcon(moodData[moodData.length - 1].mood)}
        </div>
        
        <div className="flex space-x-4">
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="calm">Calm Theme</SelectItem>
              <SelectItem value="energetic">Energetic Theme</SelectItem>
              <SelectItem value="focused">Focused Theme</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Time Controls */}
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="daily" onClick={() => setTimeframe('daily')}>Daily</TabsTrigger>
          <TabsTrigger value="weekly" onClick={() => setTimeframe('weekly')}>Weekly</TabsTrigger>
          <TabsTrigger value="monthly" onClick={() => setTimeframe('monthly')}>Monthly</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Enhanced Mood Trends */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Comprehensive Health Metrics</CardTitle>
            <CardDescription>Track your mood, sleep, energy, and more</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {selectedMetrics.map((metric, index) => (
                  <Area
                    key={metric}
                    type="monotone"
                    dataKey={metric}
                    stackId="1"
                    stroke={THEME_COLORS[theme].primary[index]}
                    fill={THEME_COLORS[theme].primary[index]}
                    fillOpacity={0.3}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Radar Chart for Multiple Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Wellness Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis />
                <Radar
                  name="Current"
                  dataKey="value"
                  stroke={THEME_COLORS[theme].primary[0]}
                  fill={THEME_COLORS[theme].primary[0]}
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Interactive Activity Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill={THEME_COLORS[theme].primary[1]}>
                  {activityData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={THEME_COLORS[theme].primary[index % THEME_COLORS[theme].primary.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Enhanced Milestones with Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Achievement Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="p-4 border rounded-lg hover:shadow-lg transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 rounded-full p-2">
                      {milestone.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{milestone.title}</h3>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div 
                          className="h-2.5 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${milestone.progress}%`,
                            backgroundColor: THEME_COLORS[theme].primary[0]
                          }}
                        />
                      </div>
                    </div>
                    <Badge>{milestone.progress}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Smart Recommendations */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Personalized Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.map((rec, index) => (
                <div 
                  key={index} 
                  className="p-4 border rounded-lg hover:shadow-lg transition-all cursor-pointer"
                  style={{ borderLeft: `4px solid ${THEME_COLORS[theme].primary[index]}` }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="bg-primary/10 rounded-full p-2">
                      {rec.icon}
                    </div>
                    <h3 className="font-medium">{rec.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                  <Badge 
                    className="mt-2"
                    style={{ backgroundColor: THEME_COLORS[theme].primary[index] }}
                  >
                    {rec.priority} priority
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
