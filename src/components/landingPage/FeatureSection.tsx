"use client"
import React, { useState } from 'react';
import { Heart, Users, BookOpen, TrendingUp, Star, Menu, X, ArrowRight, Brain, Target, MessageCircle, Shield, Lightbulb, BarChart3, Calendar, GraduationCap, ChevronDown, Plus, Minus, Sparkles } from 'lucide-react';

export const FeaturesSection = () => {
  const features = [
    {
      icon: <BarChart3 className="h-10 w-10" />,
      title: "Mood Tracking & Analytics",
      description: "Visualize your emotional patterns with beautiful charts and gain insights into your mental wellness journey.",
      image: "📊",
      gradient: "from-rose-500 to-amber-500",
      bgPattern: "from-rose-500/10 to-amber-500/10"
    },
    {
      icon: <Calendar className="h-10 w-10" />,
      title: "Daily Emotional Challenges",
      description: "Grow stronger every day with personalized challenges designed to build emotional resilience and awareness.",
      image: "🎯",
      gradient: "from-amber-500 to-emerald-500",
      bgPattern: "from-amber-500/10 to-emerald-500/10"
    },
    {
      icon: <GraduationCap className="h-10 w-10" />,
      title: "Learning Modules",
      description: "Master emotional intelligence through interactive courses, videos, and practical exercises from experts.",
      image: "📚",
      gradient: "from-emerald-500 to-rose-500",
      bgPattern: "from-emerald-500/10 to-rose-500/10"
    },
    {
      icon: <MessageCircle className="h-10 w-10" />,
      title: "Community Discussions",
      description: "Join supportive conversations, share experiences, and connect with others on similar emotional journeys.",
      image: "💬",
      gradient: "from-rose-400 to-emerald-400",
      bgPattern: "from-rose-400/10 to-emerald-400/10"
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-br from-rose-50/50 via-amber-50/30 to-emerald-50/40 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-br from-rose-300/20 to-amber-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-emerald-300/15 to-rose-300/15 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Powerful{' '}
            <span className="bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 bg-clip-text text-transparent">
              Features
            </span>
            {' '}for Growth
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to understand your emotions, build resilience, and connect with others meaningfully.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 border border-white/50 overflow-hidden"
            >
              {/* Animated background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgPattern} opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-3xl`}></div>
              
              {/* Top decorative line */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
              
              {/* Main content container */}
              <div className="relative z-10">
                {/* Header section with icon and title */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    {/* Enhanced Icon */}
                    <div className={`relative w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                      {feature.icon}
                      {/* Icon glow effect */}
                      <div className={`absolute -inset-1 bg-gradient-to-br ${feature.gradient} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10`}></div>
                    </div>
                    
                    {/* Title */}
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 group-hover:text-rose-600 transition-colors duration-300">
                        {feature.title}
                      </h3>
                    </div>
                  </div>

                  {/* Floating sparkle */}
                  <div className="opacity-0 group-hover:opacity-60 transition-opacity duration-500">
                    <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-600 leading-relaxed text-lg mb-6 group-hover:text-slate-700 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Bottom section with emoji and action hint */}
                <div className="flex items-center justify-between">
                  {/* Large emoji with animation */}
                  <div className="text-5xl opacity-30 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500">
                    {feature.image}
                  </div>
                  
                  {/* Action indicator */}
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                    <div className="flex items-center space-x-2 text-sm font-medium text-slate-500">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating particles effect */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-r from-rose-400 to-amber-400 rounded-full animate-bounce opacity-60"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1.5 + Math.random()}s`
                    }}
                  />
                ))}
              </div>

              {/* Corner decoration */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                <div className={`w-8 h-8 bg-gradient-to-br ${feature.gradient} rounded-full`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom decorative element */}
        <div className="flex justify-center mt-16">
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-rose-400 rounded-full animate-pulse"></div>
            <div className="w-20 h-1 bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-400 rounded-full"></div>
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse delay-500"></div>
          </div>
        </div>
      </div>
    </section>
  );
};