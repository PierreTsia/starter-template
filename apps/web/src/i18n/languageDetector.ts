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
