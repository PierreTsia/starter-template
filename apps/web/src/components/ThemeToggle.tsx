import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <Button variant="outline" onClick={toggleTheme}>
      Toggle {theme === 'light' ? '🌞' : '🌙'}
    </Button>
  );
}
