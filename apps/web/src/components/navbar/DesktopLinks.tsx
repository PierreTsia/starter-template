import { Link } from 'react-router-dom';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { useNavFeatureItems } from '@/hooks/useNavFeatureItems';
import { useTranslation } from '@/i18n/hooks/useTranslation';

export const DesktopLinks = () => {
  const { t } = useTranslation();
  const features = useNavFeatureItems();

  return (
    <NavigationMenu className="hidden md:block">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>{t('navbar.features.title')}</NavigationMenuTrigger>
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
            {t('navbar.links.about')}
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
            {t('navbar.links.tasks')}
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link className={navigationMenuTriggerStyle()} to="/settings">
            {t('navbar.links.settings')}
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
            {t('navbar.links.contact')}
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
