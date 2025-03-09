"use client"
import React, { useState } from 'react';
import { Calendar, Clock, MessageSquare, Users } from 'lucide-react';

const MentalWellbeingPlatform = () => {
  const [activeTab, setActiveTab] = useState('specialists');
  
  // Sample data for specialists
  const specialists = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Clinical Psychologist', experience: '12 years', availability: 'Mon, Wed, Fri', avatar: '/api/placeholder/80/80' },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Therapist', experience: '8 years', availability: 'Tue, Thu', avatar: '/api/placeholder/80/80' },
    { id: 3, name: 'Dr. Emily Rodriguez', specialty: 'Counselor', experience: '10 years', availability: 'Mon, Tue, Wed', avatar: '/api/placeholder/80/80' },
    { id: 4, name: 'Dr. James Wilson', specialty: 'Psychiatrist', experience: '15 years', availability: 'Thu, Fri', avatar: '/api/placeholder/80/80' }
  ];

  // Sample data for scheduled meetings
  const scheduledMeetings = [
    { id: 101, specialist: 'Dr. Sarah Johnson', date: 'March 10, 2025', time: '10:00 AM', duration: '50 minutes', status: 'confirmed' },
    { id: 102, specialist: 'Dr. Michael Chen', date: 'March 15, 2025', time: '2:30 PM', duration: '50 minutes', status: 'pending' }
  ];

  // Sample messages for chat
  const messages = [
    { id: 1, sender: 'Dr. Sarah Johnson', content: 'Hello! How are you feeling today?', time: '10:30 AM', isUser: false },
    { id: 2, sender: 'You', content: 'I\'m feeling a bit anxious about my upcoming exams.', time: '10:32 AM', isUser: true },
    { id: 3, sender: 'Dr. Sarah Johnson', content: 'That\'s understandable. Let\'s talk about some strategies that might help you manage that anxiety.', time: '10:35 AM', isUser: false }
  ];

  // Chat state for the active conversation
  const [newMessage, setNewMessage] = useState('');
  const [activeChat, setActiveChat] = useState(specialists[0]);
  const [chatMessages, setChatMessages] = useState(messages);
  
  // Function to handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: chatMessages.length + 1,
        sender: 'You',
        content: newMessage,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        isUser: true
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  // Function to render the appropriate content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'specialists':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {specialists.map(specialist => (
              <div key={specialist.id} className="bg-white rounded-lg shadow p-4 flex items-start space-x-4 hover:shadow-md transition-shadow">
                <img src={specialist.avatar} alt={specialist.name} className="w-16 h-16 rounded-full" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{specialist.name}</h3>
                  <p className="text-sm text-gray-600">{specialist.specialty} • {specialist.experience} experience</p>
                  <p className="text-xs text-gray-500 mt-1">Available: {specialist.availability}</p>
                  <div className="mt-3 flex space-x-2">
                    <button 
                      onClick={() => setActiveTab('schedule')} 
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Schedule
                    </button>
                    <button 
                      onClick={() => {
                        setActiveChat(specialist);
                        setActiveTab('chat');
                      }} 
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                    >
                      Chat
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'schedule':
        return (
          <div className="p-4">
            <div className="mb-6 bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-lg mb-4">Schedule a New Meeting</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Specialist</label>
                  <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    {specialists.map(spec => (
                      <option key={spec.id} value={spec.id}>{spec.name} - {spec.specialty}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                  <input type="date" className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Time</label>
                  <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option>9:00 AM</option>
                    <option>10:00 AM</option>
                    <option>11:00 AM</option>
                    <option>1:00 PM</option>
                    <option>2:00 PM</option>
                    <option>3:00 PM</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
                  <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option>Initial Consultation</option>
                    <option>Follow-up Session</option>
                    <option>Therapy Session</option>
                    <option>Stress Management</option>
                    <option>Other (please specify)</option>
                  </select>
                </div>
              </div>
              
              <button className="mt-4 w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Schedule Meeting
              </button>
            </div>
            
            <h3 className="font-semibold text-lg mb-2">Your Scheduled Meetings</h3>
            <div className="space-y-3">
              {scheduledMeetings.map(meeting => (
                <div key={meeting.id} className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium">{meeting.specialist}</p>
                    <p className="text-sm text-gray-600">{meeting.date} • {meeting.time} • {meeting.duration}</p>
                  </div>
                  <div className="mt-3 md:mt-0 flex items-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      meeting.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {meeting.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                    </span>
                    <div className="ml-3 flex space-x-2">
                      <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                        Reschedule
                      </button>
                      <button className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'meetings':
        return (
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-4">Upcoming Meetings</h3>
            <div className="space-y-4">
              {scheduledMeetings.map(meeting => (
                <div key={meeting.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{meeting.specialist}</h4>
                      <p className="text-sm text-gray-600">{meeting.date} • {meeting.time}</p>
                      <p className="text-sm text-gray-500">Duration: {meeting.duration}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      meeting.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {meeting.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                    </span>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {meeting.status === 'confirmed' && (
                      <button className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                        Join Meeting
                      </button>
                    )}
                    <button className="flex items-center justify-center px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'chat':
        return (
          <div className="flex h-full">
            {/* Sidebar with chat contacts */}
            <div className="w-1/4 border-r border-gray-200 p-3">
              <h3 className="font-semibold text-md mb-3">Messages</h3>
              <div className="space-y-2">
                {specialists.map(spec => (
                  <div 
                    key={spec.id}
                    onClick={() => setActiveChat(spec)}
                    className={`flex items-center p-2 rounded-md cursor-pointer ${activeChat.id === spec.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}`}
                  >
                    <img src={spec.avatar} alt={spec.name} className="w-10 h-10 rounded-full mr-3" />
                    <div>
                      <p className="font-medium text-sm">{spec.name}</p>
                      <p className="text-xs text-gray-500">{spec.specialty}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Chat main area */}
            <div className="w-3/4 flex flex-col h-full">
              {/* Chat header */}
              <div className="border-b border-gray-200 p-3 flex items-center">
                <img src={activeChat.avatar} alt={activeChat.name} className="w-10 h-10 rounded-full mr-3" />
                <div>
                  <p className="font-medium">{activeChat.name}</p>
                  <p className="text-xs text-gray-500">{activeChat.specialty}</p>
                </div>
              </div>
              
              {/* Messages area */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
                {chatMessages.map(message => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                        message.isUser 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-white shadow rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Message input */}
              <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3 flex items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  type="submit"
                  className="ml-2 rounded-full bg-blue-600 text-white p-2 hover:bg-blue-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        );
      
      default:
        return <div>Select a tab to get started</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-bold text-gray-900">MindfulConnect</h1>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                My Profile
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('specialists')}
              className={`flex items-center px-4 py-3 text-sm font-medium ${
                activeTab === 'specialists' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="h-5 w-5 mr-2" />
              Find Specialists
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex items-center px-4 py-3 text-sm font-medium ${
                activeTab === 'schedule' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Schedule
            </button>
            <button
              onClick={() => setActiveTab('meetings')}
              className={`flex items-center px-4 py-3 text-sm font-medium ${
                activeTab === 'meetings' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Clock className="h-5 w-5 mr-2" />
              My Meetings
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center px-4 py-3 text-sm font-medium ${
                activeTab === 'chat' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Chat
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="min-h-[500px]">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MentalWellbeingPlatform;