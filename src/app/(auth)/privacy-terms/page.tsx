"use client";

import React, { useState, useEffect } from 'react';
import { Brain, Shield, Users, Heart, Lock, Eye, Globe, MessageCircle, CheckCircle, ArrowLeft, ChevronRight } from 'lucide-react';

const PrivacyTermsPage = () => {
  const [activeSection, setActiveSection] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(currentProgress);

      const sections = document.querySelectorAll('section[id]');
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    { id: 'overview', title: 'Overview', icon: <Eye className="w-4 h-4" /> },
    { id: 'information-collection', title: 'Information Collection', icon: <Eye className="w-4 h-4" /> },
    { id: 'data-usage', title: 'Data Usage', icon: <Heart className="w-4 h-4" /> },
    { id: 'information-sharing', title: 'Information Sharing', icon: <Users className="w-4 h-4" /> },
    { id: 'data-security', title: 'Data Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'community-standards', title: 'Community Standards', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'user-rights', title: 'User Rights', icon: <Lock className="w-4 h-4" /> },
    { id: 'legal-compliance', title: 'Legal Compliance', icon: <Globe className="w-4 h-4" /> }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 z-50">
        <div 
          className="h-full bg-gradient-to-r from-orange-600 to-purple-600 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-orange-400 transition-colors group text-sm" onClick={() => window.history.back()}>
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium text-lg">Back to Registration</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10  bg-orange-400 to-emerald-400 rounded-lg flex items-center justify-center">
                <Brain className="h-6 w-6 text-white animate-pulse" fill="currentColor" />
              </div>
              <span className="text-xl font-semibold text-gray-900">emoHub</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Table of Contents</h3>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-left group ${
                        activeSection === section.id
                          ? 'bg-gray-100/50 text-orange-500 shadow-lg'
                          : 'text-gray-700 hover:bg-white hover:shadow-md'
                      }`}
                    >
                      <span className={`${activeSection === section.id ? 'text-gray-700' : 'text-gray-400 group-hover:text-blue-600'}`}>
                        {section.icon}
                      </span>
                      <span className="text-sm font-medium">{section.title}</span>
                      <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${
                        activeSection === section.id ? 'rotate-90 text-gray-700' : 'text-gray-400 group-hover:text-blue-600'
                      }`} />
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="mb-16">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                  Privacy Policy & Terms
                </h1>
                <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Comprehensive guidelines on how we protect your privacy, handle your data, 
                  and maintain our community standards at emoHub.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Last Updated</h3>
                      <p className="text-gray-600">{new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <span>Effective immediately</span>
                    <span>•</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-16">
              <section id="overview" className="scroll-mt-24">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-orange-600 to-purple-600 rounded-full"></div>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    At emoHub, we are committed to protecting your privacy and ensuring the security of your personal information. 
                    This Privacy Policy outlines how we collect, use, share, and protect your data when you use our emotional 
                    wellness platform and community services.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="text-center p-6 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Data Protection</h3>
                      <p className="text-sm text-gray-600">Industry-leading security measures to protect your sensitive information</p>
                    </div>
                    
                    <div className="text-center p-6 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Privacy First</h3>
                      <p className="text-sm text-gray-600">Your emotional wellness data remains private and confidential</p>
                    </div>
                    
                    <div className="text-center p-6 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Community Safety</h3>
                      <p className="text-sm text-gray-600">Maintaining a safe and supportive environment for all users</p>
                    </div>
                  </div>
                </div>
              </section>

              <section id="information-collection" className="scroll-mt-24">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-orange-600 to-purple-600 rounded-full"></div>
                </div>
                
                <div className="space-y-8">
                  <div className="bg-white border border-gray-200 rounded-xl p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Account & Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="font-medium text-gray-900">Basic Information</p>
                            <p className="text-sm text-gray-600">Name, email address, username, and profile picture</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="font-medium text-gray-900">Preferences</p>
                            <p className="text-sm text-gray-600">Communication preferences, privacy settings, optional completed of occupation and bio, and notification,</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="font-medium text-gray-900">Optional Demographics</p>
                            <p className="text-sm text-gray-600">Age, location (general), and wellness goals</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Wellness & Activity Data</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="font-medium text-gray-900">Emotional Check-ins</p>
                            <p className="text-sm text-gray-600">Emotions/ tracking, emotional state entries, and personal reflections</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="font-medium text-gray-900">Challenge Participation</p>
                            <p className="text-sm text-gray-600">Progress tracking, completion status, and achievement data</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="font-medium text-gray-900">Community Interactions</p>
                            <p className="text-sm text-gray-600">Forum posts, comments, group discussions, and peer support activities</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="font-medium text-gray-900">Reports</p>
                            <p className="text-sm text-gray-600">Challenges completion, last logged in, and platform interaction tracking</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section id="data-usage" className="scroll-mt-24">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Data</h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-orange-600 to-purple-600 rounded-full"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border border-blue-200">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-blue-900">Platform Personalization</h3>
                    </div>
                    <ul className="space-y-3 text-blue-800">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 mt-0.5 text-blue-600 flex-shrink-0" />
                        <span>Customize your emotional wellness journey and recommendations</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 mt-0.5 text-blue-600 flex-shrink-0" />
                        <span>Suggest relevant challenges, resources, and community connections</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 mt-0.5 text-blue-600 flex-shrink-0" />
                        <span>Improve platform features</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 border border-green-200">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-green-900">Community Safety</h3>
                    </div>
                    <ul className="space-y-3 text-green-800">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 mt-0.5 text-green-600 flex-shrink-0" />
                        <span>Maintain a supportive and harassment-free environment</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 mt-0.5 text-green-600 flex-shrink-0" />
                        <span>Moderate content to ensure adherence to community guidelines</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 mt-0.5 text-green-600 flex-shrink-0" />
                        <span>Provide crisis support resources and intervention when necessary</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="information-sharing" className="scroll-mt-24">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing Policy</h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-orange-600 to-purple-600 rounded-full"></div>
                </div>
                
                <div className="space-y-8">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-8">
                    <h3 className="text-xl font-semibold text-green-900 mb-6 flex items-center">
                      <CheckCircle className="w-6 h-6 mr-3 text-green-600" />
                      What We May Share
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="font-medium text-green-900">Public Content</p>
                            <p className="text-sm text-green-700">Forum posts and public discussions you choose to share</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="font-medium text-green-900">Legal Requirements</p>
                            <p className="text-sm text-green-700">Information required by law or to prevent imminent harm</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-xl p-8">
                    <h3 className="text-xl font-semibold text-red-900 mb-6 flex items-center">
                      <Lock className="w-6 h-6 mr-3 text-red-600" />
                      What We Never Share
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="font-medium text-red-900">Personal Wellness Data</p>
                            <p className="text-sm text-red-700">Your emotional check-ins, private reflections, and personal growth data</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="font-medium text-red-900">Private Communications</p>
                            <p className="text-sm text-red-700">Direct messages, private group discussions, and confidential conversations</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="font-medium text-red-900">Commercial Purposes</p>
                            <p className="text-sm text-red-700">Individual user data with advertisers or third-party marketers</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="font-medium text-red-900">Unauthorized Access</p>
                            <p className="text-sm text-red-700">Any information without proper consent or legal obligation</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Data Security */}
              <section id="data-security" className="scroll-mt-24">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security & Protection</h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-orange-600 to-purple-600 rounded-full"></div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-indigo-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-indigo-900 mb-6">Technical Safeguards</h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Shield className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-indigo-900">End-to-End Encryption</p>
                            <p className="text-sm text-indigo-700">All sensitive data is encrypted both in transit and at rest</p>
                          </div>
                        </div>
                        
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Eye className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-indigo-900">AI Moderator Security Audits</p>
                            <p className="text-sm text-indigo-700">Comphensive assessments by AI to ensure security in the platform</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-purple-900 mb-6">Access Controls</h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Users className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-purple-900">Limited Staff Access</p>
                            <p className="text-sm text-purple-700">Strict role-based access control with regular reviews</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Globe className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-purple-900">Incident Response</p>
                            <p className="text-sm text-purple-700">24/7 monitoring with rapid response protocols</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Community Standards */}
              <section id="community-standards" className="scroll-mt-24">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Community Standards</h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-orange-600 to-purple-600 rounded-full"></div>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-8">
                  <h3 className="text-xl font-semibold text-orange-900 mb-6">Core Community Values</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Empathy & Respect</h4>
                      <p className="text-sm text-gray-600">Treating all community members with kindness and understanding</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-6 h-6 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Safety & Support</h4>
                      <p className="text-sm text-gray-600">Creating a safe space for emotional growth and healing</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Inclusive Community</h4>
                      <p className="text-sm text-gray-600">Welcoming all individuals regardless of background or experience</p>
                    </div>
                  </div>
                </div>
              </section>

              <section id="user-rights" className="scroll-mt-24">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Privacy Rights</h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-orange-600 to-purple-600 rounded-full"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-teal-50 border border-teal-200 rounded-xl p-8">
                    <h3 className="text-xl font-semibold text-teal-900 mb-6">Data Control Rights</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Eye className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-teal-900">Access Your Data</p>
                          <p className="text-sm text-teal-700">Request a complete copy of your personal information</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-teal-900">Update & Correct</p>
                          <p className="text-sm text-teal-700">Modify or correct your personal information at any time</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Lock className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-teal-900">Delete Your Account</p>
                          <p className="text-sm text-teal-700">Permanently remove your account and associated data</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-8">
                    <h3 className="text-xl font-semibold text-cyan-900 mb-6">Communication Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-cyan-900">Email Notifications</p>
                          <p className="text-sm text-cyan-700">Control all email communications and updates</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-cyan-900">Privacy Settings</p>
                          <p className="text-sm text-cyan-700">Customize who can see your profile and activity</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Globe className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-cyan-900">Data Portability</p>
                          <p className="text-sm text-cyan-700">Export your data in a machine-readable format</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section id="legal-compliance" className="scroll-mt-24">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Legal Updates</h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-orange-600 to-purple-600 rounded-full"></div>
                </div>
                
                <div className="space-y-8">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Policy Updates</h3>
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 mb-6">
                        We may update this Privacy Policy periodically to reflect changes in our practices, 
                        legal requirements, or platform enhancements. Material changes will be communicated 
                        through multiple channels to ensure transparency.
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Privacy Questions</h4>
                        <div className="space-y-3 text-gray-700">
                          <p><strong>Email:</strong> privacy@emohub.com</p>
                          <p><strong>Response Time:</strong> Within 48 hours</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Thank you for taking the time to understand our privacy practices. 
                  Your trust and well-being are our highest priorities.
                </p>
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                  <span>© 2025 emoHub</span>
                  <span>•</span>
                  <span>•</span>
                  <span>Last Updated: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyTermsPage;