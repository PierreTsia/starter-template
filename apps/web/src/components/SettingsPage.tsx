import { LanguageSwitcherSelect } from '@/components/LanguageSwitcherSelect';
import { ThemeSelect } from '@/components/ThemeSelect';
import { UserProfile } from '@/components/UserProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Page } from '@/components/ui/page';
import { PageTitle } from '@/components/ui/page-title';
import { useTranslation } from '@/i18n/hooks/useTranslation';

export const SettingsPage = () => {
  const { t } = useTranslation();

  return (
    <Page>
      <PageTitle title={t('settings.title')} description={t('settings.description')} centered />
      <div className="max-w-2xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.user.title')}</CardTitle>
            <CardDescription>{t('settings.user.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <UserProfile data-testid="user-profile" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('settings.app.title')}</CardTitle>
            <CardDescription>{t('settings.app.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{t('settings.app.language.title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('settings.app.language.description')}
                </p>
              </div>
              <div className="w-full max-w-xs">
                <LanguageSwitcherSelect />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{t('settings.app.theme.title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('settings.app.theme.description')}
                </p>
              </div>
              <div className="w-full max-w-xs">
                <ThemeSelect data-testid="theme-select" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
};
