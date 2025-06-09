import { renderHook, act } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { describe, it, expect } from 'vitest';

import { LanguageProvider } from '../../LanguageContext';
import enMessages from '../../locales/en.json';
import { flattenMessages } from '../../utils';
import { useTranslation } from '../useTranslation';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>
    <IntlProvider messages={flattenMessages(enMessages)} locale="en" defaultLocale="en">
      {children}
    </IntlProvider>
  </LanguageProvider>
);

describe('useTranslation', () => {
  it('should provide translation function', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });
    expect(result.current.t('common.settings')).toBe('Settings');
  });

  it('should handle translation with variables', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });
    expect(result.current.t('common.welcome', { name: 'John' })).toBe('Welcome, John!');
  });

  it('should provide locale management', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });
    expect(result.current.locale).toBe('en');
    act(() => {
      result.current.setLocale('fr');
    });
    expect(result.current.locale).toBe('fr');
  });

  it('should provide number formatting', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });
    expect(result.current.formatNumber(1000)).toBe('1,000');
  });

  it('should provide date formatting', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });
    const date = new Date('2024-03-14');
    expect(result.current.formatDate(date)).toBe('3/14/2024');
  });

  it('should provide relative time formatting', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });
    expect(result.current.formatRelativeTime(-2, 'hour')).toBe('2 hours ago');
  });
});
