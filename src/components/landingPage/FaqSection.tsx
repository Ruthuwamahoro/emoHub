"use client"
import React, { useState } from 'react';
import { Heart, Users, BookOpen, TrendingUp, Star, Menu, X, ArrowRight, Brain, Target, MessageCircle, Shield, Lightbulb, BarChart3, Calendar, GraduationCap, ChevronDown, Plus, Minus, Mail, Phone, MapPin, Send, Sparkles, HelpCircle } from 'lucide-react';

export const FAQContactSection = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const faqs = [
    {
      question: "What makes emoHub different from therapy or counseling?",
      answer: "emoHub is a peer-to-peer community platform focused on emotional growth and connection. While we provide educational resources and support, we're not a replacement for professional therapy. We complement traditional mental health care by offering daily practice, community support, and emotional intelligence building.",
      icon: <Brain className="w-5 h-5" />
    },
    {
      question: "Is my personal information and mood data secure?",
      answer: "Absolutely. We use bank-level encryption to protect your data. Your mood tracking information is private by default, and you control what you share with the community. We never sell your personal information and follow strict privacy guidelines.",
      icon: <Shield className="w-5 h-5" />
    },
    {
      question: "How much time do I need to spend daily on emoHub?",
      answer: "You can benefit from as little as 5-10 minutes daily. Our daily challenges are designed to fit into busy schedules. Whether you have 5 minutes for a quick check-in or 30 minutes for deeper engagement, you'll find value at your own pace.",
      icon: <Calendar className="w-5 h-5" />
    },
    {
      question: "Can I use emoHub if I'm already in therapy?",
      answer: "Yes! Many of our members use emoHub alongside professional therapy. Our platform can complement your therapeutic journey by providing daily practice, peer support, and tools to track your emotional patterns between sessions.",
      icon: <Heart className="w-5 h-5" />
    },
    {
      question: "What if I'm not comfortable sharing in the community at first?",
      answer: "That's completely normal and okay! You can start by observing, using our mood tracking privately, and taking daily challenges. There's no pressure to share until you feel ready. Many members lurk for weeks before participating actively.",
      icon: <Users className="w-5 h-5" />
    },
    {
      question: "Is emoHub suitable for teenagers?",
      answer: "emoHub is designed for adults 18+. We believe emotional intelligence skills are crucial for young adults as they navigate independence, relationships, and career challenges. Our content and community guidelines are tailored for this demographic.",
      icon: <GraduationCap className="w-5 h-5" />
    }
  ];

  return (
    <div className="bg-gradient-to-br from-rose-50 via-amber-50/30 to-emerald-50/40">
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-1/4 w-64 h-64 bg-gradient-to-br from-rose-300/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-32 left-1/3 w-80 h-80 bg-gradient-to-br from-emerald-300/15 to-teal-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-white/50 mb-8">
              <HelpCircle className="w-5 h-5 text-rose-500" />
              <span className="text-slate-700 font-semibold">FAQ</span>
            </div>
            
            <h3 className="text-5xl md:text-6xl font-bold text-slate-800 mb-8 leading-tight">
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 bg-clip-text text-transparent">
                Questions
              </span>
            </h3>
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
              Everything you need to know about starting your emotional growth journey with emoHub.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/60 overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <button
                  className="w-full px-8 py-8 text-left flex justify-between items-center hover:bg-white/50 transition-all duration-200"
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-amber-400 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {faq.icon}
                    </div>
                    <span className="text-xl text-slate-900 pr-4">
                      {faq.question}
                    </span>
                  </div>
                  <div className="flex-shrink-0">
                    {openFAQ === index ? (
                      <Minus className="h-6 w-6 text-rose-500 transition-transform duration-300" />
                    ) : (
                      <Plus className="h-6 w-6 text-rose-500 transition-transform duration-300" />
                    )}
                  </div>
                </button>
                {openFAQ === index && (
                  <div className="px-8 pb-8 animate-in slide-in-from-top-2 duration-300">
                    <div className="ml-16 pl-4 border-l-2 border-gradient-to-b from-rose-200 to-amber-200">
                      <p className="text-slate-600 leading-relaxed text-lg">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQContactSection;