import { Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';

import { useTheme } from '@/components/ThemeProvider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/i18n/hooks/useTranslation';

export function ThemeSelect() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    toast(t('settings.app.theme.changed', { theme: t(`settings.app.theme.${newTheme}`) }));
  };

  return (
    <Select value={theme} onValueChange={toggleTheme}>
      <SelectTrigger className="flex items-center gap-2 w-full">
        {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        <SelectValue placeholder={t('settings.app.theme.title')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">
          <div className="flex items-center gap-2">
            <span>{t('settings.app.theme.light')}</span>
          </div>
        </SelectItem>
        <SelectItem value="dark">
          <div className="flex items-center gap-2">
            <span>{t('settings.app.theme.dark')}</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
