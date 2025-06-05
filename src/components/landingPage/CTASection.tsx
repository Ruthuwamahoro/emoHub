"use client"
import React, { useState } from 'react';
import { Heart, Users, BookOpen, TrendingUp, Star, Menu, X, ArrowRight, Brain, Target, MessageCircle, Shield, Lightbulb, BarChart3, Calendar, GraduationCap, ChevronDown, Plus, Minus } from 'lucide-react';
export const FinalCTASection = () => {
    return (
      <section className="py-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-600 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>
  
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Ready to Transform Your{' '}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Emotional Life?
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-indigo-100 mb-12 leading-relaxed max-w-3xl mx-auto">
            Join thousands of people who've discovered the power of emotional intelligence and genuine human connection. 
            Your journey to emotional wellness starts with a single step.
          </p>
  
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <button className="group bg-white text-indigo-600 px-10 py-4 rounded-2xl text-lg font-bold hover:shadow-2xl hover:shadow-white/20 transform hover:scale-105 transition-all duration-300 flex items-center gap-3">
              Start Growing Today
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="text-white border-2 border-white/50 px-10 py-4 rounded-2xl text-lg font-semibold hover:bg-white/10 hover:border-white/80 transition-all duration-300">
              Learn More
            </button>
          </div>
  
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-indigo-100">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span>100% Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>50K+ Active Members</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-current" />
              <span>4.9/5 Rating</span>
            </div>
          </div>
        </div>
      </section>
    );
  };