import React from 'react';
import {Users, Brain, MessageCircle, Shield} from 'lucide-react';

export const WhyEmoHubSection = () => {
  const benefits = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Emotional Growth",
      description: "Develop deeper self-awareness and emotional intelligence through guided exercises and personalized insights.",
      gradient: "from-rose-500 to-amber-500"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Breaking Isolation",
      description: "Connect with a supportive community that understands your journey and celebrates your progress.",
      gradient: "from-amber-500 to-emerald-500"
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Peer Support",
      description: "Engage in meaningful conversations and receive encouragement from people who truly understand.",
      gradient: "from-emerald-500 to-rose-500"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Resilience Building",
      description: "Learn practical tools and strategies to bounce back stronger from life's challenges and setbacks.",
      gradient: "from-rose-400 to-emerald-400"
    }
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-rose-400 to-emerald-400 rounded-full"></div>
      
      <div className="text-title-large mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h3 className="text-5xl md:text-title-large font-bold text-slate-900 mb-6">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 bg-clip-text text-transparent">
              emoHub?
            </span>
          </h3>
          <p className="text-body-medium text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We believe everyone deserves emotional wellness and genuine human connection.
            Here's how we're different from other platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-white/50 hover:border-rose-200/50 text-body-medium"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}></div>
              
              <div className={`relative w-16 h-16 bg-gradient-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                {benefit.icon}
              </div>
              
              <h3 className="relative font-bold text-slate-900 mb-4 group-hover:text-rose-600 transition-colors duration-300">
                {benefit.title}
              </h3>
              <p className="relative text-slate-600 leading-relaxed">
                {benefit.description}
              </p>
              
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
                <div className="w-3 h-3 bg-gradient-to-br from-rose-400 to-amber-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-16">
          <div className="w-24 h-1 bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-400 rounded-full opacity-50"></div>
        </div>
      </div>
    </section>
  );
};