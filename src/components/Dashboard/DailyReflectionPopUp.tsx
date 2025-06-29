import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, X } from 'lucide-react';

const DailyReflectionCard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(true);

  const messages = [
    "Your mental health matters. Take a moment to check in with yourself today.",
    "Small moments of reflection create big changes in your wellbeing.",
    "You deserve to prioritize your emotional health. Start now.",
    "Every reflection is a step toward a healthier, happier you.",
    "Your feelings are valid. Let's explore them together.",
    "Taking care of your mind is just as important as taking care of your body."
  ];

  const [currentMessage] = useState(messages[Math.floor(Math.random() * messages.length)]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const handleReflect = () => {
    window.location.href = '/dashboard/dailyreflection';
};

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsCardVisible(false);
    }, 300);
  };

  if (!isCardVisible) {
    return null;
  }

  return (
    <div
      className={`relative bg-gradient-to-br from-slate-200 via-blue-50 to-indigo-50 rounded-3xl shadow-lg border p-6 transform transition-all duration-500 hover:shadow-xl hover:scale-[1.02] ${
        isVisible
          ? 'scale-100 opacity-100 translate-y-0'
          : 'scale-95 opacity-0 translate-y-4'
      }`}
    >
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-full transition-colors duration-200"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl">
          <Heart className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-orange-500">Daily Check-in</h3>
          <p className="text-sm text-gray-500">Your wellbeing matters</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-700 leading-relaxed text-base">
          {currentMessage}
        </p>
      </div>

      <div className="space-y-2">
        <button
          onClick={handleReflect}
          className="w-full bg-slate-500 text-white py-3 px-6 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-100 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
        >
          <Sparkles className="w-4 h-4" />
          Start Daily Reflection
        </button>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            ✨ Just 2 minutes can make a difference
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyReflectionCard;