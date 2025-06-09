import { MenuIcon } from 'lucide-react';

import { AppLogo } from './navbar/AppLogo';
import { DesktopLinks } from './navbar/DesktopLinks';
import { MobileLinks } from './navbar/MobileLinks';

import { useAuth, useMe } from '@/api/resources/auth/hooks';
import { LanguageSwitcherSelect } from '@/components/LanguageSwitcherSelect';
import { UserAvatar } from '@/components/UserAvatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export const Navbar = () => {
  const { logout } = useAuth();
  const { data: user, refetch } = useMe();

  const isAuthenticated = !!user;

  const handleLogout = () => {
    logout();
    refetch();
  };

  return (
    <section className="py-4 h-[var(--navbar-height)]">
      <div className="px-4">
        <nav className="flex items-center justify-between">
          <AppLogo />
          {/* Desktop links */}
          {isAuthenticated && <DesktopLinks />}

          <div className="hidden items-center gap-4 md:flex">
            <LanguageSwitcherSelect />
            {isAuthenticated && <UserAvatar user={user} handleLogout={handleLogout} />}
          </div>
          {/* Mobile hamburger */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <MenuIcon className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="max-h-screen overflow-auto">
              <SheetHeader>
                <SheetTitle>
                  <AppLogo />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col p-4">
                {isAuthenticated && <MobileLinks />}
                <div className="mt-6 flex flex-col gap-4">
                  <LanguageSwitcherSelect />
                  {isAuthenticated && <Button onClick={handleLogout}>Logout</Button>}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </section>
  );
};
