"use client"
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger , TooltipProvider} from "@/components/ui/tooltip";

import { 
  Clock, 
  CheckCircle2, 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  Activity, 
  PersonStanding,
  Timer,
  BarChart3,
  Mic,
  Trophy,
  Target,
  Share2,
  Users
} from 'lucide-react';

// Types for better type safety
type TaskCategory = 'Work' | 'Self-Care' | 'Social' | 'Wellness';
type TaskPriority = 'Low' | 'Medium' | 'High';

type GoalType = 'Short-Term' | 'Long-Term';

interface Goal {
  id: string;
  title: string;
  type: GoalType;
  targetDate: Date;
  tasks: Task[];
  progress: number;
}

interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  time: string;
  completed: boolean;
  assignedTo?: string[]; 
  points: number;
}

interface Reward {
  id: string;
  title: string;
  requiredPoints: number;
  unlocked: boolean;
}


export const DayPlanner: React.FC = () => {

    const [tasks, setTasks] = useState<Task[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [rewards, setRewards] = useState<Reward[]>([
      { 
        id: 'reward1', 
        title: 'Wellness Champion', 
        requiredPoints: 100, 
        unlocked: false 
      },
      { 
        id: 'reward2', 
        title: 'Productivity Master', 
        requiredPoints: 250, 
        unlocked: false 
      }
    ]);
  
    const [totalPoints, setTotalPoints] = useState(0);
    const [taskStreak, setTaskStreak] = useState(0);
  
    // Voice Command Simulation (Mock Implementation)
    const handleVoiceCommand = (command: string) => {
      console.log('Voice Command Received:', command);
      // Parse and execute voice command logic here
    };

  const [newTask, setNewTask] = useState<Partial<Task>>({});
  const [pomodoroTimer, setPomodoroTimer] = useState({
    active: false,
    workTime: 25,
    breakTime: 5,
    remainingTime: 25 * 60
  });

  const [selectedTheme, setSelectedTheme] = useState('default');

  const themes = {
    default: {
      background: 'bg-white',
      text: 'text-gray-800',
      accent: 'bg-blue-500'
    },
    calm: {
      background: 'bg-green-50',
      text: 'text-green-900',
      accent: 'bg-green-500'
    },
    energetic: {
      background: 'bg-orange-50',
      text: 'text-orange-900',
      accent: 'bg-orange-500'
    }
  };

  const addTask = () => {
    if (newTask.title) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title!,
        category: newTask.category || 'Work',
        priority: newTask.priority || 'Medium',
        time: newTask.time || '09:00',
        completed: false
      };
      setTasks([...tasks, task]);
      setNewTask({});
    }
  };

  const calculateTaskPoints = (priority: TaskPriority): number => {
    switch(priority) {
      case 'High': return 50;
      case 'Medium': return 25;
      case 'Low': return 10;
    }
  };

  const completeTask = (taskId: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId && !task.completed) {
        setTotalPoints(prev => prev + task.points);
        setTaskStreak(prev => prev + 1);
        return { ...task, completed: true };
      }
      return task;
    });

    setTasks(updatedTasks);
    checkRewardsUnlock();
  };

  const checkRewardsUnlock = () => {
    const updatedRewards = rewards.map(reward => {
      if (!reward.unlocked && totalPoints >= reward.requiredPoints) {
        return { ...reward, unlocked: true };
      }
      return reward;
    });

    setRewards(updatedRewards);
  };

  const addGoal = (goal: Partial<Goal>) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: goal.title || '',
      type: goal.type || 'Short-Term',
      targetDate: goal.targetDate || new Date(),
      tasks: goal.tasks || [],
      progress: goal.progress || 0
    };

    setGoals([...goals, newGoal]);
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed } 
        : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const startPomodoroTimer = () => {
    setPomodoroTimer({
      ...pomodoroTimer,
      active: true
    });
  };

  const renderWellnessSuggestions = () => {
    const suggestions = [
      { 
        icon: <PersonStanding />, 
        title: 'Take a 15-min walk', 
        description: 'Boost your energy and mental clarity' 
      },
      { 
        icon: <Activity />, 
        title: 'Stretch Break', 
        description: 'Quick 5-min stretching routine' 
      }
    ];

    return (
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <div 
            key={index} 
            className="flex items-center space-x-3 p-2 border rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <div className="bg-primary/10 rounded-full p-2">
              {suggestion.icon}
            </div>
            <div>
              <h4 className="font-medium">{suggestion.title}</h4>
              <p className="text-xs text-muted-foreground">{suggestion.description}</p>
            </div>
            <Button size="sm" variant="outline" className="ml-auto">Add</Button>
          </div>
        ))}
      </div>
    );
  };

  const renderTaskList = () => {
    return tasks.map(task => (
      <div 
        key={task.id} 
        className={`flex items-center space-x-3 p-3 border-b ${task.completed ? 'bg-green-50' : ''}`}
      >
        <input 
          type="checkbox" 
          checked={task.completed}
          onChange={() => toggleTaskCompletion(task.id)}
          className="form-checkbox"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className={`${task.completed ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </span>
            <Badge variant="outline">{task.category}</Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            <Clock className="inline-block mr-1 h-4 w-4" />
            {task.time}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button size="icon" variant="ghost">
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => deleteTask(task.id)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
    ));
  };

  const renderCollaborativeTasks = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Users className="inline-block mr-2" /> Collaborative Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Collaborative Task Management */}
          <div className="space-y-2">
            <Button variant="outline" className="w-full">
              <Share2 className="mr-2" /> Invite Collaborators
            </Button>
            <div className="text-sm text-muted-foreground">
              No collaborative tasks yet. Start by inviting team members!
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderGoalTracking = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Target className="inline-block mr-2" /> Goal Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full">
            <Plus className="mr-2" /> Add New Goal
          </Button>
          {goals.map(goal => (
            <div 
              key={goal.id} 
              className="border rounded-lg p-3 hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{goal.title}</h3>
                <Badge variant="outline">{goal.type}</Badge>
              </div>
              <Progress value={goal.progress} className="mt-2" />
              <div className="text-xs text-muted-foreground mt-1">
                Target Date: {goal.targetDate.toLocaleDateString()}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };
  const renderGamificationSection = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Trophy className="inline-block mr-2" /> Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Points</span>
              <Badge variant="secondary">{totalPoints}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Task Streak</span>
              <Badge variant="outline">{taskStreak} Days</Badge>
            </div>
            
            <h4 className="text-sm font-medium mt-4">Rewards</h4>
            {rewards.map(reward => (
              <div 
                key={reward.id} 
                className={`flex justify-between items-center p-2 rounded-lg ${
                  reward.unlocked ? 'bg-green-50' : 'bg-gray-100'
                }`}
              >
                <span>{reward.title}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      {reward.unlocked ? (
                        <CheckCircle2 className="text-green-500" />
                      ) : (
                        <Star className="text-yellow-500" />
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      {reward.unlocked 
                        ? 'Reward Unlocked!' 
                        : `Unlock at ${reward.requiredPoints} points`}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  
  const renderVoiceAssistant = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Mic className="inline-block mr-2" /> Voice Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => handleVoiceCommand('Plan 15 minutes for mindfulness at 10 AM')}
          >
            <Mic className="mr-2" /> Start Voice Command
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Tip: Say something like "Add a wellness task at 3 PM"
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={`container mx-auto p-4 ${themes[selectedTheme].background} ${themes[selectedTheme].text}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Plan Your Day</h1>
        <Select value={selectedTheme} onValueChange={setSelectedTheme}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default Theme</SelectItem>
            <SelectItem value="calm">Calm Theme</SelectItem>
            <SelectItem value="energetic">Energetic Theme</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Task Management Column */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Today's Tasks</CardTitle>
            <CardDescription>Organize and track your daily activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-4">
              <Input
                placeholder="Add a new task"
                value={newTask.title || ''}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
              <Select 
                value={newTask.category} 
                onValueChange={(val: TaskCategory) => setNewTask({ ...newTask, category: val })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Self-Care">Self-Care</SelectItem>
                  <SelectItem value="Social">Social</SelectItem>
                  <SelectItem value="Wellness">Wellness</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addTask}>
                <Plus className="mr-2 h-4 w-4" /> Add Task
              </Button>
            </div>
            
            <div className="border rounded-lg">
              {renderTaskList()}
            </div>
          </CardContent>
        </Card>

        {/* Wellness and Productivity Tools */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Wellness Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              {renderWellnessSuggestions()}
            </CardContent>
          </Card>

          {/* Pomodoro Timer */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Timer className="inline-block mr-2" /> Pomodoro Timer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <BarChart3 className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-medium">Focus Session</h3>
                  <Progress value={50} className="w-full" />
                  <div className="text-sm text-muted-foreground mt-2">
                    25 mins work | 5 mins break
                  </div>
                </div>
                <Button onClick={startPomodoroTimer}>
                  Start
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          {renderCollaborativeTasks()}
          {renderGoalTracking()}
          {renderGamificationSection()}
          {renderVoiceAssistant()}
        </div>
      </div>
    </div>
  );
};

