import { LogOut } from 'lucide-react';

import { useAuth, useMe } from '@/api/resources/auth/hooks';
import { Avatar as ShadAvatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/i18n/hooks/useTranslation';

interface AvatarProps {
  showDetails?: boolean;
  className?: string;
}

export const UserAvatar = ({ showDetails = false, className }: AvatarProps) => {
  const { logout } = useAuth();
  const { data: user, refetch } = useMe();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    refetch();
  };

  const initials =
    user?.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'U';

  if (!user) return null;

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <ShadAvatar className="h-8 w-8">
              <AvatarFallback className="bg-gray-800 text-white">{initials}</AvatarFallback>
            </ShadAvatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t('auth.logout')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {showDetails && (
        <div className="flex flex-col ml-3">
          <span className="text-sm font-medium leading-none">{user.name}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
      )}
    </div>
  );
};
