"use client"
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { PlusCircle, Calendar as CalendarIcon, BarChart, CheckCircle, Edit, Trash2 } from 'lucide-react';

const DailyMoodPlanner = () => {
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Morning meditation', completed: false },
    { id: 2, title: 'Work on project', completed: true },
    { id: 3, title: 'Evening walk', completed: false },
  ]);
  const [newTask, setNewTask] = useState('');
  const [mood, setMood] = useState(7);
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState('plan');

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const addTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, { id: Date.now(), title: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const getMoodColor = (value) => {
    if (value <= 3) return 'text-red-500';
    if (value <= 6) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getMoodText = (value) => {
    if (value <= 3) return 'Low';
    if (value <= 6) return 'Neutral';
    return 'High';
  };

  const getCompletionPercentage = () => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(task => task.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">Daily Mood & Planner</CardTitle>
              <CardDescription className="text-blue-100">{formatDate(date)}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Today's Mood:</span>
              <span className={`font-bold text-lg ${getMoodColor(mood)}`}>
                {getMoodText(mood)}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full rounded-none">
              <TabsTrigger value="plan" className="py-3">
                <CalendarIcon className="mr-2 h-4 w-4" /> Daily Plan
              </TabsTrigger>
              <TabsTrigger value="mood" className="py-3">
                <BarChart className="mr-2 h-4 w-4" /> Mood Tracker
              </TabsTrigger>
              <TabsTrigger value="calendar" className="py-3">
                <CalendarIcon className="mr-2 h-4 w-4" /> Calendar
              </TabsTrigger>
            </TabsList>

            {/* Daily Plan Tab */}
            <TabsContent value="plan" className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="Add a new task..." 
                    value={newTask} 
                    onChange={(e) => setNewTask(e.target.value)} 
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  />
                  <Button onClick={addTask} size="icon">
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                </div>

                <div className="mt-2">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Tasks for Today</h3>
                    <span className="text-sm text-gray-500">
                      {getCompletionPercentage()}% completed
                    </span>
                  </div>
                  
                  <div className="h-2 w-full bg-gray-200 rounded-full mb-4">
                    <div 
                      className="h-2 bg-green-500 rounded-full" 
                      style={{ width: `${getCompletionPercentage()}%` }}
                    ></div>
                  </div>
                  
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {tasks.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">No tasks for today. Add one above!</p>
                    ) : (
                      tasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={`rounded-full mr-2 ${task.completed ? 'text-green-500' : 'text-gray-400'}`}
                              onClick={() => toggleTask(task.id)}
                            >
                              <CheckCircle className={`h-5 w-5 ${task.completed ? 'fill-green-500' : ''}`} />
                            </Button>
                            <span className={task.completed ? 'line-through text-gray-500' : ''}>
                              {task.title}
                            </span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
                            <Trash2 className="h-4 w-4 text-gray-500" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Mood Tracker Tab */}
            <TabsContent value="mood" className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">How are you feeling today?</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm text-gray-500 mb-2">
                        <span>Low</span>
                        <span>Neutral</span>
                        <span>High</span>
                      </div>
                      <Slider 
                        value={[mood]} 
                        min={1} 
                        max={10} 
                        step={1}
                        onValueChange={(value) => setMood(value[0])}
                        className="mb-2"
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Mood Level:</span>
                        <span className={`font-bold ${getMoodColor(mood)}`}>
                          {mood}/10 - {getMoodText(mood)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Mood factors</h3>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="What influenced your mood today?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="work">Work</SelectItem>
                          <SelectItem value="relationships">Relationships</SelectItem>
                          <SelectItem value="health">Health</SelectItem>
                          <SelectItem value="weather">Weather</SelectItem>
                          <SelectItem value="sleep">Sleep</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Notes</h3>
                      <Textarea 
                        placeholder="How was your day? Any thoughts or reflections?" 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="h-24"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Calendar Tab */}
            <TabsContent value="calendar" className="p-6">
              <div className="flex flex-col items-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  className="rounded-md border mb-4"
                />
                <Card className="w-full mt-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{formatDate(date)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Mood:</span>
                        <span className={getMoodColor(mood)}>{getMoodText(mood)} ({mood}/10)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tasks:</span>
                        <span>{tasks.filter(t => t.completed).length}/{tasks.length} completed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 p-4 bg-gray-50 rounded-b-lg">
          <Button variant="outline">Reset</Button>
          <Button>Save Day</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DailyMoodPlanner;