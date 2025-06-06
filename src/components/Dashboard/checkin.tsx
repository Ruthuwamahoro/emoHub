"use client"
import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Sun, Moon, Cloud, Clock, Heart, Smile, Frown, Meh, AlertTriangle, Battery, Coffee } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const questions = [
  {
    id: 1,
    text: "How are you feeling today?",
    type: "mood",
    icon: <Sun className="w-8 h-8 text-yellow-500" />,
    options: [
      { emoji: "😄", text: "Very Good", value: 5 },
      { emoji: "😊", text: "Good", value: 4 },
      { emoji: "😐", text: "Okay", value: 3 },
      { emoji: "😟", text: "Not Great", value: 2 },
      { emoji: "😢", text: "Not Good", value: 1 },
    ],
  },
  {
    id: 2,
    text: "Rate your energy level",
    type: "slider",
    icon: <Battery className="w-8 h-8 text-green-500" />,
    min: 1,
    max: 10,
  },
  {
    id: 3,
    text: "How well did you sleep last night?",
    type: "slider",
    icon: <Moon className="w-8 h-8 text-purple-500" />,
    min: 1,
    max: 10,
  },
  {
    id: 4,
    text: "What's on your mind today?",
    type: "text",
    icon: <Cloud className="w-8 h-8 text-blue-500" />,
    timed: true,
    timeLimit: 30,
  },
];

const motivationalQuotes = [
  "You're doing great!",
  "Every step counts!",
  "Your mental health matters!",
  "Keep going, you've got this!",
  "Taking care of yourself is a priority!",
];

const activities = [
  { title: "Meditation", description: "10 minutes of mindful breathing", icon: <Heart /> },
  { title: "Walking", description: "20 minutes nature walk", icon: <Coffee /> },
  { title: "Journaling", description: "Write down your thoughts", icon: <Cloud /> },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const MentalHealthTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [dailyStreak, setDailyStreak] = useState(5); // Mock streak

  const moodData = [
    { day: "Mon", mood: 4, energy: 3 },
    { day: "Tue", mood: 3, energy: 4 },
    { day: "Wed", mood: 5, energy: 5 },
    { day: "Thu", mood: 4, energy: 4 },
    { day: "Fri", mood: 3, energy: 3 },
    { day: "Sat", mood: 4, energy: 5 },
    { day: "Sun", mood: 5, energy: 4 },
  ];

  const pieData = [
    { name: 'Very Good', value: 30 },
    { name: 'Good', value: 25 },
    { name: 'Okay', value: 20 },
    { name: 'Not Great', value: 15 },
    { name: 'Not Good', value: 10 },
  ];

  useEffect(() => {
    if (questions[currentQuestion]?.timed && !showResults) {
      setTimeLeft(questions[currentQuestion].timeLimit);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentQuestion]);

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-center mb-6">
            {question.icon}
          </div>

          {question.type === "mood" && (
            <div className="grid grid-cols-5 gap-4 mt-6">
              {question.options.map((option) => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={option.value}
                >
                  <Button
                    onClick={() => handleAnswer(option.value)}
                    variant="outline"
                    className="w-full flex flex-col items-center p-4 hover:bg-blue-50 transition-colors"
                  >
                    <span className="text-2xl mb-2">{option.emoji}</span>
                    <span className="text-sm">{option.text}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          )}

          {question.type === "slider" && (
            <div className="mt-6 px-4">
              <Slider
                defaultValue={[5]}
                max={10}
                min={1}
                step={1}
                onValueChange={(value) => handleAnswer(value[0])}
                className="mt-6"
              />
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          )}

          {question.type === "text" && (
            <div className="mt-6">
              {timeLeft !== null && (
                <div className="mb-4 text-center">
                  <Clock className="inline-block mr-2" />
                  Time remaining: {timeLeft}s
                </div>
              )}
              <Textarea
                placeholder="Share your thoughts..."
                className="min-h-[100px]"
                onChange={(e) => handleAnswer(e.target.value)}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  const renderResults = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Your Weekly Wellness Summary
          </CardTitle>
          <CardDescription className="text-center">
            Here's how you've been doing over the past week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="w-full h-64">
              <h3 className="text-lg font-semibold mb-4">Mood & Energy Trends</h3>
              <LineChart width={400} height={200} data={moodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="mood" stroke="#8884d8" name="Mood" />
                <Line type="monotone" dataKey="energy" stroke="#82ca9d" name="Energy" />
              </LineChart>
            </div>
            <div className="w-full h-64">
              <h3 className="text-lg font-semibold mb-4">Mood Distribution</h3>
              <PieChart width={400} height={200}>
                <Pie
                  data={pieData}
                  cx={200}
                  cy={100}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <motion.div whileHover={{ scale: 1.02 }}>
            <div className="flex items-center space-x-2">
              <Heart className="text-red-500" />
              <h3 className="font-semibold">Daily Streak</h3>
            </div>
            <p className="mt-2 text-sm">You've completed {dailyStreak} days in a row!</p>
          </motion.div>
        </Card>

        <Card className="p-4">
          <motion.div whileHover={{ scale: 1.02 }}>
            <div className="flex items-center space-x-2">
              <Sun className="text-yellow-500" />
              <h3 className="font-semibold">Today's Insight</h3>
            </div>
            <p className="mt-2 text-sm">Your energy levels are improving!</p>
          </motion.div>
        </Card>

        <Card className="p-4">
          <motion.div whileHover={{ scale: 1.02 }}>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="text-blue-500" />
              <h3 className="font-semibold">Resources</h3>
            </div>
            <p className="mt-2 text-sm">Access our meditation guides</p>
          </motion.div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.title}
                whileHover={{ scale: 1.05 }}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-2 mb-2">
                  {activity.icon}
                  <h4 className="font-semibold">{activity.title}</h4>
                </div>
                <p className="text-sm text-gray-600">{activity.description}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Daily Wellness Check-In</h1>
        <p className="text-gray-600">
          Answer a few questions to understand your well-being better
        </p>
      </motion.div>

      {!showResults ? (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
              </div>
              <Progress
                value={((currentQuestion + 1) / questions.length) * 100}
                className="h-2"
              />
            </div>

            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {questions[currentQuestion].text}
              </h2>
              {renderQuestion()}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-6 text-sm text-gray-600 italic"
            >
              {motivationalQuotes[currentQuestion % motivationalQuotes.length]}
            </motion.div>
          </CardContent>
        </Card>
      ) : (
        renderResults()
      )}
    </div>
  );
};

