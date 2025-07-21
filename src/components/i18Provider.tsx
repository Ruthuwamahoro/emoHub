'use client';
import i18n from '@/lib/i18n';
import { useEffect, ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    // Ensure i18n is initialized
    if (!i18n.isInitialized) {
      i18n.init();
    }
    
    // Optional: Set default language based on user location
    // Since you're in Rwanda, you might want to default to 'rw' for local users
    const userLanguage = localStorage.getItem('i18nextLng');
    if (!userLanguage) {
      // You can implement logic to detect user location and set appropriate language
      // For now, keeping English as default
      i18n.changeLanguage('en');
    }
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}