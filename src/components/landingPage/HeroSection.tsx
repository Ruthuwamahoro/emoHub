"use client"
import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, Heart, Users, Brain, Sun, Zap } from 'lucide-react';

export const EmoHubHero: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [titleText, setTitleText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isWritingComplete, setIsWritingComplete] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const fullTitle = "Your Journey to Emotional Life Starts Here";
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
    <section className="relative min-h-screen  flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="africanPattern1" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle cx="40" cy="40" r="20" fill="none" stroke="#d97706" strokeWidth="2"/>
                <path d="M20,20 L60,20 L60,60 L20,60 Z" fill="none" stroke="#dc2626" strokeWidth="1"/>
                <polygon points="40,25 45,35 55,35 47,42 50,52 40,47 30,52 33,42 25,35 35,35" fill="#d97706"/>
              </pattern>
              <pattern id="africanPattern2" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M30,5 L55,30 L30,55 L5,30 Z" fill="none" stroke="#dc2626" strokeWidth="2"/>
                <circle cx="30" cy="30" r="8" fill="#d97706"/>
                <path d="M15,15 L45,15 M15,45 L45,45" stroke="#dc2626" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#africanPattern1)"/>
            <rect x="40" y="40" width="100%" height="100%" fill="url(#africanPattern2)"/>
          </svg>
        </div>

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
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-orange-400/10 to-red-400/10 rounded-full blur-3xl animate-pulse delay-1000 transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * -0.01}px) translate(-50%, -50%)`
          }}
        ></div>
        

      </div>

      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <linearGradient id="africanLineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#dc2626" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <path
            d="M 150 120 Q 350 180 550 150 T 850 140"
            stroke="url(#africanLineGradient)"
            strokeWidth="4"
            fill="none"
            className="animate-pulse"
            strokeDasharray="12,8"
          />
          <path
            d="M 100 350 Q 280 300 480 330 T 800 320"
            stroke="url(#africanLineGradient)"
            strokeWidth="3"
            fill="none"
            className="animate-pulse delay-500"
            strokeDasharray="8,8"
          />
        </svg>
      </div>

      <div className={`relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-1000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className={`inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-amber-100/90 to-orange-100/90 backdrop-blur-sm shadow-lg border border-amber-200/60 mb-8 transition-all duration-700 hover:shadow-xl hover:scale-105 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          <div className="w-10 h-10 bg-[#fb923c] rounded-full flex items-center justify-center animate-pulse">
            <Brain className="w-5 h-5 text-white" fill="currentColor" />
          </div>
          <span className="text-black text-xl tracking-wide">emoHub</span>
          <div className="w-2 h-2 bg-[#fb923c] rounded-full animate-ping"></div>
        </div>

        <div className="relative mb-8">
          <h1 
            ref={titleRef}
            className={`text-4xl sm:text-6xl lg:text-7xl  text-black leading-tight transition-all duration-1000 delay-200 ${
              isLoaded ? 'opacity-100 translate-y-0 ' : 'opacity-0 translate-y-8'
            }`}
          >
            {titleText.split(' ').map((word, wordIndex) => {
              if (word === 'Life') {
                return (
                  <span key={wordIndex} className="relative inline-block mx-2">
                    <span className="bg-[#fb923c] bg-clip-text text-transparent animate-gradient font-extrabold">
                      {word}
                    </span>
                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-600/60 via-red-600/60 to-orange-600/60 rounded-full animate-pulse"></div>
                  </span>
                );
              }
              return <span key={wordIndex} className="mx-2 font-bold">{word}</span>;
            })}
            {!isWritingComplete && (
              <span className={`inline-block w-1 bg-amber-800 ml-2 animate-pulse ${showCursor ? 'opacity-100' : 'opacity-0'}`} style={{height: '1.2em'}}>|</span>
            )}
          </h1>
          
          {!isWritingComplete && titleText && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-16 animate-writing pointer-events-none">
              <div className="relative">
                <div className="w-8 h-12 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full transform rotate-12 shadow-lg">
                  <div className="absolute bottom-0 left-1/2 w-3 h-4 bg-gradient-to-br from-amber-800 to-red-800 rounded-full transform -translate-x-1/2 translate-y-1"></div>
                </div>
                <div className="absolute -bottom-2 left-1/2 w-1 h-8 bg-amber-600/60 transform -translate-x-1/2 animate-pulse"></div>
              </div>
            </div>
          )}
        </div>

        <p className={`text-xl sm:text-2xl text-amber-800 mb-12 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          Transform isolation into Ubuntu - the African philosophy that "I am because we are". 
          Build emotional strength through community, where your emotional intelligence contributes to resilence.
        </p>

        <div className={`mb-16 transition-all duration-1000 delay-600 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <button className="group relative bg-[#fb923c]  text-white px-12 py-6 rounded-2xl text-xl font-bold shadow-2xl shadow-amber-600/30 hover:shadow-red-600/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-4 mx-auto overflow-hidden" onClick={()=> window.location.href = '/register'}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            <Sun className="relative z-10 h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
            <span className="relative z-10">Begin Your Journey</span>
            <ArrowRight className="relative z-10 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-red-600 rounded-2xl blur opacity-0 group-hover:opacity-60 transition-opacity duration-300 -z-10"></div>
          </button>
        </div>

        <div className={`flex flex-wrap justify-center gap-8 transition-all duration-1000 delay-800 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="flex items-center gap-3 text-amber-800 hover:text-red-700 transition-colors duration-300 group cursor-pointer">
            <Brain className="w-6 h-6 group-hover:animate-pulse" />
            <span className="text-base font-semibold">Emotional Intelligence</span>
          </div>
          <div className="flex items-center gap-3 text-amber-800 hover:text-red-700 transition-colors duration-300 group cursor-pointer">
            <Users className="w-6 h-6 group-hover:animate-pulse" />
            <span className="text-base font-semibold">Ubuntu Community Spirit</span>
          </div>
          <div className="flex items-center gap-3 text-amber-800 hover:text-red-700 transition-colors duration-300 group cursor-pointer">
            <Heart className="w-6 h-6 group-hover:animate-pulse" fill="currentColor" />
            <span className="text-base font-semibold">Collective Healing Journey</span>
          </div>
        </div>
      </div>


      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-15px) rotate(3deg); }
          50% { transform: translateY(-25px) rotate(-3deg); }
          75% { transform: translateY(-15px) rotate(2deg); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes writing {
          0%, 100% { transform: translateX(-50%) translateY(0px) rotate(0deg); }
          50% { transform: translateX(-50%) translateY(-5px) rotate(5deg); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }
        
        .animate-writing {
          animation: writing 1s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        
        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </section>
  );
};

export default EmoHubHero;