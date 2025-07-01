"use client";
import React, { useEffect, useState } from 'react';
import { Users, ArrowRight, Brain, Heart, Sun, Zap } from 'lucide-react';

const EmotionalIntelligenceHero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [titleText, setTitleText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isWritingComplete, setIsWritingComplete] = useState(false);

  const fullTitle = "Transform Your Emotional Life";
  const writingSpeed = 100;

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

  useEffect(() => {
    if (!isLoaded) return;

    const timer = setTimeout(() => {
      let currentIndex = 0;
      
      const typeWriter = () => {
        if (currentIndex < fullTitle.length) {
          setTitleText(fullTitle.slice(0, currentIndex + 1));
          currentIndex++;
          setTimeout(typeWriter, writingSpeed);
        } else {
          setIsWritingComplete(true);
          setTimeout(() => setShowCursor(false), 2000);
        }
      };

      typeWriter();
    }, 1000);

    return () => clearTimeout(timer);
  }, [isLoaded]);

  useEffect(() => {
    if (!showCursor) return;

    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        ></div>
        <div 
          className="absolute bottom-32 right-1/3 w-80 h-80 bg-gradient-to-br from-red-500/15 to-amber-600/15 rounded-full blur-3xl animate-pulse delay-700 transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * 0.015}px)`
          }}
        ></div>
      </div>

      {/* African pattern decorations */}
      <div className="absolute top-8 right-20 grid grid-cols-8 gap-1 opacity-30">
        {[...Array(40)].map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-pulse" style={{animationDelay: `${i * 100}ms`}}></div>
        ))}
      </div>

      {/* Main container */}
      <div className="container mx-auto px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          
          {/* Left Content Section */}
          <div className={`space-y-8 lg:pr-8 transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>

            {/* Main Heading with Typewriter */}
            <div className="space-y-6">
              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] transition-all duration-1000 delay-200 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                {titleText.split(' ').map((word, wordIndex) => {
                  if (word === 'Emotional') {
                    return (
                      <span key={wordIndex} className="relative inline-block mr-3">
                        <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent font-extrabold">
                          {word}
                        </span>
                        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-600/60 via-red-600/60 to-orange-600/60 rounded-full animate-pulse"></div>
                      </span>
                    );
                  }
                  return <span key={wordIndex} className="mr-3">{word}</span>;
                })}
                {!isWritingComplete && (
                  <span className={`inline-block w-1 bg-amber-800 ml-2 ${showCursor ? 'opacity-100' : 'opacity-0'}`} style={{height: '1.2em'}}>|</span>
                )}
              </h1>
              
              <p className={`text-lg text-gray-600 leading-relaxed max-w-lg transition-all duration-1000 delay-400 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                Transform isolation into Ubuntu - the African philosophy that "I am because we are". 
                Build emotional strength through community, where your emotional intelligence contributes to collective resilience.
              </p>
            </div>

            {/* Action Buttons */}
            <div className={`flex flex-col sm:flex-row gap-5 pt-4 transition-all duration-1000 delay-600 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <button 
                className="group relative bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl shadow-amber-600/30 hover:shadow-red-600/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 overflow-hidden"
                onClick={() => window.location.href = '/register'}
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                <Sun className="relative z-10 h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
                <span className="relative z-10">Begin Your Journey</span>
                <ArrowRight className="relative z-10 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-red-600 rounded-xl blur opacity-0 group-hover:opacity-60 transition-opacity duration-300 -z-10"></div>
              </button>
              
              <button className="group flex items-center space-x-4 text-amber-700 hover:text-amber-900 transition-colors px-6 py-4 rounded-xl border-2 border-amber-200 hover:border-amber-300 hover:bg-amber-50">
                <Heart className="w-6 h-6 group-hover:animate-pulse" fill="currentColor" />
                <span className="font-semibold text-lg">Join Community</span>
              </button>
            </div>

            {/* Feature Pills */}
            <div className={`flex flex-wrap justify-start gap-4 pt-6 transition-all duration-1000 delay-800 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-amber-100 hover:shadow-md transition-all duration-300 hover:scale-105">
                <Brain className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-gray-700">Emotional Intelligence</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-amber-100 hover:shadow-md transition-all duration-300 hover:scale-105">
                <Users className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-gray-700">Ubuntu Community</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-amber-100 hover:shadow-md transition-all duration-300 hover:scale-105">
                <Zap className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-gray-700">Collective Healing</span>
              </div>
            </div>
          </div>

          {/* Right Content - Visual Section */}
          <div className={`relative lg:pl-8 transition-all duration-1000 delay-300 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {/* Decorative African-inspired curve */}
            <div className="absolute -top-6 -left-6 w-32 h-32 opacity-20 pointer-events-none">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path
                  d="M20,60 Q40,20 60,40 Q80,60 70,80"
                  stroke="#D97706"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="6,4"
                  className="animate-pulse"
                />
                <circle cx="30" cy="50" r="4" fill="#DC2626" className="animate-ping" />
                <circle cx="70" cy="30" r="3" fill="#F59E0B" className="animate-pulse" />
              </svg>
            </div>

            {/* Overlapping emotional intelligence themed images */}
            <div className="relative">
              {/* Large main image - meditation/mindfulness */}
              <div className="relative z-10">
                <div className="w-80 h-80 rounded-full overflow-hidden shadow-2xl bg-gradient-to-br from-amber-100 to-orange-100 p-3 hover:shadow-3xl transition-all duration-500 hover:scale-105">
                  <img 
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Person in peaceful meditation, emotional awareness"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>

              {/* Medium overlapping image - community connection */}
              <div className="absolute -top-8 right-12 z-20">
                <div className="w-48 h-48 rounded-full overflow-hidden shadow-xl bg-gradient-to-br from-red-100 to-amber-100 p-2 hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <img 
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                    alt="Diverse group in supportive circle, Ubuntu community"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>

              {/* Small overlapping image - emotional growth */}
              <div className="absolute bottom-8 -left-6 z-30">
                <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg bg-gradient-to-br from-orange-100 to-yellow-100 p-1.5 hover:shadow-xl transition-all duration-500 hover:scale-105">
                  <img 
                    src="https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="Hands forming heart shape, emotional intelligence"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>

              {/* Floating accent elements with emotional intelligence theme */}
              <div className="absolute top-16 -right-2 w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg z-40 animate-bounce-slow">
                <Brain className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              
              <div className="absolute bottom-32 left-16 w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full shadow-md flex items-center justify-center z-40 animate-pulse">
                <Heart className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              
              <div className="absolute top-40 left-8 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-sm opacity-80 z-40 animate-ping"></div>

              {/* Ubuntu symbol */}
              <div className="absolute top-1/2 right-4 w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex items-center justify-center shadow-lg z-40 transform rotate-12 animate-pulse">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decorative gradients */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-r from-amber-50 via-transparent to-orange-50 opacity-40 pointer-events-none"></div>
      <div className="absolute top-1/3 right-0 w-40 h-96 bg-gradient-to-l from-red-50 to-transparent opacity-30 pointer-events-none"></div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default EmotionalIntelligenceHero;