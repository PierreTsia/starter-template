import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { IntlProvider } from 'react-intl';

// Import messages
import enMessages from './en.json';
import frMessages from './fr.json';
import { Locale, getLocaleFromBrowser } from './languageDetector';

type Messages = {
  [key: string]: string | Messages;
};

const messages: Record<Locale, Messages> = {
  en: enMessages,
  fr: frMessages,
} as const;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    // Try to get from localStorage first
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && ['en', 'fr'].includes(savedLocale)) {
      return savedLocale;
    }
    // Fallback to browser language
    return getLocaleFromBrowser();
  });

  useEffect(() => {
    // Save to localStorage whenever locale changes
    localStorage.setItem('locale', locale);
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      <IntlProvider
        messages={messages[locale] as Record<string, string>}
        locale={locale}
        defaultLocale="en"
      >
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Convenience hook for translations
export function useTranslation() {
  const { locale } = useLanguage();
  return {
    locale,
    messages: messages[locale],
  };
}
