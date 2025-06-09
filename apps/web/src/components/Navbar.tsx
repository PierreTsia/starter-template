import { Menu } from 'lucide-react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';

export const Navbar = () => {
  const { formatMessage } = useIntl();

  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 border-b bg-background h-[var(--navbar-height)]">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-lg font-semibold tracking-tight">
          MyApp
        </Link>
      </div>
      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-4">
        <Link to="/buggy" className="text-sm text-muted-foreground hover:text-foreground">
          Buggy Counter
        </Link>
        <span className="text-muted-foreground">|</span>
        <Link to="/tanstack-demo" className="text-sm text-muted-foreground hover:text-foreground">
          TanStack Demo
        </Link>
        <span className="text-muted-foreground">|</span>
        <Link to="/settings">
          <Button variant="outline">{formatMessage({ id: 'common.settings' })}</Button>
        </Link>
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
            <div className="flex flex-col gap-4 mt-8">
              <Link to="/buggy" className="text-base text-foreground">
                Buggy Counter
              </Link>
              <Link to="/tanstack-demo" className="text-base text-foreground">
                TanStack Demo
              </Link>
              <Link to="/settings">
                <Button variant="outline" className="w-full">
                  {formatMessage({ id: 'common.settings' })}
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};
