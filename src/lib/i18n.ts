import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import your translation files
import enTranslations from '../locales/en.json';
import rwTranslations from '../locales/rw.json';

// Define supported languages
export const supportedLanguages = [
  {
    code: 'en',
    name: 'English',
    flag: '🇬🇧'
  },
  {
    code: 'rw',
    name: 'Kinyarwanda',
    flag: '🇷🇼'
  }
];

// Get language codes for i18next
export const supportedLanguageCodes = supportedLanguages.map(lang => lang.code);

// Configure i18next
i18n
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    // Translation resources
    resources: {
      en: {
        translation: enTranslations
      },
      rw: {
        translation: rwTranslations
      }
    },
    
    // Fallback language
    fallbackLng: 'en',
    
    // Supported languages
    supportedLngs: supportedLanguageCodes,
    
    // Language detection options
    detection: {
      // Order of language detection methods
      order: ['localStorage', 'navigator', 'htmlTag'],
      // Cache user language
      caches: ['localStorage'],
      // Key to store language in localStorage
      lookupLocalStorage: 'i18nextLng'
    },
    
    // Interpolation options
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // Debugging (set to false in production)
    debug: process.env.NODE_ENV === 'development',
    
    // Key separator (use . for nested keys)
    keySeparator: '.',
    
    // Namespace separator
    nsSeparator: ':',
    
    // React options
    react: {
      useSuspense: false, // Disable suspense mode for SSR compatibility
    }
  });

export default i18n;