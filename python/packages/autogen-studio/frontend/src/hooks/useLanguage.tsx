import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, translations } from '../i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setCurrentLanguage] = useState<Language>('en-US');

  const handleLanguageChange = (newLanguage: Language) => {
    setCurrentLanguage(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-language', newLanguage);
      window.dispatchEvent(new CustomEvent('languageChange', { detail: newLanguage }));
    }
  };

  const t = (path: string): string => {
    const keys = path.split('.');
    let value: any = translations[language];
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        // Fallback to English if key not found
        value = translations['en-US'];
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return path; // Return the path if not found
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : path;
  };

  useEffect(() => {
    // Initialize language on client side
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('app-language') as Language;
      if (savedLanguage && (savedLanguage === 'en-US' || savedLanguage === 'zh-CN')) {
        setCurrentLanguage(savedLanguage);
      } else {
        // Try to detect browser language
        const browserLang = navigator.language;
        if (browserLang.startsWith('zh')) {
          setCurrentLanguage('zh-CN');
        }
      }
    }

    const handleCustomLanguageChange = (event: CustomEvent) => {
      setCurrentLanguage(event.detail);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('languageChange', handleCustomLanguageChange as EventListener);
      
      return () => {
        window.removeEventListener('languageChange', handleCustomLanguageChange as EventListener);
      };
    }
  }, []);

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage: handleLanguageChange,
      t,
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};