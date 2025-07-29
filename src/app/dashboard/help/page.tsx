"use client"
import React, { useState } from 'react';
import { MessageCircle, Mail, User, Send, Navigation, Mouse, Settings, BarChart3 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface NavigationTip {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const HelpSupportUI: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'navigation' | 'contact'>('navigation');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const navigationTips: NavigationTip[] = [
    {
      id: '1',
      title: 'Dashboard Overview',
      description: 'Access your main dashboard from the home icon in the sidebar. View recent activity.',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      id: '2',
      title: 'Navigation Menu',
      description: 'Use the left sidebar to navigate between different sections. Hover the sidebar items to expand sub-menus.',
      icon: <Navigation className="w-5 h-5" />
    },
    {
      id: '3',
      title: 'Quick Actions',
      description: 'Right-click on items for context menus. Use keyboard shortcuts for faster navigation.',
      icon: <Mouse className="w-5 h-5" />
    },
    {
      id: '4',
      title: 'Settings & Profile',
      description: 'Access your account settings and preferences from the profile menu in the top-right corner.',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all fields');
      return;
    }
    
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', message: '' });
    alert('Your message has been sent! We\'ll get back to you soon.');
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-100">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Help & Support</h1>
        <p className="text-slate-600">Learn to navigate the app or contact our support team</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8 bg-orange-300 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('navigation')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'navigation'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Navigation className="w-4 h-4 inline mr-2" />
          App Navigation
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'contact'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageCircle className="w-4 h-4 inline mr-2" />
          Contact Support
        </button>
      </div>

      {/* Navigation Guide Tab */}
      {activeTab === 'navigation' && (
        <div className="max-w-3xl">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                <Navigation className="w-5 h-5 mr-2 text-orange-600" />
                How to Navigate the App
              </h2>
              <p className="text-slate-600 mb-6">
                Get familiar with the main features and navigation patterns of your dashboard.
              </p>
            </div>

            <div className="space-y-4">
              {navigationTips.map((tip) => (
                <div
                  key={tip.id}
                  className="border border-slate-200 rounded-lg p-4 hover:border-orange-300 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="bg-orange-100 p-2 rounded-lg flex-shrink-0">
                      <div className="text-orange-600">
                        {tip.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 mb-1">{tip.title}</h3>
                      <p className="text-slate-600 text-sm">{tip.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Alert className="border-orange-200 bg-orange-50">
              <Navigation className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Pro Tip:</strong> Use Ctrl+K (Cmd+K on Mac) to open the quick search menu from anywhere in the app.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}

      {/* Contact Support Tab */}
      {activeTab === 'contact' && (
        <div className="max-w-2xl">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-orange-600" />
                Contact Support
              </h2>
            </div>

            <Alert className="border-slate-200 bg-slate-50">
              <Mail className="h-4 w-4 text-slate-600" />
              <AlertDescription className="text-slate-700">
                <strong>Response Time:</strong> Our support team typically responds within 2-4 hours during business hours (9 AM - 6 PM EST).
              </AlertDescription>
            </Alert>

            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  How can we help you?
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none transition-colors"
                  placeholder="Please describe your issue, question, or feedback in detail..."
                />
              </div>

              <Button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-orange-400 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </Button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h3 className="font-medium text-slate-900 mb-2">Other Ways to Reach Us</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <p><strong>Email:</strong> ruthuwamahoro250@gmail.com</p>
                <p><strong>Phone:</strong> SUPPORT (Mon-Fri, 9 AM - 6 PM EST)</p>
                <p><strong>Live Chat:</strong> Available in the bottom-right corner during business hours</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpSupportUI;