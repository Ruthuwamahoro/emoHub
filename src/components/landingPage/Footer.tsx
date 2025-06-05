"use client"
import React, { useState } from 'react';
import { Heart, Users, BookOpen, TrendingUp, Star, Menu, X, ArrowRight, Brain, Target, MessageCircle, Shield, Lightbulb, BarChart3, Calendar, GraduationCap, ChevronDown, Plus, Minus } from 'lucide-react';
export const Footer = () => {
    return (
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Logo and Description */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" fill="currentColor" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  emoHub
                </span>
              </div>
              <p className="text-slate-300 mb-8 max-w-md leading-relaxed">
                Building emotional intelligence through authentic human connection. 
                Join our community of growth-minded individuals transforming their emotional lives.
              </p>
              <div className="flex space-x-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-500 transition-colors cursor-pointer group">
                  <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
                </div>
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center hover:bg-purple-500 transition-colors cursor-pointer group">
                  <Users className="h-6 w-6 group-hover:scale-110 transition-transform" />
                </div>
                <div className="w-12 h-12 bg-cyan-600 rounded-xl flex items-center justify-center hover:bg-cyan-500 transition-colors cursor-pointer group">
                  <BookOpen className="h-6 w-6 group-hover:scale-110 transition-transform" />
                </div>
              </div>
            </div>
  
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-indigo-300">Platform</h3>
              <ul className="space-y-3">
                <li><a href="#about" className="text-slate-300 hover:text-indigo-300 transition-colors duration-200">About Us</a></li>
                <li><a href="#features" className="text-slate-300 hover:text-indigo-300 transition-colors duration-200">Features</a></li>
                <li><a href="#community" className="text-slate-300 hover:text-indigo-300 transition-colors duration-200">Community</a></li>
                <li><a href="#resources" className="text-slate-300 hover:text-indigo-300 transition-colors duration-200">Resources</a></li>
                <li><a href="#pricing" className="text-slate-300 hover:text-indigo-300 transition-colors duration-200">Pricing</a></li>
              </ul>
            </div>
  
            {/* Legal & Support */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-indigo-300">Support</h3>
              <ul className="space-y-3">
                <li><a href="#contact" className="text-slate-300 hover:text-indigo-300 transition-colors duration-200">Contact Us</a></li>
                <li><a href="#help" className="text-slate-300 hover:text-indigo-300 transition-colors duration-200">Help Center</a></li>
                <li><a href="#privacy" className="text-slate-300 hover:text-indigo-300 transition-colors duration-200">Privacy Policy</a></li>
                <li><a href="#terms" className="text-slate-300 hover:text-indigo-300 transition-colors duration-200">Terms of Service</a></li>
                <li><a href="#security" className="text-slate-300 hover:text-indigo-300 transition-colors duration-200">Security</a></li>
              </ul>
            </div>
          </div>
  
          {/* Bottom Bar */}
          <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm mb-4 md:mb-0">
              © 2025 emoHub. All rights reserved. Made with ❤️ for emotional wellness.
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