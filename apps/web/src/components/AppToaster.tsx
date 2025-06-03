import { Toaster } from 'sonner';

import { useTheme } from '@/components/ThemeProvider';

export const AppToaster = () => {
  const { theme } = useTheme();
  return <Toaster theme={theme} />;
};
