import { LanguageSwitcherSelect } from '@/components/LanguageSwitcherSelect';
import { ThemeSelect } from '@/components/ThemeSelect';
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
        {/* User Settings Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.user.title')}</CardTitle>
            <CardDescription>{t('settings.user.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-muted" />
              <div>
                <h3 className="font-medium">John Doe</h3>
                <p className="text-sm text-muted-foreground">john.doe@example.com</p>
              </div>
            </div>
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium">{t('settings.user.displayName')}</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="John Doe"
                  disabled
                />
              </div>
              <div>
                <label className="text-sm font-medium">{t('settings.user.email')}</label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="john.doe@example.com"
                  disabled
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Settings Section */}
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
                <ThemeSelect />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
};
