import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { loginSchema } from '@/lib/validations/auth';
import type { LoginFormData } from '@/types/auth';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const LoginForm = ({ onSubmit, isLoading = false, children }: LoginFormProps) => {
  const { t } = useTranslation();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{t('auth.loginTitle')}</CardTitle>
        <CardDescription>{t('auth.loginDescription')}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} data-testid="login-form">
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.email')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('auth.emailPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.password')}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={t('auth.passwordPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting || isLoading}
            >
              {form.formState.isSubmitting || isLoading ? t('common.loading') : t('auth.login')}
            </Button>
            <div className="flex items-center justify-center gap-x-2">
              <Separator />
              <p className="text-center text-sm text-gray-500">{t('auth.or')}</p>
              <Separator />
            </div>
            {children}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
