"use client"
import React from 'react';
import { Heart, Brain } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="col-span-1 sm:col-span-2 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6 relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:shadow-rose-500/50 transition-all duration-300 group-hover:scale-110 relative">
                <Brain className="h-4 w-4 sm:h-6 sm:w-6 text-white animate-pulse" fill="currentColor" />
                <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-amber-400 to-emerald-400 rounded-full animate-ping"></div>
                <div className="absolute -bottom-0.5 -left-0.5 sm:-bottom-1 sm:-left-1 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-br from-rose-400 to-amber-400 rounded-full animate-pulse delay-500"></div>
              </div>
            </div>
            
            <p className="text-slate-300 mb-6 sm:mb-8 max-w-md leading-relaxed text-sm sm:text-base">
              Building emotional intelligence through authentic human connection. 
              Join our community of growth-minded individuals transforming their emotional lives.
            </p>
          </div>

          <div className="order-3 sm:order-2">
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-amber-500">Platform</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="#about" className="text-slate-300 hover:text-indigo-300 transition-colors duration-200 text-sm sm:text-base">About Us</a></li>
              <li><a href="#community" className="text-slate-300 hover:text-indigo-300 transition-colors duration-200 text-sm sm:text-base">Community</a></li>
              <li><a href="#resources" className="text-slate-300 hover:text-indigo-300 transition-colors duration-200 text-sm sm:text-base">Resources</a></li>
            </ul>
          </div>

          <div className="order-4 sm:order-3">
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-amber-500">Support</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="#contact" className="text-slate-300 hover:text-indigo-300 transition-colors duration-200 text-sm sm:text-base">Contact Us</a></li>
              <li><a href="#privacy" className="text-slate-300 hover:text-indigo-300 transition-colors duration-200 text-sm sm:text-base">Privacy Policy</a></li>
              <li><a href="#terms" className="text-slate-300 hover:text-indigo-300 transition-colors duration-200 text-sm sm:text-base">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <p className="text-slate-400 text-xs sm:text-sm order-2 md:order-1">
            © 2025 emoHub. All rights reserved.
          </p>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 order-1 md:order-2 w-full md:w-auto">
            <div className="flex space-x-4 text-xs sm:text-sm order-2 sm:order-1">
              <a href="#privacy" className="text-slate-400 hover:text-indigo-300 transition-colors">Privacy</a>
              <a href="#terms" className="text-slate-400 hover:text-indigo-300 transition-colors">Terms</a>
              <a href="#cookies" className="text-slate-400 hover:text-indigo-300 transition-colors">Cookies</a>
            </div>
            
            <div className="flex items-center space-x-2 text-slate-400 text-xs sm:text-sm order-1 sm:order-2">
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600 fill-current flex-shrink-0" />
              <span>Spreading emotional wellness</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};