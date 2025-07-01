"use client"
import React from 'react';
import { ArrowRight } from 'lucide-react';

export const FinalCTASection = () => {
  return (
    <section className="max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto py-8 sm:py-10 bg-slate-900 relative overflow-hidden mb-12 sm:mb-16 md:mb-20 mt-12 sm:mt-16 md:mt-20 mx-4 sm:mx-auto rounded-2xl sm:rounded-3xl">
      <div className="absolute inset-0 bg-black/10 rounded-2xl sm:rounded-3xl"></div>
      
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8 leading-tight px-2">
          Ready to Transform Your{' '}
          <span className="bg-amber-600 bg-clip-text text-transparent font-light">
            Emotional Life?
          </span>
        </h2>
        
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-indigo-100 mb-8 sm:mb-10 md:mb-12 leading-relaxed max-w-3xl mx-auto px-2">
          Join the platform to discover the power of emotional intelligence. 
          Your journey to emotional wellness starts with a single step.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-10 md:mb-12">
          <button 
            className="group bg-white text-slate-700 px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg hover:shadow-2xl hover:shadow-white/20 transform hover:scale-105 transition-all duration-300 flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center font-medium"
            onClick={() => window.location.href="/register"}
          >
            <span>Start Growing Today</span>
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </button>
        </div>
      </div>
    </section>
  );
};