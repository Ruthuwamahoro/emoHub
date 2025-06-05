
"use client"
import React, { useState } from 'react';import { Heart, Users, BookOpen, TrendingUp, Star, Menu, X, ArrowRight, Brain, Target, MessageCircle, Shield, Lightbulb, BarChart3, Calendar, GraduationCap, ChevronDown, Plus, Minus } from 'lucide-react';

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  
    return (
      <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Heart className="h-6 w-6 text-white" fill="currentColor" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                emoHub
              </span>
            </div>
  
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-slate-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105">
                Home
              </a>
              <a href="#about" className="text-slate-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105">
                About
              </a>
              <a href="#features" className="text-slate-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105">
                Features
              </a>
              <a href="#community" className="text-slate-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105">
                Community
              </a>
              <a href="#contact" className="text-slate-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105">
                Contact
              </a>
            </div>
  
            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="text-slate-700 hover:text-indigo-600 px-4 py-2 text-sm font-medium transition-colors duration-200">
                Login
              </button>
              <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transform hover:scale-105 transition-all duration-200">
                Get Started
              </button>
            </div>
  
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-700 hover:text-indigo-600 p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
  
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/50">
            <div className="px-4 pt-2 pb-4 space-y-2">
              {['Home', 'About', 'Features', 'Community', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block px-3 py-2 text-slate-700 hover:text-indigo-600 text-base font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  {item}
                </a>
              ))}
              <div className="pt-2 space-y-2">
                <button className="block w-full text-left px-3 py-2 text-slate-700 hover:text-indigo-600 font-medium rounded-lg hover:bg-slate-50 transition-colors">
                  Login
                </button>
                <button className="block w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    );
  };