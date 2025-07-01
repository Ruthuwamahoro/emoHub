"use client"
import React from 'react';
import { ArrowRight, MessageCircle, BarChart3, Calendar, GraduationCap, Sparkles } from 'lucide-react';

export const FeaturesSection = () => {

  const features = [
    {
      icon: <BarChart3 className="h-8 w-8 sm:h-10 sm:w-10" />,
      title: "Emotions Tracking & Analytics",
      description: "Visualize your emotional patterns with beautiful charts and gain insights into your mental wellness journey.",
      image: "📊",
      gradient: "from-amber-500 to-amber-500",
      bgPattern: "from-amber-500/10 to-amber-500/10"
    },
    {
      icon: <Calendar className="h-8 w-8 sm:h-10 sm:w-10" />,
      title: "Daily Emotional Challenges",
      description: "Grow stronger every day with personalized challenges designed to build emotional resilience and awareness.",
      image: "🎯",
      gradient: "from-amber-500 to-amber-500",
      bgPattern: "from-amber-500/10 to-amber-500/10"
    },
    {
      icon: <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10" />,
      title: "Learning Resources",
      description: "Master emotional intelligence through interactive articles, videos, from experts.",
      image: "📚",
      gradient: "from-amber-500 to-amber-500",
      bgPattern: "from-amber-500/10 to-amber-500/10"
    },
    {
      icon: <MessageCircle className="h-8 w-8 sm:h-10 sm:w-10" />,
      title: "Group/Community Discussions",
      description: "Join supportive conversations, share experiences, and connect with others on similar emotional journeys.",
      image: "💬",
      gradient: "from-amber-500 to-amber-500",
      bgPattern: "from-amber-500/10 to-amber-500/10"
    }
  ];

  return (
    <section id="features" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-amber-50 via-white to-orange-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 sm:top-16 md:top-20 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gradient-to-br from-rose-300/20 to-amber-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 sm:bottom-16 md:bottom-20 right-1/4 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 bg-gradient-to-br from-emerald-300/15 to-rose-300/15 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 sm:mb-6">
            Powerful{' '}
            <span className="bg-amber-500 to-emerald-500 bg-clip-text text-transparent font-bold">
              Features
            </span>
            {' '}for Growth
          </h3>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-2">
            Everything you need to understand your emotions, build resilience, and connect with others meaningfully.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-1 sm:hover:-translate-y-3 border border-white/50 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgPattern} opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-2xl sm:rounded-3xl`}></div>
              
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className={`relative w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg flex-shrink-0`}>
                      {feature.icon}
                      <div className={`absolute -inset-1 bg-gradient-to-br ${feature.gradient} rounded-xl sm:rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10`}></div>
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 transition-colors duration-300 leading-tight">
                        {feature.title}
                      </h3>
                    </div>
                  </div>

                  <div className="opacity-0 group-hover:opacity-60 transition-opacity duration-500 hidden sm:block flex-shrink-0">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 animate-pulse" />
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed text-sm sm:text-base md:text-lg mb-4 sm:mb-6 group-hover:text-slate-700 transition-colors duration-300">
                  {feature.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="text-3xl sm:text-4xl md:text-5xl opacity-30 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500">
                    {feature.image}
                  </div>
                  
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0 hidden sm:block">
                    <div className="flex items-center space-x-2 text-xs sm:text-sm font-medium text-slate-500">
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 hidden sm:block">
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

              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br ${feature.gradient} rounded-full`}></div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12 sm:mt-16">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-rose-400 rounded-full animate-pulse"></div>
            <div className="w-16 h-0.5 sm:w-20 sm:h-1 bg-gradient-to-r from-rose-400 via-amber-400 to-amber-400 rounded-full"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-amber-400 rounded-full animate-pulse delay-500"></div>
          </div>
        </div>
      </div>
    </section>
  );
};