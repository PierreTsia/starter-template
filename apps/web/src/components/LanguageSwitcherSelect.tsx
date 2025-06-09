import { Globe } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { locales } from '@/i18n/languageDetector';

export const LanguageSwitcherSelect = () => {
  const { t, locale, setLocale } = useTranslation();

  return (
    <Select value={locale} onValueChange={setLocale}>
      <SelectTrigger className="flex items-center gap-2 w-full">
        <Globe className="w-4 h-4" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {t(`languages.${loc}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
