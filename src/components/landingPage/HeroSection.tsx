"use client"
import React, { useEffect, useState } from 'react';
import { ArrowRight, Heart, Sparkles, Users, Brain, Star, Zap } from 'lucide-react';

export const EmoHubHero: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-rose-50 via-amber-50/30 to-emerald-50/40 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div 
          className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-br from-rose-300/30 to-pink-400/30 rounded-full blur-3xl animate-pulse transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        ></div>
        <div 
          className="absolute bottom-32 right-1/3 w-80 h-80 bg-gradient-to-br from-amber-300/25 to-orange-400/25 rounded-full blur-3xl animate-pulse delay-700 transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * 0.015}px)`
          }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-300/20 to-teal-400/20 rounded-full blur-3xl animate-pulse delay-1000 transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * -0.01}px) translate(-50%, -50%)`
          }}
        ></div>
        
        <div className="absolute top-1/4 right-1/4 w-32 h-32 border border-rose-200/30 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute bottom-1/4 left-1/5 w-24 h-24 border border-amber-200/40 rounded-lg rotate-45 animate-pulse delay-500"></div>
        
        <div className="absolute top-1/3 left-1/6 w-16 h-16 border-2 border-emerald-200/40 rounded-full animate-ping delay-300"></div>
        <div className="absolute bottom-1/3 right-1/5 w-20 h-20 border border-rose-200/30 rotate-12 animate-bounce" style={{ animationDuration: '3s' }}></div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/8 animate-float delay-100">
          <Brain className="w-8 h-8 text-rose-300/60 animate-pulse" fill="currentColor" />
        </div>
        <div className="absolute top-2/3 right-1/8 animate-float delay-700">
          <Brain className="w-6 h-6 text-rose-400/50 animate-pulse delay-500" fill="currentColor" />
        </div>
        
        <div className="absolute top-1/6 right-1/4 animate-float delay-300">
          <Star className="w-10 h-10 text-amber-300/50 animate-pulse delay-200" fill="currentColor" />
        </div>
        <div className="absolute bottom-1/5 left-1/3 animate-float delay-900">
          <Star className="w-7 h-7 text-amber-400/60 animate-pulse delay-800" fill="currentColor" />
        </div>
        
        <div className="absolute top-1/3 right-1/6 animate-float delay-500">
          <Sparkles className="w-9 h-9 text-emerald-300/50 animate-pulse delay-300" />
        </div>
        <div className="absolute bottom-1/4 left-1/4 animate-float delay-1100">
          <Sparkles className="w-6 h-6 text-emerald-400/60 animate-pulse delay-600" />
        </div>
        
        <div className="absolute top-3/4 right-1/3 animate-float delay-400">
          <Zap className="w-8 h-8 text-amber-300/50 animate-pulse delay-400" fill="currentColor" />
        </div>
        <div className="absolute top-1/5 left-2/5 animate-float delay-800">
          <Zap className="w-5 h-5 text-rose-300/60 animate-pulse delay-700" fill="currentColor" />
        </div>
        
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path
            d="M 200 150 Q 400 200 600 180 T 1000 160"
            stroke="url(#connectionGradient)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
            strokeDasharray="5,5"
          />
          <path
            d="M 100 400 Q 300 350 500 380 T 900 370"
            stroke="url(#connectionGradient)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse delay-500"
            strokeDasharray="3,7"
          />
        </svg>
      </div>

      <div className={`relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-1000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-white/50 mb-8 transition-all duration-700 hover:shadow-xl hover:scale-105 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-amber-400 rounded-full flex items-center justify-center animate-pulse">
            <Brain className="w-4 h-4 text-white" fill="currentColor" />
          </div>
          <span className="text-slate-700 font-semibold text-lg">emoHub</span>
        </div>

        <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-bold text-slate-800 mb-6 leading-tight transition-all duration-1000 delay-200 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          Your Journey to{' '}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 bg-clip-text text-transparent animate-gradient">
              Emotional Freedom
            </span>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-rose-500/50 via-amber-500/50 to-emerald-500/50 rounded-full animate-pulse"></div>
            <div className="absolute -top-2 -right-2 animate-ping delay-1000">
              <Sparkles className="w-4 h-4 text-amber-500/60" />
            </div>
          </span>
          {' '}Starts Here
        </h1>

        <p className={`text-body-medium sm:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          Transform isolation into connection. Build emotional resilience that lasts. 
          Join a community where your feelings matter and your growth is celebrated.
        </p>

        <div className={`mb-16 transition-all duration-1000 delay-600 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <button className="group relative bg-gradient-to-r from-rose-500 to-amber-500 text-white px-12 py-5 rounded-2xl text-xl font-semibold shadow-2xl shadow-rose-500/30 hover:shadow-rose-500/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto overflow-hidden hover:animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <span className="relative z-10">Get Started</span>
            <ArrowRight className="relative z-10 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
            <div className="absolute -inset-1 bg-gradient-to-r from-rose-400 to-amber-400 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
          </button>
        </div>

        <div className={`flex flex-wrap justify-center gap-6 sm:gap-8 transition-all duration-1000 delay-800 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="flex items-center gap-2 text-slate-600 hover:text-rose-500 transition-colors duration-300 group">
            <Brain className="w-5 h-5 group-hover:animate-pulse" />
            <span className="text-sm font-medium">Emotional intelligence tools</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 hover:text-amber-500 transition-colors duration-300 group">
            <Users className="w-5 h-5 group-hover:animate-pulse" />
            <span className="text-sm font-medium">Supportive Community</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 hover:text-emerald-500 transition-colors duration-300 group">
            <Heart className="w-5 h-5 group-hover:animate-pulse" fill="currentColor" />
            <span className="text-sm font-medium">Personal Growth</span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-gradient-to-r from-rose-400 to-amber-400 rounded-full opacity-60 animate-bounce`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
        {[...Array(8)].map((_, i) => (
          <div
            key={`star-${i}`}
            className={`absolute w-1 h-1 bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full opacity-50 animate-ping`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(2deg); }
          50% { transform: translateY(-20px) rotate(-2deg); }
          75% { transform: translateY(-10px) rotate(1deg); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default EmoHubHero;