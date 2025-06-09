import { Home, MenuIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAuth, useMe } from '@/api/resources/auth/hooks';
import { LanguageSwitcherSelect } from '@/components/LanguageSwitcherSelect';
import { UserAvatar } from '@/components/UserAvatar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const features = [
  {
    title: 'Dashboard',
    description: 'Overview of your activity',
    href: '#',
  },
  {
    title: 'Analytics',
    description: 'Track your performance',
    href: '#',
  },
  {
    title: 'Settings',
    description: 'Configure your preferences',
    href: '#',
  },
  {
    title: 'Integrations',
    description: 'Connect with other tools',
    href: '#',
  },
  {
    title: 'Storage',
    description: 'Manage your files',
    href: '#',
  },
  {
    title: 'Support',
    description: 'Get help when needed',
    href: '#',
  },
];

const AppLogo = () => {
  return (
    <Link to="/" className="text-lg font-semibold tracking-tight flex items-center gap-2">
      <Home className="w-5 h-5" />
      StarterKit
    </Link>
  );
};

const FeatureLink = ({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) => {
  return (
    <Link to={href} className="rounded-md p-3 transition-colors hover:bg-muted/70">
      <div>
        <p className="mb-1 font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
};

const DesktopLinks = () => {
  return (
    <NavigationMenu className="hidden md:block">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Features</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[600px] grid-cols-2 p-3">
              {features.map((feature, index) => (
                <NavigationMenuLink
                  href={feature.href}
                  key={index}
                  className="rounded-md p-3 transition-colors hover:bg-muted/70"
                >
                  <div key={feature.title}>
                    <p className="mb-1 font-semibold text-foreground">{feature.title}</p>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link className={navigationMenuTriggerStyle()} to="/about">
            About
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
            Tasks
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link className={navigationMenuTriggerStyle()} to="/settings">
            Settings
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
            Contact
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const MobileLinks = () => {
  return (
    <>
      <Accordion type="single" collapsible className="mt-4 mb-2">
        <AccordionItem value="solutions" className="border-none">
          <AccordionTrigger className="text-base hover:no-underline">Features</AccordionTrigger>
          <AccordionContent>
            <div className="grid md:grid-cols-2">
              {features.map(({ title, description, href }, index) => (
                <FeatureLink key={index} title={title} description={description} href={href} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex flex-col gap-6">
        <Link to="/about" className="font-medium">
          About
        </Link>
        <Link to="/tasks" className="font-medium">
          Tasks
        </Link>
        <Link to="/settings" className="font-medium">
          Settings
        </Link>
        <Link to="/contact" className="font-medium">
          Contact
        </Link>
      </div>
    </>
  );
};

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
