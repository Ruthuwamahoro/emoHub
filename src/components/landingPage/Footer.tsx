"use client"
import React from 'react';
import { Heart, Brain} from 'lucide-react';
export const Footer = () => {
    return (
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">


              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-400 via-amber-400 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:shadow-rose-500/50 transition-all duration-300 group-hover:scale-110">
                  <Brain className="h-6 w-6 text-white animate-pulse" fill="currentColor" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-amber-400 to-emerald-400 rounded-full animate-ping"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-br from-rose-400 to-amber-400 rounded-full animate-pulse delay-500"></div>
              </div>
              <p className="text-slate-300 mb-8 max-w-md leading-relaxed">
                Building emotional intelligence through authentic human connection. 
                Join our community of growth-minded individuals transforming their emotional lives.
              </p>
            </div>
  
            <div>
              <h3 className="text-lg font-semibold mb-6 text-orange-500">Platform</h3>
              <ul className="space-y-3">
                <li><a href="#about" className="text-slate-300 hover:text-indigo-300 transition-colors duration-200">About Us</a></li>
                <li><a href="#community" className="text-slate-300 hover:text-indigo-300 transition-colors duration-200">Community</a></li>
                <li><a href="#resources" className="text-slate-300 hover:text-indigo-300 transition-colors duration-200">Resources</a></li>
              </ul>
            </div>
  
            <div>
              <h3 className="text-lg font-semibold mb-6 text-orange-500">Support</h3>
              <ul className="space-y-3">
                <li><a href="#contact" className="text-slate-300 hover:text-indigo-300 transition-colors duration-200">Contact Us</a></li>
                <li><a href="#privacy" className="text-slate-300 hover:text-indigo-300 transition-colors duration-200">Privacy Policy</a></li>
                <li><a href="#terms" className="text-slate-300 hover:text-indigo-300 transition-colors duration-200">Terms of Service</a></li>
              </ul>
            </div>
          </div>
  
          <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm mb-4 md:mb-0">
              © 2025 emoHub. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex space-x-4 text-sm">
                <a href="#privacy" className="text-slate-400 hover:text-indigo-300 transition-colors">Privacy</a>
                <a href="#terms" className="text-slate-400 hover:text-indigo-300 transition-colors">Terms</a>
                <a href="#cookies" className="text-slate-400 hover:text-indigo-300 transition-colors">Cookies</a>
              </div>
              <div className="flex items-center space-x-2 text-slate-400 text-sm">
                <Heart className="h-4 w-4 text-red-400 fill-current" />
                <span>Spreading emotional wellness</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  };