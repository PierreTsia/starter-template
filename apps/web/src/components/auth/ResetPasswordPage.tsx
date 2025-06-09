import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { resetPassword, isLoading, error } = useAuth();
  const { t } = useTranslation();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{t('auth.forgotPassword.resetPassword.invalidLink.title')}</CardTitle>
            <CardDescription>
              {t('auth.forgotPassword.resetPassword.invalidLink.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/forgot-password')} className="w-full">
              {t('auth.forgotPassword.resetPassword.invalidLink.requestNew')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPassword({ token, password: data.password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('auth.forgotPassword.resetPassword.title')}</CardTitle>
          <CardDescription>{t('auth.forgotPassword.resetPassword.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.forgotPassword.resetPassword.newPassword')}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t('auth.forgotPassword.resetPassword.newPasswordPlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.forgotPassword.resetPassword.confirmPassword')}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t(
                          'auth.forgotPassword.resetPassword.confirmPasswordPlaceholder'
                        )}
                        {...field}
                      />
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
                  {isLoading
                    ? t('auth.forgotPassword.resetPassword.submitting')
                    : t('auth.forgotPassword.resetPassword.submit')}
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
