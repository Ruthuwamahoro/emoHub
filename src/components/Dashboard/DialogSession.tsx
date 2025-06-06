"use client";
import React, { useState, useEffect } from 'react';
import { MessageCircle, Users, Clock, Mic, MicOff, Send, X, MoreHorizontal, ArrowLeft } from 'lucide-react';

const DialogueSession = () => {
  const [message, setMessage] = useState('');
  const [micEnabled, setMicEnabled] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'Dr. Maya Chen',
      role: 'Facilitator',
      content: 'Welcome everyone to our dialogue on "Navigating Work Uncertainty". Let\'s begin by sharing one challenge you\'re currently facing in your professional life.',
      time: '2:03 PM',
      isFacilitator: true
    },
    {
      id: '2',
      sender: 'Jamie Miller',
      role: 'Participant',
      content: 'Thanks for having us, Dr. Chen. I\'m currently dealing with a potential reorganization at my company, and the uncertainty is causing a lot of stress.',
      time: '2:05 PM'
    },
    {
      id: '3',
      sender: 'Sam Kumar',
      role: 'Participant',
      content: 'I can relate to that. In my case, I\'m freelancing, and the inconsistent workflow has been challenging for my mental health and financial planning.',
      time: '2:06 PM'
    }
  ]);
  
  const [participants, setParticipants] = useState([
    { id: '1', name: 'Dr. Maya Chen', role: 'Facilitator', isActive: true, isFacilitator: true },
    { id: '2', name: 'You', role: 'Participant', isActive: true, isYou: true },
    { id: '3', name: 'Jamie Miller', role: 'Participant', isActive: true },
    { id: '4', name: 'Sam Kumar', role: 'Participant', isActive: true },
    { id: '5', name: 'Taylor Johnson', role: 'Participant', isActive: true },
    { id: '6', name: 'Alex Rivera', role: 'Participant', isActive: false }
  ]);
  
  const [timeRemaining, setTimeRemaining] = useState(42); // minutes remaining
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
  
  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: String(messages.length + 1),
        sender: 'You',
        role: 'Participant',
        content: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isYou: true
      };
      
      setMessages([...messages, newMessage]);
      setMessage('');
      
      if (messages.length === 3) {
        setTimeout(() => {
          const facilitatorResponse = {
            id: String(messages.length + 2),
            sender: 'Dr. Maya Chen',
            role: 'Facilitator',
            content: 'Thank you for sharing. I notice a common theme of unpredictability. How has this uncertainty affected your day-to-day emotional state?',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isFacilitator: true
          };
          setMessages(prev => [...prev, facilitatorResponse]);
        }, 3000);
      }
    }
  };
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1/60));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button className="mr-3 text-slate-600 hover:text-slate-800">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-lg font-semibold">Navigating Work Uncertainty</h1>
              <div className="flex items-center text-sm text-slate-500">
                <Users className="w-4 h-4 mr-1" />
                <span className="mr-3">5/8 Participants</span>
                <Clock className="w-4 h-4 mr-1" />
                <span>{Math.floor(timeRemaining)} min remaining</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsInfoPanelOpen(!isInfoPanelOpen)}
              className={`p-2 rounded-md ${isInfoPanelOpen ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <Users size={20} />
            </button>
            <button className="p-2 rounded-md text-slate-600 hover:bg-slate-100">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="bg-indigo-50 p-3 rounded-lg mb-6 text-center text-sm text-indigo-700">
              Dialogue started at 2:00 PM. Please follow the dialogue guidelines to create a supportive space.
            </div>
            
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.isYou ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-3/4 rounded-lg p-3 ${
                  msg.isYou 
                    ? 'bg-indigo-600 text-white' 
                    : msg.isFacilitator 
                      ? 'bg-violet-100 text-slate-800 border border-violet-200' 
                      : 'bg-white text-slate-800 border border-slate-200'
                }`}>
                  <div className="flex items-center mb-1">
                    <span className={`font-medium text-sm ${msg.isYou ? 'text-indigo-100' : msg.isFacilitator ? 'text-violet-700' : 'text-indigo-600'}`}>
                      {msg.sender}
                    </span>
                    <span className={`text-xs ml-2 ${msg.isYou ? 'text-indigo-200' : 'text-slate-500'}`}>
                      {msg.role}
                    </span>
                    <span className={`text-xs ml-auto ${msg.isYou ? 'text-indigo-200' : 'text-slate-500'}`}>
                      {msg.time}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Input area */}
          <div className="p-4 bg-white border-t border-slate-200">
            <div className="flex items-center">
              <button 
                onClick={() => setMicEnabled(!micEnabled)}
                className={`p-2 rounded-full mr-2 ${
                  micEnabled ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
              </button>
              <div className="flex-1 relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none overflow-hidden"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
              </div>
              <button 
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className={`p-2 rounded-full ml-2 ${
                  message.trim() 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Participants panel - conditionally visible */}
        {isInfoPanelOpen && (
          <div className="w-64 bg-white border-l border-slate-200 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium">Participants</h2>
                <button 
                  onClick={() => setIsInfoPanelOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                      participant.isFacilitator 
                        ? 'bg-violet-100 text-violet-600' 
                        : participant.isYou
                          ? 'bg-indigo-100 text-indigo-600'
                          : 'bg-slate-100 text-slate-600'
                    }`}>
                      {participant.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium flex items-center">
                        {participant.name}
                        {participant.isYou && <span className="text-xs text-indigo-600 ml-1">(You)</span>}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center">
                        {participant.role}
                        {!participant.isActive && <span className="ml-1 text-slate-400">(away)</span>}
                      </div>
                    </div>
                    <div className={`ml-auto w-2 h-2 rounded-full ${
                      participant.isActive ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}></div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-medium mb-2">Dialogue Guidelines</h3>
                <ul className="space-y-2">
                  <li className="text-xs text-slate-600 flex">
                    <span className="text-indigo-500 mr-2">•</span>
                    Share from personal experience
                  </li>
                  <li className="text-xs text-slate-600 flex">
                    <span className="text-indigo-500 mr-2">•</span>
                    Listen actively
                  </li>
                  <li className="text-xs text-slate-600 flex">
                    <span className="text-indigo-500 mr-2">•</span>
                    Ask curious questions
                  </li>
                  <li className="text-xs text-slate-600 flex">
                    <span className="text-indigo-500 mr-2">•</span>
                    Respect confidentiality
                  </li>
                  <li className="text-xs text-slate-600 flex">
                    <span className="text-indigo-500 mr-2">•</span>
                    Be present and minimize distractions
                  </li>
                </ul>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-medium mb-2">Your Intention</h3>
                <p className="text-xs text-slate-600 italic">
                  "I'm joining to learn strategies for managing uncertainty at work and to connect with others facing similar challenges."
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DialogueSession;