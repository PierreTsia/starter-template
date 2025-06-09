import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { IntlProvider } from 'react-intl';

import { Locale, getCurrentLocale } from './languageDetector';
import enMessages from './locales/en.json';
import frMessages from './locales/fr.json';
import { flattenMessages, type Messages } from './utils';

// Import messages

const messages: Record<Locale, Messages> = {
  en: enMessages,
  fr: frMessages,
} as const;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>(getCurrentLocale);

  useEffect(() => {
    // Save to localStorage whenever locale changes
    localStorage.setItem('locale', locale);
  }, [locale]);

  // Flatten messages for the current locale
  const flattenedMessages = flattenMessages(messages[locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      <IntlProvider messages={flattenedMessages} locale={locale} defaultLocale="en">
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
