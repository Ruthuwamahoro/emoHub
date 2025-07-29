"use client";
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Plus, Users, Star, Video, Building2, Globe, ExternalLink, Shield, ShieldCheck, User, Eye, BarChart3, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Event {
  id: number;
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  isVirtual: boolean;
  location?: string;
  virtualLink?: string;
  image: string;
  category: string;
  attendees: number;
  maxAttendees: number;
  rating: number;
  createdBy: string;
  status: 'draft' | 'published' | 'cancelled';
}

interface Session {
  user: {
    role: 'User' | 'Admin' | 'SuperAdmin';
    name: string;
    id: string;
  };
}

const EmotionalIntelligenceDashboard = () => {
  
  const { data: session} = useSession();
  const mockSession: Session = session as unknown as Session;

  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Mindful Leadership Workshop",
      description: "Discover how emotional intelligence can transform your leadership style. Learn practical techniques for managing emotions under pressure.",
      startDate: "2025-08-15",
      startTime: "10:00",
      endDate: "2025-08-15",
      endTime: "16:00",
      isVirtual: false,
      location: "San Francisco Convention Center, Hall A",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
      category: "Leadership",
      attendees: 45,
      maxAttendees: 60,
      rating: 4.8,
      createdBy: 'admin1',
      status: 'published'
    },
    {
      id: 2,
      title: "Building Empathy in Remote Teams",
      description: "Create stronger connections and improve collaboration through enhanced emotional awareness and empathy skills.",
      startDate: "2025-08-22",
      startTime: "14:00",
      endDate: "2025-08-22",
      endTime: "17:30",
      isVirtual: true,
      virtualLink: "https://meet.google.com/abc-defg-hij",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
      category: "Team Building",
      attendees: 32,
      maxAttendees: 50,
      rating: 4.9,
      createdBy: 'admin2',
      status: 'published'
    },
    {
      id: 3,
      title: "Emotional Regulation Masterclass",
      description: "Master the art of emotional self-control and learn strategies to maintain composure in challenging situations.",
      startDate: "2025-08-30",
      startTime: "18:00",
      endDate: "2025-08-31",
      endTime: "12:00",
      isVirtual: false,
      location: "New York Wellness Center, Studio 3",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
      category: "Personal Development",
      attendees: 28,
      maxAttendees: 35,
      rating: 4.7,
      createdBy: 'user123',
      status: 'published'
    }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    isVirtual: false,
    location: '',
    virtualLink: '',
    image: '',
    category: 'Personal Development',
    maxAttendees: 50,
    status: 'draft' as 'draft' | 'published'
  });

  const [activeTab, setActiveTab] = useState('events');

  const handleCreateEvent = () => {
    if (newEvent.title && newEvent.startDate && newEvent.description) {
      const event: Event = {
        id: events.length + 1,
        ...newEvent,
        attendees: 0,
        rating: 0,
        createdBy: mockSession.user.id 
      };
      setEvents([...events, event]);
      setNewEvent({
        title: '',
        description: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        isVirtual: false,
        location: '',
        virtualLink: '',
        image: '',
        category: 'Personal Development',
        maxAttendees: 50,
        status: 'draft'
      });
    }
  };

  const handleDeleteEvent = (eventId: number) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const handleStatusChange = (eventId: number, newStatus: 'draft' | 'published' | 'cancelled') => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, status: newStatus } : event
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'SuperAdmin':
        return <ShieldCheck className="h-5 w-5" />;
      case 'Admin':
        return <Shield className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SuperAdmin':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Admin':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canEditEvent = (event: Event) => {
    return mockSession.user.role === 'SuperAdmin' || 
           (mockSession.user.role === 'Admin') || 
           (event.createdBy === mockSession.user.id);
  };

  const canDeleteEvent = (event: Event) => {
    return mockSession.user.role === 'SuperAdmin' || 
           (mockSession.user.role === 'Admin' && event.createdBy !== 'SuperAdmin') ||
           (event.createdBy === mockSession.user.id);
  };

  // Filter published events for regular users
  const displayEvents = mockSession.user.role === 'User' 
    ? events.filter(event => event.status === 'published')
    : events;

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontSize: '16px' }}>
      {mockSession.user.role !== 'User' && (
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('events')}
                className={`py-4 px-2 border-b-2 font-medium text-base transition-colors ${
                  activeTab === 'events'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Events</span>
                </div>
              </button>
              
              {(mockSession.user.role === 'Admin' || mockSession.user.role === 'SuperAdmin') && (
                <button
                  onClick={() => setActiveTab('create')}
                  className={`py-4 px-2 border-b-2 font-medium text-base transition-colors ${
                    activeTab === 'create'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Create Event</span>
                  </div>
                </button>
              )}

              {mockSession.user.role === 'SuperAdmin' && (
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`py-4 px-2 border-b-2 font-medium text-base transition-colors ${
                    activeTab === 'analytics'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Analytics</span>
                  </div>
                </button>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Events Display - Available for all roles */}
        {(activeTab === 'events' || mockSession.user.role === 'User') && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">
                {mockSession.user.role === 'User' ? 'Available Events' : 'Event Management'}
              </h2>
              <div className="text-base text-slate-600">
                {displayEvents.length} {mockSession.user.role === 'User' ? 'available' : 'total'} events
              </div>
            </div>

            <div className="grid gap-6">
              {displayEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-semibold text-slate-900">{event.title}</h3>
                          {mockSession.user.role !== 'User' && (
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                              {event.status}
                            </span>
                          )}
                          {event.isVirtual ? (
                            <div className="flex items-center space-x-1 text-orange-600">
                              <Video className="h-5 w-5" />
                              <span className="text-sm font-medium">Virtual</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1 text-slate-600">
                              <Building2 className="h-5 w-5" />
                              <span className="text-sm font-medium">In-Person</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-base text-slate-600 mb-4 leading-relaxed">{event.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-base">
                          <div className="flex items-center space-x-2 text-slate-600">
                            <Calendar className="h-5 w-5" />
                            <span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-slate-600">
                            <Clock className="h-5 w-5" />
                            <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-slate-600">
                            <Users className="h-5 w-5" />
                            <span>{event.attendees}/{event.maxAttendees} attendees</span>
                          </div>
                        </div>

                        {event.rating > 0 && (
                          <div className="flex items-center space-x-2 mt-3">
                            <Star className="h-5 w-5 text-yellow-500 fill-current" />
                            <span className="text-base font-medium text-slate-700">{event.rating}/5.0</span>
                            <span className="text-base text-slate-500">rating</span>
                          </div>
                        )}

                        {event.isVirtual ? (
                          <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Globe className="h-5 w-5 text-orange-600" />
                                <span className="text-base font-medium text-orange-800">Virtual Event</span>
                              </div>
                              {event.virtualLink && (
                                <a
                                  href={event.virtualLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 text-base font-medium"
                                >
                                  <span>Join Meeting</span>
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-5 w-5 text-slate-600" />
                              <span className="text-base font-medium text-slate-800">Location: {event.location}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Admin/SuperAdmin Controls - Hidden for Users */}
                      {mockSession.user.role !== 'User' && (
                        <div className="flex items-center space-x-2 ml-6">
                          {canEditEvent(event) && (
                            <select
                              value={event.status}
                              onChange={(e) => handleStatusChange(event.id, e.target.value as 'draft' | 'published' | 'cancelled')}
                              className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            >
                              <option value="draft">Draft</option>
                              <option value="published">Published</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          )}
                          
                          {canDeleteEvent(event) && (
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Event Tab - Admin/SuperAdmin Only */}
        {activeTab === 'create' && (mockSession.user.role === 'Admin' || mockSession.user.role === 'SuperAdmin') && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Create New Event</h2>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-base font-medium text-slate-700 mb-2">Event Title</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter event title"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-slate-700 mb-2">Description</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    placeholder="Describe your event..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-medium text-slate-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={newEvent.startDate}
                      onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                      className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-slate-700 mb-2">Start Time</label>
                    <input
                      type="time"
                      value={newEvent.startTime}
                      onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                      className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-medium text-slate-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={newEvent.endDate}
                      onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                      className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-base font-medium text-slate-700 mb-2">End Time</label>
                    <input
                      type="time"
                      value={newEvent.endTime}
                      onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                      className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={newEvent.isVirtual}
                      onChange={(e) => setNewEvent({ ...newEvent, isVirtual: e.target.checked })}
                      className="w-5 h-5 text-orange-600 border-slate-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-base font-medium text-slate-700">Virtual Event</span>
                  </label>
                </div>

                {newEvent.isVirtual ? (
                  <div>
                    <label className="block text-base font-medium text-slate-700 mb-2">Virtual Meeting Link</label>
                    <input
                      type="url"
                      value={newEvent.virtualLink}
                      onChange={(e) => setNewEvent({ ...newEvent, virtualLink: e.target.value })}
                      className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="https://meet.google.com/your-meeting-link"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-base font-medium text-slate-700 mb-2">Conference Location</label>
                    <input
                      type="text"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Convention Center, Hall A"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-medium text-slate-700 mb-2">Category</label>
                    <select
                      value={newEvent.category}
                      onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                      className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="Personal Development">Personal Development</option>
                      <option value="Leadership">Leadership</option>
                      <option value="Team Building">Team Building</option>
                      <option value="Communication">Communication</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-base font-medium text-slate-700 mb-2">Max Attendees</label>
                    <input
                      type="number"
                      value={newEvent.maxAttendees}
                      onChange={(e) => setNewEvent({ ...newEvent, maxAttendees: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-base font-medium text-slate-700 mb-2">Status</label>
                  <select
                    value={newEvent.status}
                    onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value as 'draft' | 'published' })}
                    className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="draft">Save as Draft</option>
                    <option value="published">Publish Immediately</option>
                  </select>
                </div>

                <button
                  onClick={handleCreateEvent}
                  className="w-full bg-gradient-to-r from-orange-500 to-slate-600 text-white py-3 px-6 rounded-lg text-base font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Create Event
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab - SuperAdmin Only */}
        {activeTab === 'analytics' && mockSession.user.role === 'SuperAdmin' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-medium text-slate-600">Total Events</p>
                    <p className="text-3xl font-bold text-slate-900">{events.length}</p>
                  </div>
                  <Calendar className="h-10 w-10 text-orange-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-medium text-slate-600">Published</p>
                    <p className="text-3xl font-bold text-green-600">
                      {events.filter(e => e.status === 'published').length}
                    </p>
                  </div>
                  <Eye className="h-10 w-10 text-green-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-medium text-slate-600">Total Attendees</p>
                    <p className="text-3xl font-bold text-slate-900">
                      {events.reduce((sum, event) => sum + event.attendees, 0)}
                    </p>
                  </div>
                  <Users className="h-10 w-10 text-slate-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-medium text-slate-600">Avg Rating</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {(events.reduce((sum, event) => sum + event.rating, 0) / events.length).toFixed(1)}
                    </p>
                  </div>
                  <Star className="h-10 w-10 text-orange-500" />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EmotionalIntelligenceDashboard;