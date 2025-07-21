"use client"
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Menu, X, ArrowRight, Brain, Sparkles } from 'lucide-react';
import { LanguageSwitcher } from '../LanguageSwitcher';

export const Navbar = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const navItems = [
    { name: t('navigation.home'), href: '#home' },
    { name: t('navigation.about'), href: '#about' },
    { name: t('navigation.features'), href: '#features' },
    { name: t('navigation.faq'), href: '#faq' }
  ];

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 py-5 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-lg shadow-lg shadow-rose-500/1' 
          : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-rose-50/30'
      }`}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-rose-200/20 to-amber-200/20 rounded-full blur-2xl transition-transform duration-1000"
            style={{
              transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.005}px)`
            }}
          />
          <div 
            className="absolute top-0 right-1/3 w-24 h-24 bg-gradient-to-br from-amber-200/15 to-emerald-200/15 rounded-full blur-xl transition-transform duration-1000"
            style={{
              transform: `translate(${mousePosition.x * -0.008}px, ${mousePosition.y * 0.003}px)`
            }}
          />
          
          <div className="absolute top-2 left-1/6 animate-float delay-100">
            <Sparkles className="w-3 h-3 text-rose-300/40 animate-pulse" />
          </div>
          <div className="absolute top-3 right-1/5 animate-float delay-700">
            <Star className="w-2 h-2 text-amber-300/50 animate-pulse delay-300" fill="currentColor" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:shadow-rose-500/50 transition-all duration-300 group-hover:scale-110">
                  <Brain className="h-6 w-6 text-white animate-pulse" fill="currentColor" />
                </div>
              </div>
              <span className="text-xl font-medium bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent hover:from-rose-600 hover:via-amber-600 hover:to-emerald-600 transition-all duration-300">
                {t('navigation.brand')}
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-1 text-sm">
              {navItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="relative group px-4 py-2 text-body-medium font-medium transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10 text-slate-700 group-hover:text-rose-600 transition-colors duration-300">
                    {item.name}
                  </span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-500 to-amber-500 group-hover:w-full transition-all duration-300"></div>
                </a>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Language Switcher */}
              
              {/* Login Link */}
              <a
                href="/login"
                className="relative group text-orange-700 hover:text-rose-600 px-4 py-2 text-body-medium font-medium transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10">{t('navigation.login')}</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-500 to-amber-500 group-hover:w-full transition-all duration-300"></div>
              </a>
              
              <a
                href="/register"
                className="group relative bg-gradient-to-r from-slate-700 to-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <span className="relative z-10 flex items-center gap-2">
                  {t('navigation.getStarted')}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-400 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
              </a>
              <LanguageSwitcher />

            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative group text-slate-700 hover:text-rose-600 p-2 rounded-lg hover:bg-gradient-to-r hover:from-rose-50 hover:to-amber-50 transition-all duration-300"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                <div className="relative z-10">
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-rose-100 to-amber-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden fixed top-[100px] left-32 right-0 z-40 bg-white/95 backdrop-blur-lg shadow-lg animate-slideDown" data-aos="slide-right">
          <div className="px-4 pt-2 pb-4 space-y-2 relative max-h-[calc(100vh-88px)] overflow-y-auto">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-rose-200/20 to-amber-200/20 rounded-full blur-xl"></div>
            <div>
                <LanguageSwitcher />
            </div>
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="relative group block px-4 py-3 hover:font-bold text-slate-700 hover:text-white text-base font-medium rounded-lg transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10">{item.name}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg opacity-0 group-hover:opacity-30 blur transition-all duration-300"></div>
              </a>
            ))}
            

            <div className="pt-2 space-y-3">
              
              <a
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="relative group block w-full text-left px-4 py-3 text-slate-700 hover:text-rose-600 font-medium rounded-lg hover:bg-gradient-to-r hover:from-rose-50 hover:to-amber-50 transition-all duration-300"
              >
                <span className="relative z-10">{t('navigation.login')}</span>
                <div className="absolute bottom-1 left-4 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 group-hover:w-16 transition-all duration-300"></div>
              </a>
              
              <a
                href="/register"
                onClick={() => setIsMenuOpen(false)}
                className="group relative block w-full bg-gradient-to-r from-slate-700 to-slate-900 text-white px-4 py-3 rounded-xl text-sm font-semibold shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {t('navigation.getStarted')}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </a>
            </div>
          </div>
        </div>
      )}

      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-5px) rotate(1deg); }
          50% { transform: translateY(-10px) rotate(-1deg); }
          75% { transform: translateY(-5px) rotate(0.5deg); }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </>
  );
};