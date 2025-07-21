"use client";
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, ArrowRight, Brain, Heart, Sun, Zap } from 'lucide-react';

export const EmoHubLanding = () => {
  const { t } = useTranslation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [titleText, setTitleText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isWritingComplete, setIsWritingComplete] = useState(false);

  const fullTitle = t('home.title');
  const writingSpeed = 100;

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e: { clientX: number; clientY: number; }) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Reset title animation when language changes
    setTitleText('');
    setIsWritingComplete(false);
    setShowCursor(true);
    
    if (!isLoaded || !fullTitle) return;

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
  }, [isLoaded, fullTitle]);

  useEffect(() => {
    if (!showCursor) return;

    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <div className="md:py-14 py-10 bg-gradient-to-br from-amber-50 via-white to-orange-50 relative overflow-hidden flex items-center" id="home">
      <div className="absolute inset-0">
        <div 
          className="absolute top-16 md:top-20 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        ></div>
        <div 
          className="absolute bottom-20 md:bottom-32 right-1/3 w-28 h-28 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 xl:w-80 xl:h-80 bg-gradient-to-br from-red-500/15 to-amber-600/15 rounded-full blur-3xl animate-pulse delay-700 transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * 0.015}px)`
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20 h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-col-2 gap-8 sm:gap-12 lg:gap-16 items-center max-w-7xl mx-auto w-full">
          
          <div className={`space-y-4 sm:space-y-6 lg:space-y-8 lg:pr-8 transition-all duration-1000 order-2 lg:order-1 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>

            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight sm:leading-[1.1] transition-all duration-1000 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                {titleText.split(' ').map((word, wordIndex) => {
                  // Check for emotional/Ubuntu related words in different languages
                  const emotionalWords = ['Emotional', 'Amarangamutima', 'Ubuntu'];
                  const isEmotionalWord = emotionalWords.some(emoWord => 
                    word.toLowerCase().includes(emoWord.toLowerCase())
                  );
                  
                  if (isEmotionalWord) {
                    return (
                      <span key={wordIndex} className="relative inline-block mr-2 sm:mr-3">
                        <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent font-extrabold">
                          {word}
                        </span>
                        <div className="absolute -bottom-0.5 sm:-bottom-1 lg:-bottom-2 left-0 right-0 h-0.5 sm:h-0.5 lg:h-1 bg-gradient-to-r from-orange-300 to-amber-400 rounded-full animate-pulse"></div>
                      </span>
                    );
                  }
                  return <span key={wordIndex} className="mr-2 sm:mr-3 font-bold">{word}</span>;
                })}
                {!isWritingComplete && (
                  <span className={`inline-block w-0.5 sm:w-0.5 lg:w-1 bg-amber-800 ml-1 sm:ml-2 ${showCursor ? 'opacity-100' : 'opacity-0'}`} style={{height: '1.2em'}}>|</span>
                )}
              </h1>
              
              <p className={`text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed max-w-lg transition-all duration-1000 delay-400 md:py-0 py-6 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                {t('home.subtitle')}
              </p>
            </div>

            {/* CTA Button */}
            <div className={`flex flex-col sm:flex-row gap-4 sm:gap-5 pt-2 sm:pt-4 lg:pt-6 transition-all duration-1000 delay-600 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <button 
                className="group relative bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base lg:text-lg shadow-2xl shadow-amber-600/30 hover:shadow-orange-600/40 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 overflow-hidden w-full sm:w-auto"
                onClick={() => window.location.href = '/register'}
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                <Sun className="relative z-10 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 group-hover:rotate-180 transition-transform duration-500" />
                <span className="relative z-10">{t('home.beginJourney')}</span>
                <ArrowRight className="relative z-10 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 group-hover:translate-x-2 transition-transform duration-300" />
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl blur opacity-0 group-hover:opacity-60 transition-opacity duration-300 -z-10"></div>
              </button>
            </div>

            {/* Feature Tags */}
            <div className={`flex flex-wrap justify-start gap-2 sm:gap-3 lg:gap-4 pt-3 sm:pt-4 lg:pt-6 transition-all duration-1000 delay-800 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/80 backdrop-blur-sm px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full shadow-sm border border-amber-100 hover:shadow-md transition-all duration-300 hover:scale-105">
                <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">{t('home.emotionalIntelligence')}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/80 backdrop-blur-sm px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full shadow-sm border border-amber-100 hover:shadow-md transition-all duration-300 hover:scale-105">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">{t('home.ubuntuCommunity')}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/80 backdrop-blur-sm px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full shadow-sm border border-amber-100 hover:shadow-md transition-all duration-300 hover:scale-105">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">{t('home.collectiveHealing')}</span>
              </div>
            </div>
          </div>

          {/* Visual Section - Hidden on mobile, visible from sm up */}
          <div className={`relative px-4 sm:px-0 lg:pl-8 order-1 lg:order-2 transition-all duration-1000 delay-300 hidden sm:block ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {/* Decorative SVG */}
            <div className="absolute -top-2 sm:-top-4 lg:-top-6 -left-2 sm:-left-4 lg:-left-6 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-32 xl:h-32 opacity-20 pointer-events-none">
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
            
            <div className="relative flex justify-center lg:justify-start" data-aos="slide-up" data-aos-duration="1000">
              {/* Main Image */}
              <div className="relative z-10">
                <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-2xl bg-gradient-to-br from-amber-100 to-orange-100 p-2 sm:p-3 hover:shadow-3xl transition-all duration-500 hover:scale-105">
                  <img 
                    src="https://i.pinimg.com/736x/71/03/71/7103715b95e36a59027f9b4c74770fcd.jpg"
                    alt={t('home.imageAlt1', 'Person in peaceful meditation, emotional awareness')}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>

              {/* Secondary Image - Top Right */}
              <div className="absolute -top-2 sm:-top-4 md:-top-6 lg:-top-8 right-2 sm:right-4 md:right-8 lg:right-12 z-20">
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-52 lg:h-52 rounded-full overflow-hidden shadow-xl bg-gradient-to-br from-red-100 to-amber-100 p-1 sm:p-1.5 md:p-2 hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <img 
                    src="https://i.pinimg.com/736x/68/bb/ff/68bbff44405e76289c884d221db18415.jpg"
                    alt={t('home.imageAlt2', 'Diverse group in supportive circle, Ubuntu community')}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>

              {/* Tertiary Image - Bottom Left */}
              <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 lg:bottom-8 -left-1 sm:-left-2 md:-left-4 lg:-left-6 z-30">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden shadow-lg bg-gradient-to-br from-orange-100 to-yellow-100 p-1 sm:p-1.5 hover:shadow-xl transition-all duration-500 hover:scale-105">
                  <img 
                    src="https://i.pinimg.com/736x/64/d0/4e/64d04ef0c7d226a6de2abb460a259bce.jpg"
                    alt={t('home.imageAlt3', 'Hands forming heart shape, emotional intelligence')}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              
              {/* Floating Heart Icon */}
              <div className="absolute bottom-12 sm:bottom-16 md:bottom-20 lg:bottom-24 xl:bottom-32 left-4 sm:left-6 md:left-8 lg:left-12 xl:left-16 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full shadow-md flex items-center justify-center z-40 animate-pulse">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" fill="currentColor" />
              </div>
              
              {/* Floating Dot */}
              <div className="absolute top-16 sm:top-20 md:top-24 lg:top-32 xl:top-40 left-2 sm:left-3 md:left-4 lg:left-6 xl:left-8 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-sm opacity-80 z-40 animate-ping"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute bottom-0 left-0 w-full h-16 sm:h-20 md:h-24 lg:h-32 xl:h-40 bg-gradient-to-r from-amber-50 via-transparent to-orange-50 opacity-40 pointer-events-none"></div>
      <div className="absolute top-1/3 right-0 w-16 sm:w-20 md:w-24 lg:w-32 xl:w-40 h-32 sm:h-48 md:h-64 lg:h-72 xl:h-96 bg-gradient-to-l from-red-50 to-transparent opacity-30 pointer-events-none"></div>

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

export default EmoHubLanding;