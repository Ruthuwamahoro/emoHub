import React from 'react';
import { 
  Phone, 
  Search, 
  Calendar, 
  BookOpen, 
  MessageCircle, 
  Activity, 
  Bell, 
  Users, 
  Heart, 
  Bookmark, 
  Trophy, 
  MessageSquarePlus,
  Brain,
  Timer as TimerIcon,
  Pencil as PencilIcon,
  Smile as SmileIcon 
} from 'lucide-react';

export const RightSidebar = () => {
  const onlineProfessionals = [
    { id: '1', name: 'Dr. Sarah Chen', status: 'online', specialty: 'Anxiety' },
    { id: '2', name: 'Dr. Mike Ross', status: 'busy', specialty: 'Depression' },
  ];

  const moodData = [
    { day: 'Mon', value: 8 },
    { day: 'Tue', value: 6 },
    { day: 'Wed', value: 7 },
    { day: 'Thu', value: 8 },
    { day: 'Fri', value: 9 },
    { day: 'Sat', value: 7 },
    { day: 'Sun', value: 8 },
  ];

  const selfCareActivities = [
    { id: '1', title: 'Breathing Exercise', duration: '5 min', icon: <Brain className="w-4 h-4" /> },
    { id: '2', title: 'Quick Meditation', duration: '3 min', icon: <TimerIcon className="w-4 h-4" /> },
    { id: '3', title: 'Journaling', duration: '10 min', icon: <PencilIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="w-80 bg-gray-900 text-white h-screen overflow-y-auto p-4 border-l border-gray-800">
      {/* Emergency Support */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Phone className="w-5 h-5 text-red-400" />
          <h2 className="text-lg font-semibold">Emergency Support</h2>
        </div>
        <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg transition-colors">
          SOS Hotline
        </button>
      </div>

      {/* Quick Links */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold">Quick Links</h2>
        </div>
        <div className="space-y-2">
          <button className="w-full text-left py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Upcoming Events
          </button>
          <button className="w-full text-left py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Resources
          </button>
        </div>
      </div>

      {/* Chat with Professionals */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold">Online Professionals</h2>
        </div>
        <div className="space-y-2">
          {onlineProfessionals.map((prof) => (
            <div key={prof.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-800">
              <div>
                <p className="font-medium">{prof.name}</p>
                <p className="text-sm text-gray-400">{prof.specialty}</p>
              </div>
              <div className={`w-2 h-2 rounded-full ${
                prof.status === 'online' ? 'bg-green-400' :
                prof.status === 'busy' ? 'bg-yellow-400' : 'bg-gray-400'
              }`} />
            </div>
          ))}
        </div>
      </div>

      {/* Mood Tracker */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-5 h-5 text-green-400" />
          <h2 className="text-lg font-semibold">Mood Tracker</h2>
        </div>
        <div className="bg-gray-800 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <SmileIcon className="w-5 h-5 text-yellow-400" />
            <span>Today: Feeling Great</span>
          </div>
          <div className="flex items-end justify-between h-20 gap-1">
            {moodData.map((data, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <div 
                  className="w-4 bg-purple-400 rounded-t"
                  style={{ height: `${data.value * 10}%` }}
                />
                <span className="text-xs text-gray-400">{data.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Self-Care Activities */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="w-5 h-5 text-pink-400" />
          <h2 className="text-lg font-semibold">Self-Care Activities</h2>
        </div>
        <div className="space-y-2">
          {selfCareActivities.map((activity) => (
            <button
              key={activity.id}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                {activity.icon}
                <span>{activity.title}</span>
              </div>
              <span className="text-sm text-gray-400">{activity.duration}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="w-5 h-5 text-yellow-400" />
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        <div className="space-y-2">
          <div className="p-3 rounded-lg bg-gray-800">
            <p className="text-sm">New message from your therapist</p>
            <p className="text-xs text-gray-400">2 minutes ago</p>
          </div>
          <div className="p-3 rounded-lg bg-gray-800">
            <p className="text-sm">Upcoming group session tomorrow</p>
            <p className="text-xs text-gray-400">1 hour ago</p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-8 flex flex-col gap-2">
        <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
          <MessageSquarePlus className="w-4 h-4" />
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

