import { useTranslation } from '@/i18n/hooks/useTranslation';

export interface NavFeatureItem {
  title: string;
  description: string;
  href: string;
}

export const useNavFeatureItems = (): NavFeatureItem[] => {
  const { t } = useTranslation();

  return [
    {
      title: t('navbar.features.items.dashboard.title'),
      description: t('navbar.features.items.dashboard.description'),
      href: '#',
    },
    {
      title: t('navbar.features.items.analytics.title'),
      description: t('navbar.features.items.analytics.description'),
      href: '#',
    },
    {
      title: t('navbar.features.items.settings.title'),
      description: t('navbar.features.items.settings.description'),
      href: '#',
    },
    {
      title: t('navbar.features.items.integrations.title'),
      description: t('navbar.features.items.integrations.description'),
      href: '#',
    },
    {
      title: t('navbar.features.items.storage.title'),
      description: t('navbar.features.items.storage.description'),
      href: '#',
    },
    {
      title: t('navbar.features.items.support.title'),
      description: t('navbar.features.items.support.description'),
      href: '#',
    },
  ];
};
