"use client"
import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  Mic, 
  Send, 
  RefreshCw, 
  Star, 
  Zap,
  Clock
} from 'lucide-react';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  type?: 'standard' | 'crisis' | 'recommendation';
  timestamp?: Date;
};

type RecentQuery = {
  id: number;
  query: string;
  timestamp: Date;
};

export const AdvancedAskAIComponent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0, 
      text: 'Welcome to your AI Mental Health Companion. I\'m here to provide compassionate, personalized support.', 
      sender: 'ai',
      type: 'standard',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [recentQueries, setRecentQueries] = useState<RecentQuery[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const suggestedPrompts = [
    'Stress management techniques',
    'Improving sleep quality',
    'Handling work anxiety',
    'Building emotional resilience'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    const newUserMessage: Message = {
      id: messages.length,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setRecentQueries(prev => [
      { id: recentQueries.length, query: input, timestamp: new Date() },
      ...prev.slice(0, 4)
    ]);

    setMessages(prev => [...prev, newUserMessage]);
    setIsProcessing(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 1,
        text: `Analyzing your query about "${input}". Here are some personalized insights and recommendations...`,
        sender: 'ai',
        type: input.toLowerCase().includes('crisis') ? 'crisis' : 'standard',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 1500);

    setInput('');
  };

  const renderMessage = (message: Message) => {
    const baseClasses = 'p-3 rounded-lg max-w-[85%] my-2 relative';
    const aiClasses = message.type === 'crisis' 
      ? 'bg-red-900 text-red-200' 
      : 'bg-gray-800 text-gray-200';
    const userClasses = 'bg-blue-900 text-blue-100 self-end ml-auto';

    return (
      <div 
        key={message.id} 
        className={`flex ${message.sender === 'ai' ? '' : 'justify-end'} group`}
      >
        <div 
          className={`
            ${baseClasses} 
            ${message.sender === 'ai' ? aiClasses : userClasses}
          `}
        >
          {message.text}
          <span className="text-xs text-gray-400 block mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {message.timestamp?.toLocaleTimeString()}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[700px]  mx-auto bg-gray-950 text-white rounded-xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Zap className="text-yellow-400" />
          <h2 className="text-xl font-bold text-white">AI Mental Health Companion</h2>
        </div>
        <div className="flex space-x-2">
          <Star className="text-blue-400 hover:text-blue-300 cursor-pointer" />
          <RefreshCw className="text-gray-300 hover:text-white cursor-pointer" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-[3] overflow-y-auto p-4 space-y-2 border-r border-gray-800">
          {messages.map(renderMessage)}
          <div ref={messagesEndRef} />
          {isProcessing && (
            <div className="text-gray-400 italic">AI is thinking...</div>
          )}
        </div>

        <div className="flex-1 bg-gray-900 p-3 overflow-y-auto">
          <h3 className="text-sm font-semibold mb-3 flex items-center">
            <Clock size={16} className="mr-2 text-blue-400" />
            Recent Queries
          </h3>
          {recentQueries.map((query) => (
            <div 
              key={query.id} 
              className="bg-gray-800 rounded p-2 mb-2 text-xs hover:bg-gray-700 cursor-pointer transition"
              onClick={() => setInput(query.query)}
            >
              {query.query}
              <span className="text-xs text-gray-500 block">
                {query.timestamp.toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-2 bg-gray-900 flex space-x-2 overflow-x-auto border-t border-gray-800">
        {suggestedPrompts.map((prompt, index) => (
          <button 
            key={index} 
            className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300 hover:bg-blue-900 hover:text-white transition"
            onClick={() => setInput(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="p-4 bg-gray-900 border-t border-gray-800 flex items-center space-x-2">
        <button className="p-2 bg-blue-900 rounded-full text-white">
          <Mic />
        </button>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="How can I support my mental health today?"
          className="flex-1 p-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button 
          className="p-2 bg-green-800 rounded-full text-white"
          onClick={handleSendMessage}
          disabled={isProcessing}
        >
          <Send />
        </button>
      </div>
    </div>
  );
};

