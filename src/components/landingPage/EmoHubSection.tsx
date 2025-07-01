import React from 'react';
import {Users, Brain, MessageCircle, Shield} from 'lucide-react';

export const WhyEmoHubSection = () => {
  const benefits = [
    {
      icon: <Brain className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-amber-500" />,
      title: "Emotional Growth",
      description: "Develop deeper self-awareness and emotional intelligence through guided exercises and personalized insights.",
      gradient: "bg-white"
    },
    {
      icon: <Users className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-amber-500" />,
      title: "Breaking Isolation",
      description: "Connect with a supportive community that understands your journey and celebrates your progress.",
      gradient: "bg-white"
    },
    {
      icon: <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-amber-500" />,
      title: "Peer Support",
      description: "Engage in meaningful conversations and receive encouragement from people who truly understand.",
      gradient: "bg-white"
    },
    {
      icon: <Shield className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-amber-500" />,
      title: "Resilience Building",
      description: "Learn practical tools and strategies to bounce back stronger from life's challenges and setbacks.",
      gradient: "bg-white"
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-gray-100 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      <div className="absolute top-4 sm:top-6 lg:top-8 left-1/2 transform -translate-x-1/2 w-12 sm:w-14 lg:w-16 h-0.5 bg-gradient-to-r from-rose-400 to-amber-400 rounded-full"></div>
      
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 sm:mb-6">
            Why Choose{' '}
            <span className="bg-amber-500 font-bold bg-clip-text text-transparent">
              emoHub?
            </span>
          </h3>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            We believe everyone deserves emotional wellness and genuine human connection.
            Here's how we're different from other platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 px-4 sm:px-8 lg:px-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group relative bg-white backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-7 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 sm:hover:-translate-y-3 border border-white/50 hover:border-rose-200/50"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-10 rounded-2xl sm:rounded-3xl transition-opacity duration-500`}></div>
              
              <div className={`relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${benefit.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center text-white mb-4 sm:mb-5 lg:mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                {benefit.icon}
              </div>
              
              <h3 className="relative font-medium text-lg sm:text-xl text-slate-900 mb-3 sm:mb-4 group-hover:text-amber-500 transition-colors duration-300">
                {benefit.title}
              </h3>
              
              <p className="relative text-slate-600 leading-relaxed text-sm sm:text-base lg:text-lg">
                {benefit.description}
              </p>
              
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-br from-rose-400 to-amber-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12 sm:mt-14 lg:mt-16">
          <div className="w-16 sm:w-20 lg:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-400 rounded-full opacity-50"></div>
        </div>
      </div>
    </section>
  );
};