import { Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';

import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    toast('Theme changed to ' + (theme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
};
