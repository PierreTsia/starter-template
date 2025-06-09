import { Home, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

import { LanguageSwitcherSelect } from './LanguageSwitcherSelect';
import { UserAvatar } from './UserAvatar';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { useTranslation } from '@/i18n/hooks/useTranslation';

export const Navbar = () => {
  const { t } = useTranslation();

  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 border-b bg-background h-[var(--navbar-height)]">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-lg font-semibold tracking-tight flex items-center gap-2">
          <Home className="w-5 h-5" />
          StarterKit
        </Link>
      </div>
      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-4">
        <Link to="/settings">
          <Button variant="outline">{t('common.settings')}</Button>
        </Link>
        <LanguageSwitcherSelect />
        <UserAvatar />
      </div>
      {/* Mobile hamburger */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetTitle>{t('navigation.menu.title')}</SheetTitle>
            <SheetDescription>{t('navigation.menu.description')}</SheetDescription>

            <div className="flex items-center gap-3 mt-4 mb-6">
              <UserAvatar showDetails className="w-full flex justify-start items-center" />
            </div>

            <div className="flex flex-col gap-4 mt-8">
              <LanguageSwitcherSelect />
              <Link to="/settings">
                <Button variant="outline" className="w-full">
                  {t('common.settings')}
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};
