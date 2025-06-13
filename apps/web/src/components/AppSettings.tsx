import { LanguageSwitcherSelect } from '@/components/LanguageSwitcherSelect';
import { ThemeSelect } from '@/components/ThemeSelect';
import { useTranslation } from '@/i18n/hooks/useTranslation';

export const AppSettings = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">{t('settings.app.language.title')}</h3>
          <p className="text-sm text-muted-foreground">{t('settings.app.language.description')}</p>
        </div>
        <div className="w-full max-w-xs">
          <LanguageSwitcherSelect />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">{t('settings.app.theme.title')}</h3>
          <p className="text-sm text-muted-foreground">{t('settings.app.theme.description')}</p>
        </div>
        <div className="w-full max-w-xs">
          <ThemeSelect data-testid="theme-select" />
        </div>
      </div>
    </div>
  );
};
