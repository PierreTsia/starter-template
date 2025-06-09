import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { useAuth } from '@/api/resources/auth/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/i18n/hooks/useTranslation';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { forgotPassword, isLoading, error } = useAuth();
  const { t } = useTranslation();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword(data.email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('auth.forgotPassword.title')}</CardTitle>
          <CardDescription>{t('auth.forgotPassword.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.email')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('auth.forgotPassword.emailPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && (
                <div className="text-sm text-destructive">
                  {error instanceof Error ? error.message : t('common.error')}
                </div>
              )}
              <div className="flex flex-col space-y-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t('auth.forgotPassword.sending') : t('auth.forgotPassword.sendLink')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="w-full"
                >
                  {t('auth.forgotPassword.backToLogin')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
