import { match } from '@formatjs/intl-localematcher';

export type Locale = 'en' | 'fr';

export const locales: Locale[] = ['en', 'fr'];
export const defaultLocale: Locale = 'en';

export function getLocaleFromBrowser(): Locale {
  try {
    return match(navigator.languages, locales, defaultLocale) as Locale;
  } catch {
    return defaultLocale;
  }
}

/**
 * Get the current locale using the following priority:
 * 1. localStorage if available and valid
 * 2. Browser language if available and supported
 * 3. Default locale (en)
 */
export function getCurrentLocale(): Locale {
  // Try to get from localStorage first
  const savedLocale = localStorage.getItem('locale') as Locale;
  if (savedLocale && locales.includes(savedLocale)) {
    return savedLocale;
  }

  // Fallback to browser language
  return getLocaleFromBrowser();
}
