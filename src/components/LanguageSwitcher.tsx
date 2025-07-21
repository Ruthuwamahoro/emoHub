'use client';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { supportedLanguages } from '@/lib/i18n';

export const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
    
    // Optional: You can also store the selection in localStorage
    // This is already handled by i18next-browser-languagedetector
    localStorage.setItem('i18nextLng', langCode);
  };

  const getCurrentLanguage = () => {
    return supportedLanguages.find(lang => lang.code === i18n.language) || supportedLanguages[0];
  };

  const currentLang = getCurrentLanguage();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-rose-600 rounded-lg hover:bg-gradient-to-r hover:from-rose-50 hover:to-amber-50 transition-all duration-300 min-w-[120px]"
        aria-label={t('navigation.language')}
      >
        <Globe className="w-4 h-4 flex-shrink-0" />
        <span className="hidden sm:inline">{currentLang.name}</span>
        <span className="sm:hidden text-lg">{currentLang.flag}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 py-2 w-48 bg-white/95 backdrop-blur-lg rounded-lg shadow-lg border border-rose-100/50 z-20 animate-slideDown">
            {supportedLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gradient-to-r hover:from-rose-50 hover:to-amber-50 transition-all duration-200 flex items-center gap-3 ${
                  i18n.language === lang.code 
                    ? 'bg-gradient-to-r from-rose-50 to-amber-50 text-rose-700 font-medium' 
                    : 'text-slate-700 hover:text-slate-900'
                }`}
                aria-label={`Switch to ${lang.name}`}
              >
                <span className="text-lg" role="img" aria-label={`${lang.name} flag`}>
                  {lang.flag}
                </span>
                <span className="flex-1">{lang.name}</span>
                {i18n.language === lang.code && (
                  <Check className="w-4 h-4 text-rose-600" />
                )}
              </button>
            ))}
          </div>
        </>
      )}

      <style jsx>{`
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
        
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};