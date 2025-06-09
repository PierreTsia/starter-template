import { useIntl as useReactIntl } from 'react-intl';

import { useLanguage } from '../LanguageContext';

type TranslationValues = Record<string, string | number | boolean | Date | null | undefined>;

export const useTranslation = () => {
  const intl = useReactIntl();
  const { locale, setLocale } = useLanguage();

  return {
    t: (id: string, values?: TranslationValues) => intl.formatMessage({ id }, values),
    locale,
    setLocale,
    formatNumber: intl.formatNumber,
    formatDate: intl.formatDate,
    formatRelativeTime: intl.formatRelativeTime,
  };
};
